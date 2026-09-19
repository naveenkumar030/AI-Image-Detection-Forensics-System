import torch
from transformers import AutoImageProcessor, AutoModelForImageClassification
from PIL import Image

MODEL_ID = "umm-maybe/AI-image-detector"
processor = AutoImageProcessor.from_pretrained(MODEL_ID)
model = AutoModelForImageClassification.from_pretrained(MODEL_ID)
model.eval()

img = Image.open('scratch_test.jpg').convert("RGB")
inputs = processor(images=img, return_tensors="pt")

with torch.no_grad():
    outputs = model(**inputs)
    logits = outputs.logits
    probs = torch.softmax(logits, dim=-1)[0]

id2label = model.config.id2label
print(f"Predictions on scratch_test.jpg with {MODEL_ID}:")
for idx, prob in enumerate(probs):
    print(f"  {id2label.get(idx, idx)}: {prob.item():.4f}")
