print("🔥 STEP 1: file loaded")

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi
from dotenv import load_dotenv
from uuid import uuid4
import os
import io
import numpy as np
from PIL import Image
import gdown

# ✅ MODEL LOADER
from backend.model_loader import load_model_safe

print("🔥 STEP 2: imports done")

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
print("🔥 STEP 3: app created")

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

# =====================================================
# MODEL CONFIG
# =====================================================
MODEL_PATH = os.path.join(BASE_DIR, "model", "hair-diseases.hdf5")
os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)

model = None

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
    global model

    try:
        print("🔥 Step 1: Request received")

        import tensorflow as tf
        tf.get_logger().setLevel('ERROR')

        # ✅ Validate file
        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="Invalid image file")

        print("🔥 Step 2: Reading image")
        image_bytes = await file.read()

        if not image_bytes:
            raise HTTPException(status_code=400, detail="Empty image")

        print("🔥 Step 3: Saving image")
        filename = f"{uuid4()}.jpg"
        image_path = os.path.join(UPLOAD_DIR, filename)

        with open(image_path, "wb") as f:
            f.write(image_bytes)

        print("🔥 Step 4: Checking model file")

        # ✅ Download model if not exists
        if not os.path.exists(MODEL_PATH):
            print("⬇️ Downloading model...")
            file_id = "1As3X27IkWqnpZcnrfRFzgZcTHs3X7M7n"
            url = f"https://drive.google.com/uc?id={file_id}"
            gdown.download(url, MODEL_PATH, quiet=False)

        print("🔥 Step 5: Loading model")

        # ✅ Load model safely
        if model is None:
            model = load_model_safe()
            print("✅ Model loaded")

        print("🔥 Step 6: Preprocessing image")
        img = preprocess_image(image_bytes)

        print("🔥 Step 7: Predicting")
        raw_preds = model.predict(img)[0]

        probs = raw_preds / (np.sum(raw_preds) + 1e-8)

        idx = int(np.argmax(probs))
        confidence = float(probs[idx]) * 100
        disease = CLASS_NAMES[idx]

        print("🔥 Step 8: Done")

        return {
            "status": "PREDICTION",
            "disease": disease,
            "confidence": round(confidence, 2)
        }

    except Exception as e:
        print("❌ ERROR:", str(e))

        # 🔥 FALLBACK (so app never crashes)
        return {
            "status": "FAILED",
            "disease": "Demo Result",
            "confidence": 75.0,
            "error": str(e)
        }