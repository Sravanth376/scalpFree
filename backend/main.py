print("STEP 1: file loaded")

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi
from dotenv import load_dotenv
from uuid import uuid4
import os
import io
import numpy as np
from PIL import Image

from model_loader import load_model_safe

print("STEP 2: imports done")

# =====================================================
# ENV
# =====================================================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(BASE_DIR, ".env"))

UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

# =====================================================
# APP
# =====================================================
app = FastAPI(title="ScalpFree API")
print("STEP 3: app created")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# =====================================================
# OPENAPI (NO AUTH)
# =====================================================
def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema

    schema = get_openapi(
        title="ScalpFree API",
        version="1.0.0",
        description="AI Scalp Disease Detection API",
        routes=app.routes,
    )

    app.openapi_schema = schema
    return app.openapi_schema


app.openapi = custom_openapi

CLASS_NAMES = [
    "Alopecia Areata",
    "Contact Dermatitis",
    "Folliculitis",
    "Head Lice",
    "Lichen Planus",
    "Male Pattern Baldness",
    "Psoriasis",
    "Seborrheic Dermatitis",
    "Telogen Effluvium",
    "Tinea Capitis",
]

# =====================================================
# LOAD MODEL (ONLY ONCE)
# =====================================================
print("Loading model at startup...")
model = load_model_safe()
print("Model ready")


# =====================================================
# IMAGE PREPROCESSING
# =====================================================
def preprocess_image(image_bytes: bytes):
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img = img.resize((128, 128))
    arr = np.array(img, dtype=np.float32) / 255.0
    return np.expand_dims(arr, axis=0)


# =====================================================
# ROUTES
# =====================================================
@app.get("/")
def root():
    return {"status": "ScalpFree API running"}


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        print("Request received")

        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="Invalid image file")

        image_bytes = await file.read()

        if not image_bytes:
            raise HTTPException(status_code=400, detail="Empty image")

        filename = f"{uuid4()}.jpg"
        image_path = os.path.join(UPLOAD_DIR, filename)

        with open(image_path, "wb") as f:
            f.write(image_bytes)

        img = preprocess_image(image_bytes)

        # TODO: replace demo response with real model inference.
        import random

        idx = random.randint(0, len(CLASS_NAMES) - 1)
        confidence = random.uniform(70, 95)
        disease = CLASS_NAMES[idx]

        print("Prediction done")

        return {
            "status": "PREDICTION",
            "disease": disease,
            "confidence": round(confidence, 2),
        }

    except Exception as e:
        print("ERROR:", str(e))

        return {
            "status": "FAILED",
            "disease": "Demo Result",
            "confidence": 75.0,
            "error": str(e),
        }
