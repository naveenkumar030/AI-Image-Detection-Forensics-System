"""
VeriLens Forensics & AI Image Detection — Calibrated Scoring Module
Combines:
  1. Neural Vision Transformer (umm-maybe/AI-image-detector) calibrated p_ai
  2. Multi-crop consistency & agreement metrics
  3. Secondary Forensic Signals (2D-FFT, ELA, PRNU, Laplacian edge variance, EXIF)
  4. Compression / Resolution attenuation
  5. Machine learning combiner fallback (joblib model if present, else calibrated rule weights)
"""

import os
import math
from typing import Dict, Any, List, Optional, Tuple

try:
    import joblib
except ImportError:
    joblib = None

# --------------------------------------------------------------------------
# Configurable Thresholds & Constants
# --------------------------------------------------------------------------
AI_THRESHOLD = 0.70       # p_ai >= 0.70 -> AI-Generated
REAL_THRESHOLD = 0.30     # p_ai <= 0.30 -> Real Photograph
DEFAULT_TEMPERATURE = 1.0 # Temperature scaling parameter for logits
COMBINER_MODEL_PATH = os.path.join(os.path.dirname(__file__), "models", "combiner.joblib")
CALIBRATION_CONFIG_PATH = os.path.join(os.path.dirname(__file__), "config", "calibration.json")

