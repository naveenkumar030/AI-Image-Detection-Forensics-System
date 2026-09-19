import requests
import json
from PIL import Image
import numpy as np

# Download a known AI-generated image from Wikimedia Commons
# (e.g., Stable Diffusion / Midjourney sample)
ai_img_url = "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Astronaut_riding_a_horse_%28SDXL%29.jpg/300px-Astronaut_riding_a_horse_%28SDXL%29.jpg"
try:
    r = requests.get(ai_img_url, headers={"User-Agent": "Mozilla/5.0"}, timeout=10)
    if r.status_code == 200:
        with open("test_ai_sdxl.jpg", "wb") as f:
            f.write(r.content)

        resp = requests.post("http://127.0.0.1:8000/api/predict", files={"file": open("test_ai_sdxl.jpg", "rb")})
        d = resp.json()
        print("AI SDXL SAMPLE:")
        print("VERDICT:", d.get("verdict"))
        print("IS_AI:", d.get("isAIGenerated"))
        print("CONFIDENCE:", d.get("confidence"))
        print("SYNTH_CONF:", d.get("syntheticConfidence"))
        print("FINDINGS:", json.dumps(d.get("primaryFindings"), indent=2))
    else:
        print("Download status:", r.status_code)
except Exception as e:
    print("Download error:", e)
