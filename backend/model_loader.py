from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
MODEL_DIR = BASE_DIR / "model"
MODEL_PATH = MODEL_DIR / "hair-diseases.hdf5"
MODEL_FILE_ID = "1As3X27IkWqnpZcnrfRFzgZcTHs3X7M7n"
MIN_MODEL_SIZE_BYTES = 1_000_000


def _is_valid_model_file(path: Path) -> bool:
    return path.exists() and path.stat().st_size >= MIN_MODEL_SIZE_BYTES


def download_model() -> Path:
    MODEL_DIR.mkdir(parents=True, exist_ok=True)

    if _is_valid_model_file(MODEL_PATH):
        print(f"Model found at {MODEL_PATH}")
        return MODEL_PATH

    if MODEL_PATH.exists():
        print(f"Removing incomplete model file at {MODEL_PATH}")
        MODEL_PATH.unlink()

    print("Downloading model from Google Drive...")
    import gdown

    gdown.download(id=MODEL_FILE_ID, output=str(MODEL_PATH), quiet=False)

    if not _is_valid_model_file(MODEL_PATH):
        raise RuntimeError(f"Model download failed or is corrupted: {MODEL_PATH}")

    print("Model downloaded successfully")
    return MODEL_PATH


def load_model_safe():
    import tensorflow as tf

    model_path = download_model()
    try:
        from keras_multi_head import MultiHeadAttention
    except ImportError as exc:
        raise RuntimeError(
            "Missing dependency 'keras-multi-head'. Install backend requirements "
            "before starting the API."
        ) from exc

    model = tf.keras.models.load_model(
        str(model_path),
        compile=False,
        custom_objects={"MultiHeadAttention": MultiHeadAttention},
    )

    print(f"Model loaded successfully from {model_path}")
    return model
