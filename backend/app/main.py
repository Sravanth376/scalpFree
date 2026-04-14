"""
ScalpFree FastAPI backend entry point.
"""

import logging
import os
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.prediction import router as prediction_router
from app.services.model_service import ModelService

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("ScalpFree API starting up")
    ModelService.load()
    logger.info("Model loaded and ready")
    yield
    logger.info("ScalpFree API shutting down")


app = FastAPI(
    title="ScalpFree API",
    description="AI-powered scalp disease detection",
    version="1.0.0",
    lifespan=lifespan,
)

allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in allowed_origins],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(prediction_router, prefix="/api/v1", tags=["Prediction"])


@app.get("/health", tags=["Health"])
async def health():
    return {"status": "ok", "model_loaded": ModelService.is_loaded()}
