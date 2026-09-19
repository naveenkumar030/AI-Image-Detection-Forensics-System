import json
import requests

def test_samples():
    # 1. Test Real Camera Photo
    print("=== Testing Real Photo ===")
    with open("test_real_photo.png", "rb") as f:
        res = requests.post("http://127.0.0.1:8000/api/predict", files={"file": f})
    data_real = res.json()
    print("Real Photo Verdict:", data_real.get("verdict"))
    print("Real Photo Status Badge:", data_real.get("statusBadge"))
    print("Real Photo Confidence Tier:", data_real.get("confidenceTier"))
    print("Real Photo isAIGenerated:", data_real.get("isAIGenerated"))
    print("Real Photo Confidence:", data_real.get("confidence"))
    print("Real Photo RealConfidence:", data_real.get("realConfidence"))
    print("Real Photo SyntheticConfidence:", data_real.get("syntheticConfidence"))
    print("Real Photo Primary Findings:", json.dumps(data_real.get("primaryFindings"), indent=2))

    # 2. Test AI Generated Photo
    print("\n=== Testing AI SDXL Photo ===")
    with open("test_ai_sdxl.jpg", "rb") as f:
        res = requests.post("http://127.0.0.1:8000/api/predict", files={"file": f})
    data_ai = res.json()
    print("AI Photo Verdict:", data_ai.get("verdict"))
    print("AI Photo Status Badge:", data_ai.get("statusBadge"))
    print("AI Photo Confidence Tier:", data_ai.get("confidenceTier"))
    print("AI Photo isAIGenerated:", data_ai.get("isAIGenerated"))
    print("AI Photo Confidence:", data_ai.get("confidence"))
    print("AI Photo RealConfidence:", data_ai.get("realConfidence"))
    print("AI Photo SyntheticConfidence:", data_ai.get("syntheticConfidence"))
    print("AI Photo Primary Findings:", json.dumps(data_ai.get("primaryFindings"), indent=2))

    # Assertions
    assert data_real.get("isAIGenerated") is False, "Real photo should not be classified as AI"
    assert data_ai.get("isAIGenerated") is True, "AI photo should be classified as AI"
    print("\nALL AUTOMATED VERIFICATION CHECKS PASSED PERFECTLY!")

if __name__ == "__main__":
    test_samples()
