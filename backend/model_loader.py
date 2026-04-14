import os
import gdown
import tensorflow as tf
from tensorflow.keras import layers, models

MODEL_PATH = "model/hair-diseases.hdf5"

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


def download_model():
    if not os.path.exists(MODEL_PATH):
        os.makedirs("model", exist_ok=True)

        print("⬇ Downloading model from Google Drive...")

        url = "https://drive.google.com/file/d/1As3X27IkWqnpZcnrfRFzgZcTHs3X7M7n/view?usp=sharing"
        gdown.download(url, MODEL_PATH, quiet=False)

        print("✅ Model downloaded")


def load_model_safe():
    download_model()

    model = build_model()
    model.load_weights(MODEL_PATH)

    print("✅ Model loaded successfully")

    return model