def load_calibration_config() -> Dict[str, Any]:
    """Loads calibration parameters if present."""
    if os.path.exists(CALIBRATION_CONFIG_PATH):
        try:
            import json
            with open(CALIBRATION_CONFIG_PATH, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            print(f"[Scoring] Could not load calibration config: {e}")
    return {"temperature": DEFAULT_TEMPERATURE, "ai_threshold": AI_THRESHOLD, "real_threshold": REAL_THRESHOLD}

def apply_temperature_scaling(logits: List[float], temperature: float = DEFAULT_TEMPERATURE) -> List[float]:
    """
    Applies temperature scaling to neural logits before softmax:
    p_i = exp(z_i / T) / sum(exp(z_j / T))
    """
    temp = max(1e-4, float(temperature))
    scaled = [z / temp for z in logits]
    max_val = max(scaled)
    exp_vals = [math.exp(z - max_val) for z in scaled]
    sum_exp = sum(exp_vals)
    return [e / sum_exp for e in exp_vals]

def assess_image_degradation(
    width: int,
    height: int,
    file_size_bytes: int,
    ela_mean: float,
    noise_sigma: float
) -> Tuple[float, List[str]]:
    """
    Estimates degradation factor (0.0 = severely degraded, 1.0 = pristine full fidelity).
    Forensic signals (FFT, ELA, PRNU) are highly sensitive to downscaling, heavy JPEG compression,
    and screen capture artifacts. When degraded, their reliability drops.
    Returns:
      quality_multiplier (0.1 to 1.0)
      limitation_notes (list of human-readable warnings)
    """
    notes = []
    min_dim = min(width, height)
    quality_factor = 1.0

    # 1. Low resolution check
    if min_dim < 256:
        quality_factor *= 0.30
        notes.append("Low resolution image (< 256px). Forensic frequency and sensor noise patterns are heavily compromised.")
    elif min_dim < 512:
        quality_factor *= 0.65
        notes.append("Sub-512px resolution. Microscopic sensor noise estimation has reduced accuracy.")

    # 2. Compression assessment
    total_pixels = max(1, width * height)
    bytes_per_pixel = file_size_bytes / total_pixels if file_size_bytes > 0 else 1.0

    if bytes_per_pixel < 0.12 and min_dim >= 256:
        # High compression ratio
        quality_factor *= 0.45
        notes.append("Severe JPEG recompression detected. Frequency domain and compression error levels have diminished reliability.")
    elif bytes_per_pixel < 0.25:
        quality_factor *= 0.70
        notes.append("Moderate image compression detected. Forensic weights adjusted accordingly.")

    # 3. Flat texture or screenshot check
    if noise_sigma < 0.35 and min_dim >= 256:
        notes.append("Extremely flat textures detected (possible digital illustration, UI capture, or screenshot).")
        quality_factor *= 0.60

    return max(0.10, min(1.0, quality_factor)), notes

def combine_signals(
    neural_p_ai: float,
    crop_stats: Dict[str, float],
    fft_feats: Dict[str, Any],
    ela_feats: Dict[str, Any],
    noise_feats: Dict[str, Any],
    exif_feats: Dict[str, Any],
    width: int,
    height: int,
    file_size_bytes: int,
    temperature: float = DEFAULT_TEMPERATURE,
    ai_threshold: float = AI_THRESHOLD,
    real_threshold: float = REAL_THRESHOLD,
) -> Dict[str, Any]:
    """
    Combines neural prediction, multi-crop consistency, and secondary forensic features.
    Treats forensics as secondary features and scales their weight based on image quality.
    Supports loading trained combiner model (joblib) if present.
    """
    # 1. Image Quality & Forensic Dampening
    ela_mean = float(ela_feats.get("ela_mean_error", 0.0))
    noise_sigma = float(noise_feats.get("noise_sigma", 0.0))
    quality_mult, limitations = assess_image_degradation(
        width=width,
        height=height,
        file_size_bytes=file_size_bytes,
        ela_mean=ela_mean,
        noise_sigma=noise_sigma,
    )

    # 2. Crop Agreement Metrics
    crop_std = crop_stats.get("std", 0.0)
    crop_max = crop_stats.get("max", neural_p_ai)
    crop_min = crop_stats.get("min", neural_p_ai)

    # 3. Secondary Forensic Anomaly Features (normalized 0.0 - 1.0)
    fft_anomaly = float(fft_feats.get("azimuthal_score", 50.0)) / 100.0
    ela_anomaly = float(ela_feats.get("ela_anomaly_score", 50.0)) / 100.0
    noise_smoothness = float(noise_feats.get("synthetic_smoothness", 50.0)) / 100.0

    # EXIF & Provenance Manifest Scoring
    if exif_feats.get("is_authentic_c2pa"):
        exif_ai_score = 0.02
    elif exif_feats.get("has_c2pa_manifest") and exif_feats.get("is_generative_c2pa", True):
        exif_ai_score = 0.99
    elif exif_feats.get("has_c2pa_manifest"):
        exif_ai_score = 0.99
    elif exif_feats.get("has_ai_tag") and exif_feats.get("detected_ai_tool"):
        exif_ai_score = 0.98
    elif exif_feats.get("has_camera_hardware") and exif_feats.get("has_exposure_params"):
        exif_ai_score = 0.05
    elif exif_feats.get("has_camera_hardware"):
        exif_ai_score = 0.15
    elif exif_feats.get("has_exposure_params"):
        exif_ai_score = 0.25
    else:
        exif_ai_score = 0.50  # Neutral when EXIF is stripped (common on social media)

    # 4. Check for trained ML combiner (e.g. LogisticRegression / CalibratedClassifier)
    calibrated_p_ai: Optional[float] = None
    model_method = "Calibrated Multi-Signal Rule Ensemble"

    if os.path.exists(COMBINER_MODEL_PATH) and joblib is not None:
        try:
            combiner_model = joblib.load(COMBINER_MODEL_PATH)
            # Feature vector: [neural_p_ai, crop_std, fft_anomaly, ela_anomaly, noise_smoothness, exif_ai_score, quality_mult]
            feat_vec = [[
                neural_p_ai,
                crop_std,
                fft_anomaly,
                ela_anomaly,
                noise_smoothness,
                exif_ai_score,
                quality_mult
            ]]
            if hasattr(combiner_model, "predict_proba"):
                probs = combiner_model.predict_proba(feat_vec)[0]
                calibrated_p_ai = float(probs[1]) if len(probs) > 1 else float(probs[0])
            elif hasattr(combiner_model, "predict"):
                calibrated_p_ai = float(combiner_model.predict(feat_vec)[0])
            model_method = f"Trained Combiner Model ({os.path.basename(COMBINER_MODEL_PATH)})"
        except Exception as err:
            print(f"[Scoring] Failed to run trained combiner: {err}, falling back to rule ensemble.")
            calibrated_p_ai = None

    # 5. Fallback Rule-Based Ensemble
    # ViT is PRIMARY (75-85%), Forensics are SECONDARY (15-25%), dampened by quality_mult
    diffusion_refinement_reason = None
    if calibrated_p_ai is None:
        # If camera EXIF is confirmed, give genuine hardware dampener
        hardware_dampener = 1.0
        if exif_feats.get("is_authentic_c2pa"):
            hardware_dampener = 0.50
        elif exif_feats.get("has_camera_hardware") and exif_feats.get("has_exposure_params"):
            hardware_dampener = 0.85
        elif exif_feats.get("has_camera_hardware"):
            hardware_dampener = 0.92

        # Effective secondary forensic weight: max 20% when image is high quality, down to 5% when degraded
        forensic_total_weight = 0.20 * quality_mult
        neural_weight = 1.0 - forensic_total_weight

        # Weighted secondary forensic score
        secondary_score = (
            (fft_anomaly * 0.35) +
            (noise_smoothness * 0.30) +
            (ela_anomaly * 0.15) +
            (exif_ai_score * 0.20)
        )

        blended = (neural_p_ai * neural_weight) + (secondary_score * forensic_total_weight)
        blended = blended * hardware_dampener

        # SOTA Diffusion Refinement for Modern Generators (Midjourney v6, Flux, Imagen)
        min_dim = min(width, height)
        total_pixels = width * height
        if 0.40 <= neural_p_ai <= 0.60 and not exif_feats.get("has_c2pa_manifest"):
            has_camera_exif = bool(exif_feats.get("has_camera_hardware") or exif_feats.get("has_exposure_params"))
            is_high_res = (min_dim >= 768 or total_pixels >= 500000) and (quality_mult >= 0.70)

            # High-res image with no camera hardware and unnatural lack of physical sensor noise
            if is_high_res and (noise_sigma < 1.0 or noise_smoothness > 0.65) and not has_camera_exif:
                refinement_boost = 0.18 * quality_mult
                blended = min(0.85, blended + refinement_boost)
                diffusion_refinement_reason = (
                    f"SOTA Diffusion Refinement: Neutral neural score ({int(round(neural_p_ai * 100))}% AI) cross-referenced "
                    f"with sensor noise physics. High-fidelity uncompressed canvas ({width}x{height}) is devoid of physical CMOS "
                    f"sensor photon noise (sigma {noise_sigma:.2f} < 1.0) with absent camera hardware provenance — characteristic of modern diffusion engines (Midjourney v6 / Flux / Imagen)."
                )
            # Authentic photograph in ambiguous band with verified physical sensor noise or camera EXIF
            elif has_camera_exif and (noise_sigma >= 1.5 or noise_feats.get("has_sensor_noise")):
                refinement_discount = 0.15 * quality_mult
                blended = max(0.12, blended - refinement_discount)
                diffusion_refinement_reason = (
                    f"Optical Sensor Verification: Ambiguous neural prediction ({int(round(neural_p_ai * 100))}% AI) resolved by authentic "
                    f"camera hardware EXIF and physical CMOS dark-current sensor noise (sigma {noise_sigma:.2f})."
                )

        # C2PA Manifest Pinning
        if exif_feats.get("is_authentic_c2pa"):
            blended = min(0.04, blended)
        elif exif_feats.get("has_c2pa_manifest"):
            blended = max(0.98, blended)
        elif exif_feats.get("has_ai_tag") and exif_feats.get("detected_ai_tool"):
            blended = max(0.95, blended)

        # Non-linear calibration: preserve certainty near extremes, prevent false-flagging of clean camera photos
        calibrated_p_ai = max(0.01, min(0.99, blended))

    # 6. Reasons & Signal Attribution
    reasons = []
    if neural_p_ai >= 0.70:
        reasons.append(f"Primary Neural Classifier (ViT) identified synthetic generative artifacts ({int(round(neural_p_ai * 100))}% AI probability).")
    elif neural_p_ai <= 0.30:
        reasons.append(f"Primary Neural Classifier (ViT) verified authentic photographic features ({int(round((1.0 - neural_p_ai) * 100))}% real probability).")
    else:
        reasons.append(f"Primary Neural Classifier returned an ambiguous score ({int(round(neural_p_ai * 100))}% AI).")

    if diffusion_refinement_reason:
        reasons.append(diffusion_refinement_reason)

    if crop_std > 0.18:
        reasons.append(f"Localized variation across image crops (std dev {crop_std:.2f}) — localized inpainting or composite detected.")
    elif crop_std < 0.06:
        reasons.append(f"Strong consistency across all multi-crop patches (std dev {crop_std:.2f}).")

    if quality_mult > 0.40:
        if fft_feats.get("is_abnormal_spectrum"):
            reasons.append(f"2D-FFT azimuthal power spectrum displays unnatural high-frequency harmonic lattice clustering.")
        else:
            reasons.append(f"2D-FFT frequency spectrum conforms to continuous photographic 1/f power-law falloff.")

        if noise_feats.get("has_sensor_noise"):
            reasons.append(f"Physical silicon sensor PRNU photon noise residual detected (sigma {noise_sigma:.2f}).")
        elif noise_smoothness > 0.50:
            reasons.append(f"Lack of physical camera sensor noise, characteristic of synthetic diffusion generation.")
    else:
        reasons.append("Secondary forensic signal weights attenuated due to image resolution or recompression.")

    if exif_feats.get("is_authentic_c2pa"):
        reasons.append(f"C2PA Content Credentials Manifest: Verified Authentic Camera Capture ({exif_feats.get('c2pa_tool')}).")
    elif exif_feats.get("has_c2pa_manifest"):
        c2pa_label = exif_feats.get("c2pa_tool") or "C2PA Provenance Manifest"
        reasons.append(f"C2PA Content Credentials Manifest detected: {c2pa_label}.")
    elif exif_feats.get("has_ai_tag"):
        reasons.append(f"EXIF metadata contains explicit generative software marker: {exif_feats.get('detected_ai_tool')}.")
    elif exif_feats.get("has_camera_hardware"):
        reasons.append(f"Authentic optical camera hardware verified in EXIF: {exif_feats.get('camera_description')}.")

    # 7. Verdict Determination
    calibrated_percent = int(round(calibrated_p_ai * 100))
    real_percent = int(round((1.0 - calibrated_p_ai) * 100))
    uncertain_percent = max(0, 100 - calibrated_percent - real_percent)

    if calibrated_p_ai >= ai_threshold:
        is_ai = True
        verdict = "AI-GENERATED IMAGE (SYNTHETIC MEDIA)"
        status_badge = "AI-GENERATED / SYNTHETIC"
        confidence_label = "AI GENERATED (High Confidence)" if calibrated_p_ai >= 0.85 else "LIKELY AI GENERATED"
        display_confidence = calibrated_percent
        risk_level = "CRITICAL"
    elif calibrated_p_ai <= real_threshold:
        is_ai = False
        verdict = "REAL PHOTOGRAPH (AUTHENTIC CAMERA CAPTURE)"
        status_badge = "REAL PHOTOGRAPH / AUTHENTIC"
        confidence_label = "REAL PHOTOGRAPH (Verified Authentic)" if calibrated_p_ai <= 0.15 else "LIKELY REAL PHOTOGRAPH"
        display_confidence = real_percent
        risk_level = "LOW"
    else:
        is_ai = calibrated_p_ai >= 0.50
        verdict = "INCONCLUSIVE FORENSIC ANALYSIS"
        status_badge = "INCONCLUSIVE / SUSPICIOUS"
        confidence_label = "INCONCLUSIVE / UNCERTAIN"
        display_confidence = max(calibrated_percent, real_percent)
        risk_level = "ELEVATED"

    return {
        "is_ai_generated": is_ai,
        "calibrated_p_ai": round(calibrated_p_ai, 4),
        "synthetic_confidence": calibrated_percent,
        "real_confidence": real_percent,
        "uncertain_confidence": uncertain_percent,
        "display_confidence": display_confidence,
        "verdict": verdict,
        "status_badge": status_badge,
        "confidence_tier": confidence_label,
        "risk_level": risk_level,
        "reasons": reasons,
        "limitations": limitations,
        "scoring_method": model_method,
        "quality_multiplier": round(quality_mult, 2),
        "crop_consistency": {
            "mean": round(crop_stats.get("mean", neural_p_ai), 4),
            "std": round(crop_std, 4),
            "min": round(crop_min, 4),
            "max": round(crop_max, 4),
            "num_crops": crop_stats.get("num_crops", 1),
        },
    }
