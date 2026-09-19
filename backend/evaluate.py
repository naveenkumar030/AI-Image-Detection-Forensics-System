"""
VeriLens AI Detection Benchmark & Calibration Suite
Evaluates model accuracy, precision, recall, F1, ROC-AUC, confusion matrix,
and multi-threshold accuracy on real vs. AI image datasets.
Supports fitting temperature scaling and trained combiner models.
"""

import os
import sys
import glob
import json
import argparse
import time
from typing import Dict, Any, List, Tuple, Optional

import numpy as np
from PIL import Image, ImageOps
import cv2
import torch
from transformers import AutoImageProcessor, AutoModelForImageClassification
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    confusion_matrix,
)
from scipy.optimize import minimize_scalar

# Ensure repo root is on sys.path
REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if REPO_ROOT not in sys.path:
    sys.path.insert(0, REPO_ROOT)

from backend.main import (
    preprocess_image,
    generate_multi_crops,
    extract_exif_metadata,
    compute_2d_fft_features,
    compute_error_level_analysis,
    compute_noise_and_laplacian,
    MODEL_ID,
)
from backend.scoring import (
    combine_signals,
    DEFAULT_TEMPERATURE,
    AI_THRESHOLD,
    REAL_THRESHOLD,
    CALIBRATION_CONFIG_PATH,
    COMBINER_MODEL_PATH,
)

IMAGE_EXTENSIONS = ("*.jpg", "*.jpeg", "*.png", "*.webp", "*.bmp", "*.tiff")

def find_images_in_dir(folder: str) -> List[str]:
    """Finds all supported image files in a folder recursively."""
    files = []
    for ext in IMAGE_EXTENSIONS:
        files.extend(glob.glob(os.path.join(folder, ext)))
        files.extend(glob.glob(os.path.join(folder, "**", ext), recursive=True))
    return sorted(list(set(files)))

def load_evaluation_model(model_id: str = MODEL_ID, device: str = "cpu"):
    """Loads processor and model, resolving label indices dynamically."""
    print(f"[Evaluate] Loading model '{model_id}' on {device}...")
    processor = AutoImageProcessor.from_pretrained(model_id)
    model = AutoModelForImageClassification.from_pretrained(model_id)
    model.eval()
    if device == "cuda" and torch.cuda.is_available():
        model.to("cuda")

    id2label = getattr(model.config, "id2label", {0: "artificial", 1: "human"})
    ai_idx, real_idx = 0, 1
    for idx, lbl in id2label.items():
        lbl_str = str(lbl).lower()
        if any(k in lbl_str for k in ["artificial", "ai", "synthetic", "fake", "deepfake"]):
            ai_idx = int(idx)
        elif any(k in lbl_str for k in ["human", "real", "authentic"]):
            real_idx = int(idx)

    print(f"[Evaluate] Dynamic label mapping: AI={ai_idx} ('{id2label.get(ai_idx)}'), Real={real_idx} ('{id2label.get(real_idx)}')")
    return processor, model, ai_idx, real_idx

