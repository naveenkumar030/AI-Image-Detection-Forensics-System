from transformers import pipeline
from PIL import Image

classifier = pipeline("image-classification", model="prithivMLmods/deepfake-detector-model-v1")
img = Image.open('test_real_photo.png')
preds = classifier(img)
print("RAW PREDS ON REAL PHOTO:")
for p in preds:
    print(p)
