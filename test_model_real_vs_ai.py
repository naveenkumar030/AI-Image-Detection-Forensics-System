import os
import requests
import json

# Ensure test real photo exists
if not os.path.exists("test_real_photo.png"):
    real_photo_url = "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/330px-Image_created_with_a_mobile_phone.png"
    try:
        r = requests.get(real_photo_url, headers={"User-Agent": "Mozilla/5.0"}, timeout=10)
        with open("test_real_photo.png", "wb") as f:
            f.write(r.content)
    except Exception as e:
        print("Notice: could not download real photo:", e)

res = requests.post("http://127.0.0.1:8000/api/predict", files={"file": open("test_real_photo.png", "rb")})
d = res.json()
print("=== PREDICTION ON test_real_photo.png ===")
print("Verdict:             ", d.get("verdict"))
print("Confidence:          ", d.get("confidence"))
print("RealConfidence:      ", d.get("realConfidence"))
print("SyntheticConfidence: ", d.get("syntheticConfidence"))
print("StatusBadge:         ", d.get("statusBadge"))
print("ModelUsed:           ", d.get("modelUsed"))
print("CropConsistency:     ", d.get("cropConsistency"))
print("Limitations:         ", d.get("limitations"))
print("Reasons:             ", d.get("reasons"))
