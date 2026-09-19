import os
import json
import requests

def test_samples():
    base_url = "http://127.0.0.1:8000"
    # Check health first
    try:
        health = requests.get(f"{base_url}/api/health", timeout=5).json()
        print(f"Backend Status: {health.get('status')}, Model: {health.get('model_id')}, Device: {health.get('device')}")
    except Exception as e:
        print(f"Error connecting to backend: {e}")
        return

    # 1. Test Real Camera Photo
    print("\n=== Testing Real Photo (test_real_photo.png) ===")
    with open("test_real_photo.png", "rb") as f:
        res = requests.post(f"{base_url}/api/predict", files={"file": f})
    data_real = res.json()
    print("Real Photo Verdict:             ", data_real.get("verdict"))
    print("Real Photo Status Badge:        ", data_real.get("statusBadge"))
    print("Real Photo Confidence Tier:     ", data_real.get("confidenceTier"))
    print("Real Photo isAIGenerated:       ", data_real.get("isAIGenerated"))
    print("Real Photo Display Confidence:  ", data_real.get("confidence"))
    print("Real Photo RealConfidence:      ", data_real.get("realConfidence"))
    print("Real Photo SyntheticConfidence: ", data_real.get("syntheticConfidence"))
    print("Real Photo Crop Consistency:    ", data_real.get("cropConsistency"))
    print("Real Photo Primary Findings:    ", json.dumps(data_real.get("primaryFindings"), indent=2))

    # 2. Test AI or Sample Grid
    sample_target = "test_ai_sdxl.jpg" if os.path.exists("test_ai_sdxl.jpg") else "test_sample_grid.jpg"
    print(f"\n=== Testing Sample ({sample_target}) ===")
    with open(sample_target, "rb") as f:
        res = requests.post(f"{base_url}/api/predict", files={"file": f})
    data_sample = res.json()
    print("Sample Verdict:             ", data_sample.get("verdict"))
    print("Sample Status Badge:        ", data_sample.get("statusBadge"))
    print("Sample Confidence Tier:     ", data_sample.get("confidenceTier"))
    print("Sample isAIGenerated:       ", data_sample.get("isAIGenerated"))
    print("Sample Display Confidence:  ", data_sample.get("confidence"))
    print("Sample RealConfidence:      ", data_sample.get("realConfidence"))
    print("Sample SyntheticConfidence: ", data_sample.get("syntheticConfidence"))
    print("Sample Crop Consistency:    ", data_sample.get("cropConsistency"))
    print("Sample Primary Findings:    ", json.dumps(data_sample.get("primaryFindings"), indent=2))

    # Assertions
    assert data_real.get("isAIGenerated") is False, "Real photo should not be classified as AI"
    print("\nALL VERIFICATION CHECKS COMPLETED SUCCESSFULLY!")

if __name__ == "__main__":
    test_samples()
