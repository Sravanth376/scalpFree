import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
MODEL_DIR = BASE_DIR / "model"
DEFAULT_MODEL_PATH = MODEL_DIR / "hair-diseases.hdf5"
MODEL_FILE_ID = "1As3X27IkWqnpZcnrfRFzgZcTHs3X7M7n"
MODEL_URL = f"https://drive.google.com/uc?id={MODEL_FILE_ID}"
MIN_MODEL_SIZE_BYTES = 1_000_000


def _resolve_model_path() -> Path:
    configured_path = os.getenv("MODEL_PATH")
    if configured_path:
        path = Path(configured_path)
        if not path.is_absolute():
            path = BASE_DIR / path
        return path
    return DEFAULT_MODEL_PATH


def _has_hdf5_signature(path: Path) -> bool:
    try:
        with path.open("rb") as file_obj:
            return file_obj.read(8) == b"\x89HDF\r\n\x1a\n"
    except OSError:
        return False


def _is_valid_model_file(path: Path) -> bool:
    return (
        path.exists()
        and path.stat().st_size >= MIN_MODEL_SIZE_BYTES
        and _has_hdf5_signature(path)
    )


def download_model() -> Path:
    model_path = _resolve_model_path()
    model_path.parent.mkdir(parents=True, exist_ok=True)

    if _is_valid_model_file(model_path):
        print(f"Model found at {model_path}")
        return model_path

    if model_path.exists():
        print(f"Removing invalid model file at {model_path}")
        model_path.unlink()

    print("Downloading model from Google Drive...")
    import gdown

    downloaded_path = gdown.download(
        MODEL_URL,
        output=str(model_path),
        quiet=False,
    )

    if not downloaded_path or not _is_valid_model_file(model_path):
        if model_path.exists():
            model_path.unlink()
        raise RuntimeError(f"Model download failed or is corrupted: {model_path}")

    print("Model downloaded successfully")
    return model_path


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
