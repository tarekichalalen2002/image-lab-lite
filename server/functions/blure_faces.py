import cv2
import numpy as np
from mtcnn import MTCNN

def blur_faces(image_path, output_path, expand_factor=1.5):
    image = cv2.imread(image_path)
    if image is None:
        raise ValueError(f"Could not load image from {image_path}")
    rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    detector = MTCNN()
    result = detector.detect_faces(rgb_image)
    for face in result:
        x, y, w, h = face['box']

        x = int(x - (expand_factor - 1) * w / 2)
        y = int(y - (expand_factor - 1) * h / 2)
        w = int(w * expand_factor)
        h = int(h * expand_factor)

        x = max(0, x)
        y = max(0, y)
        w = min(image.shape[1] - x, w)
        h = min(image.shape[0] - y, h)
        face_region = image[y:y+h, x:x+w]
        blurred_face = cv2.GaussianBlur(face_region, (99, 99), 30)
        image[y:y+h, x:x+w] = blurred_face
    cv2.imwrite(output_path, image)
    
    return output_path