def evaluate_single_image(
    image_path: str,
    processor,
    model,
    ai_idx: int,
    real_idx: int,
    device: str,
    temperature: float = 1.0,
) -> Dict[str, Any]:
    """Evaluates an image through multi-crop inference and multi-signal scoring."""
    with open(image_path, "rb") as f:
        raw_bytes = f.read()

    raw_pil = Image.open(image_path)
    pil_img = preprocess_image(raw_pil)
    width, height = pil_img.size
    img_rgb = np.array(pil_img)
    img_bgr = cv2.cvtColor(img_rgb, cv2.COLOR_RGB2BGR)
    img_gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)

    # Secondary forensic features
    exif_feats = extract_exif_metadata(raw_pil)
    fft_feats = compute_2d_fft_features(img_gray)
    ela_feats = compute_error_level_analysis(pil_img)
    noise_feats = compute_noise_and_laplacian(img_bgr)

    # Multi-crop neural inference
    crops = generate_multi_crops(pil_img, cap=6, enable_tta=True)
    inputs = processor(images=crops, return_tensors="pt")
    if device == "cuda" and torch.cuda.is_available():
        inputs = {k: v.to("cuda") for k, v in inputs.items()}

    with torch.no_grad():
        outputs = model(**inputs)
        logits = outputs.logits  # (N, num_classes)

    raw_logits_ai = logits[:, ai_idx].cpu().numpy()
    raw_logits_real = logits[:, real_idx].cpu().numpy()

    # Temperature-scaled logits
    scaled_logits = logits / max(1e-4, temperature)
    probs = torch.softmax(scaled_logits, dim=-1)
    crop_ai_probs = probs[:, ai_idx].cpu().numpy().tolist()

    crop_stats = {
        "mean": float(np.mean(crop_ai_probs)),
        "std": float(np.std(crop_ai_probs)),
        "min": float(np.min(crop_ai_probs)),
        "max": float(np.max(crop_ai_probs)),
        "num_crops": len(crops),
    }

    mean_logits = torch.mean(scaled_logits, dim=0)
    agg_probs = torch.softmax(mean_logits, dim=-1)
    neural_p_ai = float(agg_probs[ai_idx].item())

    # Calibrated rule scoring
    scoring_res = combine_signals(
        neural_p_ai=neural_p_ai,
        crop_stats=crop_stats,
        fft_feats=fft_feats,
        ela_feats=ela_feats,
        noise_feats=noise_feats,
        exif_feats=exif_feats,
        width=width,
        height=height,
        file_size_bytes=len(raw_bytes),
        temperature=temperature,
    )

    # Feature vector for ML calibration
    fft_anomaly = float(fft_feats.get("azimuthal_score", 50.0)) / 100.0
    ela_anomaly = float(ela_feats.get("ela_anomaly_score", 50.0)) / 100.0
    noise_smoothness = float(noise_feats.get("synthetic_smoothness", 50.0)) / 100.0
    exif_ai = 0.95 if exif_feats.get("has_ai_tag") else (0.10 if exif_feats.get("has_camera_hardware") else 0.50)
    quality_mult = scoring_res["quality_multiplier"]

    feature_vector = [
        neural_p_ai,
        crop_stats["std"],
        fft_anomaly,
        ela_anomaly,
        noise_smoothness,
        exif_ai,
        quality_mult,
    ]

    return {
        "path": image_path,
        "filename": os.path.basename(image_path),
        "raw_logit_ai_mean": float(np.mean(raw_logits_ai)),
        "raw_logit_real_mean": float(np.mean(raw_logits_real)),
        "neural_p_ai": neural_p_ai,
        "calibrated_p_ai": scoring_res["calibrated_p_ai"],
        "crop_std": crop_stats["std"],
        "crop_num": crop_stats["num_crops"],
        "quality_mult": quality_mult,
        "is_ai_predicted": scoring_res["is_ai_generated"],
        "verdict": scoring_res["verdict"],
        "confidence": scoring_res["display_confidence"],
        "feature_vector": feature_vector,
    }

def fit_temperature_scaling(raw_logits_diff: np.ndarray, y_true: np.ndarray) -> float:
    """
    Finds optimal temperature T > 0 that minimizes binary cross entropy:
    p = 1 / (1 + exp(- (z_ai - z_real) / T))
    """
    def nll_objective(t):
        temp = max(1e-3, float(t))
        scaled_diff = raw_logits_diff / temp
        # Sigmoid with numerical stability
        p = 1.0 / (1.0 + np.exp(-np.clip(scaled_diff, -30.0, 30.0)))
        p = np.clip(p, 1e-7, 1.0 - 1e-7)
        loss = -np.mean(y_true * np.log(p) + (1.0 - y_true) * np.log(1.0 - p))
        return loss

    res = minimize_scalar(nll_objective, bounds=(0.1, 10.0), method="bounded")
    return float(res.x)

