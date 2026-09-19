import os
import requests
import json

target_file = "test_ai_sdxl.jpg"

# Try downloading SDXL sample if not already present
if not os.path.exists(target_file):
    ai_img_url = "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Astronaut_riding_a_horse_%28SDXL%29.jpg/300px-Astronaut_riding_a_horse_%28SDXL%29.jpg"
    headers = {"User-Agent": "ImageForensicsBot/1.0 (https://github.com/verilens; test@example.com)"}
    try:
        r = requests.get(ai_img_url, headers=headers, timeout=10)
        if r.status_code == 200:
            with open(target_file, "wb") as f:
                f.write(r.content)
    except Exception as e:
        pass

# Fallback to local AI test image if download failed
if not os.path.exists(target_file):
    if os.path.exists("test_ai_synth.jpg"):
        target_file = "test_ai_synth.jpg"
    elif os.path.exists("test_sample_grid.jpg"):
        target_file = "test_sample_grid.jpg"

if os.path.exists(target_file):
    print(f"Testing sample image: {target_file}")
    with open(target_file, "rb") as f:
        resp = requests.post("http://127.0.0.1:8000/api/predict", files={"file": f})
    d = resp.json()
    print("VERDICT:          ", d.get("verdict"))
    print("IS_AI:            ", d.get("isAIGenerated"))
    print("DISPLAY CONF:     ", d.get("confidence"), "%")
    print("SYNTHETIC CONF:   ", d.get("syntheticConfidence"), "%")
    print("REAL CONF:        ", d.get("realConfidence"), "%")
    print("STATUS BADGE:     ", d.get("statusBadge"))
    print("CROP CONSISTENCY: ", d.get("cropConsistency"))
    print("PRIMARY FINDINGS: ", json.dumps(d.get("primaryFindings"), indent=2))
else:
    print("No sample image found to test.")
