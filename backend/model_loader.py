import json
import os
import shutil
import tempfile
from pathlib import Path

import h5py

BASE_DIR = Path(__file__).resolve().parent
MODEL_DIR = BASE_DIR / "model"
DEFAULT_MODEL_PATH = MODEL_DIR / "hair-diseases.hdf5"
MODEL_FILE_ID = "1av9OA2czbw4n0KQnpPa3fHgjWdQ01zJH"
MODEL_URL = f"https://drive.google.com/uc?export=download&id={MODEL_FILE_ID}"
MIN_MODEL_SIZE_BYTES = 1_000_000
UNSUPPORTED_CONFIG_KEYS = {"quantization_config"}


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


def _strip_unsupported_config_keys(value):
    if isinstance(value, dict):
        cleaned = {}
        for key, item in value.items():
            if key in UNSUPPORTED_CONFIG_KEYS:
                continue
            cleaned[key] = _strip_unsupported_config_keys(item)
        return cleaned

    if isinstance(value, list):
        return [_strip_unsupported_config_keys(item) for item in value]

    return value


def _prepare_compatible_model_file(model_path: Path) -> Path:
    temp_dir = Path(tempfile.mkdtemp(prefix="scalpfree-model-"))
    temp_model_path = temp_dir / model_path.name
    shutil.copy2(model_path, temp_model_path)

    with h5py.File(temp_model_path, "r+") as h5_file:
        raw_config = h5_file.attrs.get("model_config")
        if raw_config is None:
            return temp_model_path

        if isinstance(raw_config, bytes):
            raw_config = raw_config.decode("utf-8")

        model_config = json.loads(raw_config)
        cleaned_config = _strip_unsupported_config_keys(model_config)
        h5_file.attrs.modify("model_config", json.dumps(cleaned_config))

    return temp_model_path


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

    downloaded_path = None

    try:
        downloaded_path = gdown.download(
            id=MODEL_FILE_ID,
            output=str(model_path),
            quiet=False,
        )
    except TypeError:
        downloaded_path = gdown.download(
            MODEL_URL,
            output=str(model_path),
            quiet=False,
        )

    if not downloaded_path or not _is_valid_model_file(model_path):
        size = model_path.stat().st_size if model_path.exists() else 0
        if model_path.exists():
            model_path.unlink()
        raise RuntimeError(
            "Model download failed or is corrupted: "
            f"{model_path} (downloaded {size} bytes)."
        )

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

    custom_objects = {"MultiHeadAttention": MultiHeadAttention}

    try:
        model = tf.keras.models.load_model(
            str(model_path),
            compile=False,
            custom_objects=custom_objects,
        )
    except TypeError as exc:
        if "quantization_config" not in str(exc):
            raise

        compatible_path = _prepare_compatible_model_file(model_path)
        model = tf.keras.models.load_model(
            str(compatible_path),
            compile=False,
            custom_objects=custom_objects,
        )

    print(f"Model loaded successfully from {model_path}")
    return model
