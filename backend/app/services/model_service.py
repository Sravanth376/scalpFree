"""
ScalpFree – Model Service
Loads the pre-trained Keras (.hdf5) model and exposes a single predict()
method that accepts a raw PIL Image and returns a disease name + confidence.
"""

import logging
import os
from pathlib import Path

import numpy as np
from PIL import Image

logger = logging.getLogger(__name__)

# ── Class labels (order MUST match the training label encoding) ───────────────
# The model outputs 10 classes. Adjust names here if your dataset used
# different ordering – match whatever LabelEncoder / class_indices was used.
CLASS_LABELS = [
    "Alopecia Areata",
    "Contact Dermatitis",
    "Folliculitis",
    "Head Lice (Pediculosis Capitis)",
    "Lichen Planus",
    "Male Pattern Baldness",
    "Psoriasis",
    "Ringworm (Tinea Capitis)",
    "Seborrheic Dermatitis",
    "Telogen Effluvium",
]

# ── Model input spec ─────────────────────────────────────────────────────────
IMG_SIZE = (128, 128)   # must match model's batch_input_shape
NUM_CLASSES = 10


class ModelService:
    """Singleton wrapper around the TensorFlow/Keras model."""

    _model = None  # lazy-loaded once via load()

    # ── Public API ────────────────────────────────────────────────────────────

    @classmethod
    def load(cls) -> None:
        """Load the .hdf5 model from MODEL_PATH env variable (or default path)."""
        if cls._model is not None:
            return  # already loaded

        model_path = Path(os.getenv("MODEL_PATH", "model/hair-diseases.hdf5"))
        if not model_path.exists():
            raise FileNotFoundError(
                f"Model file not found at '{model_path}'. "
                "Set MODEL_PATH in your .env or copy the file there."
            )

        # Import TensorFlow lazily so startup fails early with a clear message
        try:
            import tensorflow as tf
        except ImportError as exc:
            raise ImportError(
                "TensorFlow is not installed. Run: pip install tensorflow"
            ) from exc

        logger.info("Loading model from %s …", model_path)
        cls._model = tf.keras.models.load_model(str(model_path), compile=False)
        logger.info(
            "Model input shape: %s | output shape: %s",
            cls._model.input_shape,
            cls._model.output_shape,
        )

    @classmethod
    def is_loaded(cls) -> bool:
        return cls._model is not None

    @classmethod
    def predict(cls, image: Image.Image) -> dict:
        """
        Run inference on a PIL image.

        Returns
        -------
        dict with keys:
            disease   – str   predicted disease name
            confidence – float  probability [0, 1]
            all_scores – list of {label, score} sorted by score desc
        """
        if cls._model is None:
            raise RuntimeError("Model is not loaded. Call ModelService.load() first.")

        tensor = cls._preprocess(image)                  # (1, 128, 128, 3)
        predictions = cls._model.predict(tensor, verbose=0)  # (1, 10)
        probabilities = predictions[0]                   # (10,)

        top_idx = int(np.argmax(probabilities))
        confidence = float(probabilities[top_idx])
        disease = CLASS_LABELS[top_idx]

        all_scores = [
            {"label": CLASS_LABELS[i], "score": round(float(p), 4)}
            for i, p in enumerate(probabilities)
        ]
        all_scores.sort(key=lambda x: x["score"], reverse=True)

        logger.info("Prediction: %s (%.1f%%)", disease, confidence * 100)
        return {
            "disease": disease,
            "confidence": round(confidence, 4),
            "all_scores": all_scores,
        }

    # ── Private helpers ───────────────────────────────────────────────────────

    @staticmethod
    def _preprocess(image: Image.Image) -> np.ndarray:
        """Resize → RGB → float32 normalise → add batch dim."""
        img = image.convert("RGB")
        img = img.resize(IMG_SIZE, Image.LANCZOS)
        arr = np.array(img, dtype=np.float32) / 255.0   # [0, 1]
        return np.expand_dims(arr, axis=0)               # (1, H, W, C)
