import os
import gdown
import tensorflow as tf
from tensorflow.keras import layers, models

MODEL_PATH = "model/hair-diseases.hdf5"

# =====================================================
# BUILD MODEL ARCHITECTURE
# =====================================================
def build_model():
    inputs = layers.Input(shape=(128, 128, 3))

    x = layers.Conv2D(32, 3, activation="relu")(inputs)
    x = layers.MaxPooling2D()(x)

    x = layers.Conv2D(64, 3, activation="relu")(x)
    x = layers.MaxPooling2D()(x)

    x = layers.Conv2D(128, 3, activation="relu")(x)
    x = layers.MaxPooling2D()(x)

    x = layers.Flatten()(x)
    x = layers.Dense(256, activation="relu")(x)
    outputs = layers.Dense(10, activation="softmax")(x)

    model = models.Model(inputs, outputs)
    return model


# =====================================================
# DOWNLOAD MODEL (FIXED)
# =====================================================
def download_model():
    # 🔥 Re-download if missing OR corrupted
    if not os.path.exists(MODEL_PATH) or os.path.getsize(MODEL_PATH) < 1000000:
        os.makedirs("model", exist_ok=True)

        print("⬇ Downloading model from Google Drive...")

        file_id = "1As3X27IkWqnpZcnrfRFzgZcTHs3X7M7n"

        gdown.download(
            id=file_id,
            output=MODEL_PATH,
            quiet=False
        )

        # ✅ Safety check
        if not os.path.exists(MODEL_PATH) or os.path.getsize(MODEL_PATH) < 1000000:
            raise Exception("❌ Model download failed or corrupted")

        print("✅ Model downloaded successfully")


# =====================================================
# LOAD MODEL SAFELY
# =====================================================
def load_model_safe():
    download_model()

    model = build_model()
    model.load_weights(MODEL_PATH)

    print("✅ Model loaded successfully")

    return model