import cv2
import numpy as np
from mtcnn import MTCNN


def blur_faces(image_path, output_path, expand_factor=1.5):
    image = cv2.imread(image_path)
    detector = MTCNN()
    
    # Detect faces
    result = detector.detect_faces(image)
    
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
        
        mask = np.zeros((h, w), dtype=np.uint8)
        center = (w // 2, h // 2)
        radius = min(center[0], center[1], w - center[0], h - center[1])
        cv2.circle(mask, center, radius, (255, 255, 255), -1)
        face_region = image[y:y+h, x:x+w]
        blurred_face = cv2.GaussianBlur(face_region, (99, 99), 30)
        face_region[mask == 255] = blurred_face[mask == 255]
        image[y:y+h, x:x+w] = face_region

    cv2.imwrite(output_path, image)
    return output_path