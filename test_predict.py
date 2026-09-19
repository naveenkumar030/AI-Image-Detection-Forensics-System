from transformers import pipeline
from PIL import Image

classifier = pipeline("image-classification", model="prithivMLmods/deepfake-detector-model-v1")
img = Image.open('scratch_test.jpg')
preds = classifier(img)
print("Raw preds on solid color:", preds)

