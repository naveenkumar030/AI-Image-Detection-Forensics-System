# VeriLens — AI Image Detection & Multi-Signal Forensics System

Digital Image Verification & Provenance Platform combining deep Vision Transformer (ViT) classification with classic computer vision physics, styled with the **Google Stitch** design system.

---

## Architecture Overview

VeriLens employs a **calibrated hybrid ensemble** architecture designed to detect general AI-generated imagery while minimizing false positives on camera photographs.

### 1. Primary Neural Vision Classifier
- **Model**: [`umm-maybe/AI-image-detector`](https://huggingface.co/umm-maybe/AI-image-detector)
- **Architecture**: Vision Transformer (ViT) fine-tuned for discriminating authentic human photographs from artificial/synthetic generator outputs.
- **Dynamic Label Mapping**: Model labels are resolved dynamically at load time via `model.config.id2label` (mapping `artificial` to AI and `human` to Real).
- **Multi-Crop Inference**: Automatically partitions images exceeding $224 \times 224$ into multi-crop tiles (center crop and spatial quadrants) and aggregates logits via mean pooling while reporting crop standard deviation as a spatial agreement metric.
- **Test-Time Augmentation (TTA)**: Evaluates horizontal reflections to ensure spatial invariance.
- **Temperature Scaling**: Logits are scaled by temperature $T$ (configurable via `backend/config/calibration.json`) to output well-calibrated posterior probabilities.

### 2. Secondary Computer Vision Forensics
Forensic signals serve as secondary evidence and are dynamically attenuated when images are downscaled ($<256\text{px}$) or heavily recompressed:
- **2D Fast Fourier Transform (2D-FFT)**: Azimuthal frequency power distribution scan to detect synthetic lattice spikes versus continuous $1/f$ photographic power-law decay.
- **Error Level Analysis (ELA)**: Evaluates differential JPEG compression quantization residuals to detect inpainting and unnatural compression artifacts.
- **Sensor PRNU & Laplacian Residuals**: Estimates Photo-Response Non-Uniformity (sensor photon noise) and high-frequency edge variance to distinguish physical camera sensor noise from diffusion over-smoothing.
- **Hardware EXIF Metadata Provenance**: Inspects optical camera metadata (Make, Model, ISO, Shutter, Lens) and flags known generative software tags.

### 3. Calibrated Scoring Engine (`backend/scoring.py`)
- **Neural Primary Weight**: Neural ViT contributes $75\text{--}85\%$ of the base probability.
- **Forensic Secondary Weight**: Forensics contribute $15\text{--}25\%$, scaled down based on image quality and compression level.
- **Verdict Thresholds**:
  - $p_{\text{ai}} \ge 0.70$ $\rightarrow$ **AI-Generated Image** (`isAIGenerated: true`)
  - $p_{\text{ai}} \le 0.30$ $\rightarrow$ **Real Photograph** (`isAIGenerated: false`)
  - $0.30 < p_{\text{ai}} < 0.70$ $\rightarrow$ **Inconclusive / Uncertain**
- **Pluggable Combiner**: Supports loading a trained scikit-learn classifier (`backend/models/combiner.joblib`) fitted on benchmark datasets, falling back to rule-based calibration.

---

## Known Limitations

1. **Generative Model Evolution**: The primary neural classifier was trained primarily on earlier generative architectures (e.g., Stable Diffusion 1.x/2.x, Midjourney v4/v5, DALL-E 2/3, GANs). Accuracy can be lower on state-of-the-art generators (Midjourney v6+, Flux.1, SDXL variants, and ultra-high-fidelity upscalers).
2. **Recompression & Downsampling**: Heavy social media recompression (JPEG quality $<60$) and thumbnail resizing ($<256\text{px}$) strip high-frequency forensic cues (PRNU, 2D-FFT lattice, ELA), reducing secondary signal confidence. The engine automatically outputs a limitation warning for degraded images.
3. **Illustrations & Digital Artwork**: Non-photographic digital paintings, UI screenshots, and clean vector art may lack physical camera sensor noise, which can occasionally trigger inconclusive confidence tiers.

---

## REST API Endpoints

- **`GET /api/health`**: Returns system status, model ID, device (`cuda` or `cpu`), resolved label mapping, and active temperature.
- **`POST /api/predict`**: Accepts multipart image upload (`file`). Returns full JSON analysis containing:
  - `verdict`, `statusBadge`, `confidenceTier`, `riskLevel`
  - `confidence` (display score 0–100)
  - `realConfidence`, `syntheticConfidence`, `uncertainConfidence`
  - `cropConsistency` (`mean`, `std`, `min`, `max`, `num_crops`)
  - `primaryFindings`, `supportingFindings`, `reasons`, `limitations`
  - `metrics` (2D-FFT, ELA, PRNU noise, EXIF tags)
  - `rlVerification` (sequential verification steps for UI animation)

---

## Evaluation & Calibration Suite (`backend/evaluate.py`)

Run benchmark evaluation against a dataset structured as `dataset/real/` and `dataset/ai/`:

```bash
# Run benchmark and export CSV metrics
python backend/evaluate.py --dataset path/to/dataset --save-csv evaluation_results.csv

# Run benchmark and fit temperature scaling & combiner model
python backend/evaluate.py --dataset path/to/dataset --calibrate
```

Outputs:
- Accuracy, Precision, Recall, F1 Score, ROC-AUC
- Confusion matrix
- Accuracy sweep across multiple thresholds ($0.30 \dots 0.80$)
- Saves calibration parameters to `backend/config/calibration.json` and `backend/models/combiner.joblib`.

---

## Quick Start Commands

### 1. Python Forensics Backend
Ensure dependencies are installed:
```bash
pip install -r backend/requirements.txt
```

Start the FastAPI server (or double-click `backend/start.bat`):
```bash
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```
Interactive API documentation is available at: `http://127.0.0.1:8000/docs`.

### 2. React / Vite Frontend
In another terminal:
```bash
npm install
npm run dev
```
Runs at `http://localhost:5173/`. The UI connects to `http://127.0.0.1:8000` with graceful fallback to browser canvas inspection if the backend is offline.