def run_benchmark(
    dataset_dir: str,
    save_csv: Optional[str] = "evaluation_results.csv",
    calibrate: bool = False,
    device: str = "cpu",
    max_images: Optional[int] = None,
):
    """Executes full benchmark evaluation across dataset/real and dataset/ai."""
    real_dir = os.path.join(dataset_dir, "real")
    ai_dir = os.path.join(dataset_dir, "ai")

    # Also check alternative names
    if not os.path.exists(ai_dir) and os.path.exists(os.path.join(dataset_dir, "fake")):
        ai_dir = os.path.join(dataset_dir, "fake")

    if not os.path.exists(real_dir) or not os.path.exists(ai_dir):
        print(f"Error: Dataset directory must contain 'real' and 'ai' (or 'fake') subfolders.")
        print(f"Looked for:\n  {real_dir}\n  {ai_dir}")
        return

    real_images = find_images_in_dir(real_dir)
    ai_images = find_images_in_dir(ai_dir)

    if max_images:
        real_images = real_images[:max_images]
        ai_images = ai_images[:max_images]

    print(f"\n=======================================================")
    print(f"  VeriLens Forensics Benchmark Evaluation")
    print(f"=======================================================")
    print(f"Dataset root:   {dataset_dir}")
    print(f"Real images:    {len(real_images)}")
    print(f"AI images:      {len(ai_images)}")
    print(f"Total samples:  {len(real_images) + len(ai_images)}")
    print(f"Target model:   {MODEL_ID}")
    print(f"Device:         {device}\n")

    if len(real_images) == 0 and len(ai_images) == 0:
        print("No images found in dataset directories.")
        return

    processor, model, ai_idx, real_idx = load_evaluation_model(MODEL_ID, device=device)

    samples = []
    y_true = []
    y_scores = []
    y_pred_binary = []
    raw_diffs = []
    feature_matrix = []

    # Evaluate Real images (label = 0)
    print("Evaluating Real photos...")
    for idx, path in enumerate(real_images):
        t0 = time.time()
        try:
            res = evaluate_single_image(path, processor, model, ai_idx, real_idx, device)
            res["ground_truth"] = 0
            res["label_name"] = "Real"
            res["correct"] = (res["calibrated_p_ai"] < 0.50)
            samples.append(res)
            y_true.append(0)
            y_scores.append(res["calibrated_p_ai"])
            y_pred_binary.append(1 if res["calibrated_p_ai"] >= 0.50 else 0)
            raw_diffs.append(res["raw_logit_ai_mean"] - res["raw_logit_real_mean"])
            feature_matrix.append(res["feature_vector"])
            print(f"  [{idx+1}/{len(real_images)}] REAL {os.path.basename(path)} -> p_ai={res['calibrated_p_ai']:.3f} ({res['verdict']}) [{round((time.time()-t0)*1000)}ms]")
        except Exception as err:
            print(f"  [{idx+1}/{len(real_images)}] ERROR on {path}: {err}")

    # Evaluate AI images (label = 1)
    print("\nEvaluating AI images...")
    for idx, path in enumerate(ai_images):
        t0 = time.time()
        try:
            res = evaluate_single_image(path, processor, model, ai_idx, real_idx, device)
            res["ground_truth"] = 1
            res["label_name"] = "AI"
            res["correct"] = (res["calibrated_p_ai"] >= 0.50)
            samples.append(res)
            y_true.append(1)
            y_scores.append(res["calibrated_p_ai"])
            y_pred_binary.append(1 if res["calibrated_p_ai"] >= 0.50 else 0)
            raw_diffs.append(res["raw_logit_ai_mean"] - res["raw_logit_real_mean"])
            feature_matrix.append(res["feature_vector"])
            print(f"  [{idx+1}/{len(ai_images)}] AI   {os.path.basename(path)} -> p_ai={res['calibrated_p_ai']:.3f} ({res['verdict']}) [{round((time.time()-t0)*1000)}ms]")
        except Exception as err:
            print(f"  [{idx+1}/{len(ai_images)}] ERROR on {path}: {err}")

    if len(y_true) == 0:
        print("No images were successfully processed.")
        return

    y_true_arr = np.array(y_true)
    y_scores_arr = np.array(y_scores)
    y_pred_arr = np.array(y_pred_binary)

    # Metric calculations
    acc = accuracy_score(y_true_arr, y_pred_arr)
    prec = precision_score(y_true_arr, y_pred_arr, zero_division=0)
    rec = recall_score(y_true_arr, y_pred_arr, zero_division=0)
    f1 = f1_score(y_true_arr, y_pred_arr, zero_division=0)

    try:
        roc_auc = roc_auc_score(y_true_arr, y_scores_arr) if len(set(y_true)) > 1 else float("nan")
    except Exception:
        roc_auc = float("nan")

    cm = confusion_matrix(y_true_arr, y_pred_arr, labels=[0, 1])

    # Print Report
    print(f"\n=======================================================")
    print(f"  BENCHMARK EVALUATION RESULTS (Threshold = 0.50)")
    print(f"=======================================================")
    print(f"  Accuracy:         {acc*100:.2f}%")
    print(f"  Precision:        {prec*100:.2f}%")
    print(f"  Recall:           {rec*100:.2f}%")
    print(f"  F1 Score:         {f1:.4f}")
    print(f"  ROC-AUC:          {roc_auc:.4f}" if not np.isnan(roc_auc) else "  ROC-AUC:          N/A (single class)")
    print(f"\n  Confusion Matrix:")
    print(f"                    Predicted Real   Predicted AI")
    print(f"    Actual Real:    {cm[0, 0]:<16} {cm[0, 1]:<16}")
    print(f"    Actual AI:      {cm[1, 0]:<16} {cm[1, 1]:<16}")

    # Threshold Sensitivity Sweep
    print(f"\n-------------------------------------------------------")
    print(f"  THRESHOLD ACCURACY SWEEP")
    print(f"-------------------------------------------------------")
    print(f"  Threshold   Accuracy    Precision   Recall      F1")
    for th in [0.30, 0.40, 0.50, 0.60, 0.70, 0.80]:
        th_pred = (y_scores_arr >= th).astype(int)
        th_acc = accuracy_score(y_true_arr, th_pred)
        th_prec = precision_score(y_true_arr, th_pred, zero_division=0)
        th_rec = recall_score(y_true_arr, th_pred, zero_division=0)
        th_f1 = f1_score(y_true_arr, th_pred, zero_division=0)
        print(f"    {th:.2f}       {th_acc*100:>6.2f}%     {th_prec*100:>6.2f}%     {th_rec*100:>6.2f}%     {th_f1:.4f}")

    # Save CSV
    if save_csv:
        import csv
        with open(save_csv, "w", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            writer.writerow([
                "filename",
                "ground_truth",
                "label_name",
                "neural_p_ai",
                "calibrated_p_ai",
                "crop_std",
                "quality_mult",
                "verdict",
                "confidence",
                "correct",
            ])
            for s in samples:
                writer.writerow([
                    s["filename"],
                    s["ground_truth"],
                    s["label_name"],
                    round(s["neural_p_ai"], 4),
                    round(s["calibrated_p_ai"], 4),
                    round(s["crop_std"], 4),
                    s["quality_mult"],
                    s["verdict"],
                    s["confidence"],
                    s["correct"],
                ])
        print(f"\n[Evaluate] Saved per-sample evaluation metrics to: {save_csv}")

    # Calibration Fitting
    if calibrate and len(set(y_true)) > 1:
        print(f"\n-------------------------------------------------------")
        print(f"  FITTING CALIBRATION & COMBINER MODEL")
        print(f"-------------------------------------------------------")
        opt_temp = fit_temperature_scaling(np.array(raw_diffs), y_true_arr)
        print(f"  Optimized Logit Temperature: T = {opt_temp:.4f}")

        # Save to calibration config
        calib_dir = os.path.dirname(CALIBRATION_CONFIG_PATH)
        os.makedirs(calib_dir, exist_ok=True)
        calib_data = {
            "temperature": round(opt_temp, 4),
            "ai_threshold": AI_THRESHOLD,
            "real_threshold": REAL_THRESHOLD,
            "fitted_at": time.strftime("%Y-%m-%d %H:%M:%S"),
            "dataset": dataset_dir,
            "num_samples": len(samples),
        }
        with open(CALIBRATION_CONFIG_PATH, "w", encoding="utf-8") as f:
            json.dump(calib_data, f, indent=2)
        print(f"  Saved calibration config to: {CALIBRATION_CONFIG_PATH}")

        # Train Logistic Regression Combiner
        try:
            from sklearn.linear_model import LogisticRegression
            import joblib

            X = np.array(feature_matrix)
            y = y_true_arr
            lr_model = LogisticRegression(C=1.0, max_iter=1000)
            lr_model.fit(X, y)

            models_dir = os.path.dirname(COMBINER_MODEL_PATH)
            os.makedirs(models_dir, exist_ok=True)
            joblib.dump(lr_model, COMBINER_MODEL_PATH)
            print(f"  Saved trained combiner model to: {COMBINER_MODEL_PATH}")
            calib_acc = lr_model.score(X, y)
            print(f"  Trained Combiner Training Accuracy: {calib_acc*100:.2f}%")
        except Exception as e:
            print(f"  Could not train joblib combiner: {e}")

    print(f"\n=======================================================\n")

def main():
    parser = argparse.ArgumentParser(description="VeriLens AI Detection Benchmark Suite")
    parser.add_argument("--dataset", type=str, default="dataset", help="Path to dataset directory containing real/ and ai/ folders")
    parser.add_argument("--save-csv", type=str, default="evaluation_results.csv", help="Path to save evaluation CSV")
    parser.add_argument("--calibrate", action="store_true", help="Fit temperature scaling and train combiner model")
    parser.add_argument("--device", type=str, default="cuda" if torch.cuda.is_available() else "cpu", help="Device (cpu or cuda)")
    parser.add_argument("--max-images", type=int, default=None, help="Maximum number of images per category to evaluate")
    args = parser.parse_args()

    run_benchmark(
        dataset_dir=args.dataset,
        save_csv=args.save_csv,
        calibrate=args.calibrate,
        device=args.device,
        max_images=args.max_images,
    )

if __name__ == "__main__":
    main()
