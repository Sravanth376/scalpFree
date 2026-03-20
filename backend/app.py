print("🔥 STEP 1: file loaded")

from fastapi import FastAPI, File, UploadFile, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.openapi.utils import get_openapi
from sqlalchemy.orm import Session
from pydantic import BaseModel
from passlib.context import CryptContext
from jose import jwt
from dotenv import load_dotenv
from uuid import uuid4
from datetime import datetime, timedelta
import os
import io
import numpy as np
from PIL import Image
import gdown

# ✅ CORRECT IMPORTS
from backend.database import SessionLocal, engine, Base
from backend.models import User, Scan
from backend.model_loader import load_model_safe

print("🔥 STEP 2: imports done")

# =====================================================
# ENV
# =====================================================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(BASE_DIR, ".env"))

SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    raise RuntimeError("SECRET_KEY not set")

ALGORITHM = "HS256"

UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

pwd_context = CryptContext(
    schemes=["pbkdf2_sha256"],
    deprecated="auto"
)

security = HTTPBearer()

# =====================================================
# APP (ONLY ONCE ✅)
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
# DB STARTUP
# =====================================================
@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)
    print("✅ Database ready")

# =====================================================
# OPENAPI
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

    schema["components"]["securitySchemes"] = {
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT",
        }
    }

    for path, methods in schema["paths"].items():
        for method in methods.values():
            if path not in ["/signup", "/login"]:
                method["security"] = [{"BearerAuth": []}]

    app.openapi_schema = schema
    return app.openapi_schema

app.openapi = custom_openapi

# =====================================================
# DB DEPENDENCY
# =====================================================
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# =====================================================
# AUTH HELPERS
# =====================================================
def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str):
    return pwd_context.verify(plain, hashed)

def create_access_token(data: dict, expires_minutes: int = 60):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=expires_minutes)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# =====================================================
# MODELS
# =====================================================
class AuthRequest(BaseModel):
    email: str
    password: str

# =====================================================
# AUTH ROUTES
# =====================================================
@app.post("/signup")
def signup(data: AuthRequest, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(status_code=400, detail="User already exists")

    user = User(
        email=data.email,
        password=hash_password(data.password)
    )
    db.add(user)
    db.commit()

    return {"message": "Signup successful"}

@app.post("/login")
def login(data: AuthRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not verify_password(data.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": user.email})
    return {"access_token": token, "token_type": "bearer"}

# =====================================================
# AUTH GUARD
# =====================================================
def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    try:
        payload = jwt.decode(
            credentials.credentials,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )
        email = payload.get("sub")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return user

# =====================================================
# ML CONFIG (SAFE + LAZY)
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
async def predict(
    file: UploadFile = File(...),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    global model

    # ✅ Load TensorFlow ONLY when needed
    import tensorflow as tf
    tf.get_logger().setLevel('ERROR')

    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid image file")

    image_bytes = await file.read()

    if not image_bytes:
        raise HTTPException(status_code=400, detail="Empty image")

    filename = f"{uuid4()}.jpg"
    image_path = os.path.join(UPLOAD_DIR, filename)

    with open(image_path, "wb") as f:
        f.write(image_bytes)

    # 🔥 Download model if needed
    if not os.path.exists(MODEL_PATH):
        print("⬇️ Downloading model...")
        file_id = "1As3X27IkWqnpZcnrfRFzgZcTHs3X7M7n"
        url = f"https://drive.google.com/uc?id={file_id}"
        gdown.download(url, MODEL_PATH, quiet=False)

    # 🔥 Load model lazily
    if model is None:
        print("🚀 Loading model...")
        model = load_model_safe()
        print("✅ Model loaded")

    img = preprocess_image(image_bytes)

    raw_preds = model.predict(img)[0]
    probs = raw_preds / (np.sum(raw_preds) + 1e-8)

    idx = int(np.argmax(probs))
    confidence = float(probs[idx]) * 100
    disease = CLASS_NAMES[idx]

    if confidence >= 15:
        scan = Scan(
            user_id=user.id,
            disease=disease,
            confidence=str(round(confidence, 2)),
            image_path=image_path,
            created_at=datetime.utcnow()
        )
        db.add(scan)
        db.commit()
    else:
        os.remove(image_path)

    return {
        "status": "PREDICTION",
        "disease": disease,
        "confidence": round(confidence, 2)
    }

@app.get("/history")
def history(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    scans = (
        db.query(Scan)
        .filter(Scan.user_id == user.id)
        .order_by(Scan.created_at.desc())
        .all()
    )

    return [
        {
            "disease": s.disease,
            "confidence": s.confidence,
            "image": s.image_path,
            "date": s.created_at,
        }
        for s in scans
    ]