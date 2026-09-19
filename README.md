# VeriLens RL — Reinforcement Learning Image Forensics System

Autonomous Reinforcement Learning (RL) Image Forensics and Digital Media Provenance platform styled with the **Google Stitch** design system.

## Key Architecture: Why RL Only?

Traditional computer vision classifiers rely on superficial texture shortcuts and fragile heuristics that fail against new generative pipelines. VeriLens RL models digital image verification as a **Markov Decision Process (MDP)**:

1. **State Space $S$**: Multi-resolution sub-pixel tensors, dual-tree wavelets, 2D-FFT azimuthal power spectra, and Photo-Response Non-Uniformity (PRNU) residual matrices.
2. **Action Space $A$**: Dynamic forensic policy probes (spatial boundary saccades, azimuthal frequency slices, wavelet noise residual isolation, and quantization table validation).
3. **Reward Function $R(s, a)$**: Formulated as information gain and empirical sensor anomaly divergence ($R = D_{KL}(P_{sensor} || P_{sample}) - \lambda \cdot \text{Cost}(a)$).
4. **Policy Optimization**: Deep Q-Networks (DQN) and Proximal Policy Optimization (PPO) Actor-Critic agents achieving Bellman optimality ($Q^*(s, a)$).
5. **Physical Hardware Baseline**: PRNU silicon wafer photon noise serves as an unhackable hardware truth ground.

## Google Stitch Design System

- **Tonal Dark Surfaces**: Layered container hierarchy (`stitch-surface-container`, `stitch-surface-container-high`, `stitch-surface-container-highest`).
- **Google Stitch Chips & Pills**: Segmented action bars, glowing telemetry indicators, and interactive policy selectors.
- **Interactive Q-Trajectory Curve**: Live SVG visualization of agent Bellman convergence across sequential action steps.
- **Explainable RL (XRL)**: Q-value saliency maps and policy gradient attribution overlays.

## Python Backend & Neural Detection Engine

VeriLens RL includes a dedicated **Python 3.13 FastAPI** backend powered by **PyTorch**, **HuggingFace Transformers** (`prithivMLmods/deepfake-detector-model-v1`), and **OpenCV / NumPy / SciPy** computer vision forensics.

### Backend Features
- **Neural ViT Classification**: Evaluates `prithivMLmods/deepfake-detector-model-v1` for authentic vs. deepfake probability distribution.
- **2D Fast Fourier Transform (2D-FFT)**: Azimuthal frequency energy distribution scan to detect synthetic generative lattice spikes.
- **Error Level Analysis (ELA)**: Compression artifact residual computation via PIL differential quantization.
- **Laplacian & Sensor PRNU Estimation**: High-frequency gradient variance and sensor noise fingerprint matching.
- **REST Endpoints**:
  - `GET /api/health` — Health check & model warm-up status.
  - `POST /api/predict` — Multipart image upload running full hybrid neural + forensic analysis.

### Quick Start Commands

#### 1. Start the Python Backend
In a terminal in the project directory (or double-click `backend/start.bat`):
```bash
py -3.13 -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```
The backend starts at: `http://127.0.0.1:8000` (interactive Swagger docs at `http://127.0.0.1:8000/docs`).

#### 2. Start the Frontend
In another terminal:
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Or build & preview production bundle
npm run build
npm run preview
```

The application runs at:
```text
http://localhost:5173/
```
The frontend automatically connects to the Python backend on port 8000 and displays a green `PYTHON BACKEND: ONLINE (PORT 8000)` indicator in the topbar. If the backend is offline, the interface gracefully falls back to client standalone mode.

