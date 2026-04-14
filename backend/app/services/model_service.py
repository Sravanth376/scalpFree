"""
ScalpFree Model Service
Loads the pre-trained Keras model and exposes a single predict() method.
"""

import logging

import numpy as np
from PIL import Image

from model_loader import load_model_safe

logger = logging.getLogger(__name__)

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

IMG_SIZE = (128, 128)


class ModelService:
    """Singleton wrapper around the TensorFlow/Keras model."""

    _model = None

    @classmethod
    def load(cls) -> None:
        if cls._model is not None:
            return

        logger.info("Loading model via shared model loader")
        cls._model = load_model_safe()
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
        if cls._model is None:
            raise RuntimeError("Model is not loaded. Call ModelService.load() first.")

        tensor = cls._preprocess(image)
        predictions = cls._model.predict(tensor, verbose=0)
        probabilities = predictions[0]

        top_idx = int(np.argmax(probabilities))
        confidence = float(probabilities[top_idx])
        disease = CLASS_LABELS[top_idx]

        all_scores = [
            {"label": CLASS_LABELS[i], "score": round(float(score), 4)}
            for i, score in enumerate(probabilities)
        ]
        all_scores.sort(key=lambda item: item["score"], reverse=True)

        logger.info("Prediction: %s (%.1f%%)", disease, confidence * 100)
        return {
            "disease": disease,
            "confidence": round(confidence, 4),
            "all_scores": all_scores,
        }

    @staticmethod
    def _preprocess(image: Image.Image) -> np.ndarray:
        img = image.convert("RGB")
        img = img.resize(IMG_SIZE, Image.LANCZOS)
        arr = np.array(img, dtype=np.float32) / 255.0
        return np.expand_dims(arr, axis=0)
