import requests

real_photo_url = "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/330px-Image_created_with_a_mobile_phone.png"
r = requests.get(real_photo_url, headers={"User-Agent": "Mozilla/5.0"})
with open("test_real_photo.png", "wb") as f:
    f.write(r.content)

import requests

res = requests.post("http://127.0.0.1:8000/api/predict", files={"file": open("test_real_photo.png", "rb")})
d = res.json()
print("Verdict:", d.get("verdict"))
print("Confidence:", d.get("confidence"))
print("RealConfidence:", d.get("realConfidence"))
print("StatusBadge:", d.get("statusBadge"))
print("ModelUsed:", d.get("modelUsed"))



