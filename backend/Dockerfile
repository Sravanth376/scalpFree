# ── ScalpFree Backend – Dockerfile ───────────────────────────────────────────
FROM python:3.11-slim

# System dependencies for Pillow and TensorFlow
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /backend

# Install Python dependencies first (layer caching)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application source
COPY . .

# Create model directory (model file is mounted at runtime or copied in)
RUN mkdir -p model

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
