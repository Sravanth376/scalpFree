"""
ScalpFree – FastAPI Backend Entry Point
Initialises the app, registers routes, configures CORS and logging.
"""

import logging
import os
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.prediction import router as prediction_router
from app.services.model_service import ModelService

# ── Load environment variables ────────────────────────────────────────────────
load_dotenv()

# ── Logging ───────────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger(__name__)


# ── Lifespan: load model once on startup ─────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load the TF model into memory before the first request."""
    logger.info("🚀  ScalpFree API starting up …")
    ModelService.load()          # warm up; raises if model file is missing
    logger.info("✅  Model loaded and ready")
    yield
    logger.info("👋  ScalpFree API shutting down")


# ── App factory ───────────────────────────────────────────────────────────────
app = FastAPI(
    title="ScalpFree API",
    description="AI-powered scalp disease detection",
    version="1.0.0",
    lifespan=lifespan,
)

# ── CORS ──────────────────────────────────────────────────────────────────────
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in allowed_origins],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routes ────────────────────────────────────────────────────────────────────
app.include_router(prediction_router, prefix="/api/v1", tags=["Prediction"])


# ── Health check ──────────────────────────────────────────────────────────────
@app.get("/health", tags=["Health"])
async def health():
    return {"status": "ok", "model_loaded": ModelService.is_loaded()}
