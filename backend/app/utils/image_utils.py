"""
ScalpFree – Image Utilities
Validates and converts uploaded image bytes into a PIL Image object.
"""

import io
import logging
from typing import Tuple

from fastapi import HTTPException, UploadFile
from PIL import Image, UnidentifiedImageError

logger = logging.getLogger(__name__)

# ── Constants ─────────────────────────────────────────────────────────────────
MAX_FILE_SIZE_MB = int(10)                      # reject files larger than 10 MB
MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024
ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp", "image/bmp"}
MIN_DIMENSION = 64                              # reject tiny images (px)


async def validate_and_load_image(file: UploadFile) -> Image.Image:
    """
    Read an uploaded file, validate it, and return a PIL Image.

    Raises
    ------
    HTTPException 400 on invalid file type, oversized payload, or corrupt image.
    """
    # 1. Content-type check (soft guard – browsers may lie, PIL is the real check)
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=400,
            detail=(
                f"Unsupported file type '{file.content_type}'. "
                f"Accepted types: {', '.join(sorted(ALLOWED_CONTENT_TYPES))}"
            ),
        )

    # 2. Read bytes
    raw_bytes = await file.read()

    # 3. Size check
    if len(raw_bytes) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=413,
            detail=f"File too large. Maximum allowed size is {MAX_FILE_SIZE_MB} MB.",
        )

    # 4. Decode image
    try:
        image = Image.open(io.BytesIO(raw_bytes))
        image.verify()                          # checks for truncated / corrupt files
        # Re-open after verify() (PIL closes the file after verify)
        image = Image.open(io.BytesIO(raw_bytes))
    except UnidentifiedImageError:
        raise HTTPException(
            status_code=400,
            detail="Could not decode image. Please upload a valid JPEG, PNG, or WEBP.",
        )
    except Exception as exc:
        logger.warning("Image decode error: %s", exc)
        raise HTTPException(status_code=400, detail="Corrupt or unreadable image file.")

    # 5. Dimension check
    w, h = image.size
    if w < MIN_DIMENSION or h < MIN_DIMENSION:
        raise HTTPException(
            status_code=400,
            detail=f"Image is too small ({w}×{h}px). Minimum: {MIN_DIMENSION}×{MIN_DIMENSION}px.",
        )

    logger.info("Image loaded: %s | size=%dx%d | mode=%s", file.filename, w, h, image.mode)
    return image


def image_dimensions(image: Image.Image) -> Tuple[int, int]:
    """Return (width, height) of a PIL image."""
    return image.size
