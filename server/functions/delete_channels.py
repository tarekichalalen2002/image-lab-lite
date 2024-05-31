import cv2
import numpy as np


def delete_channels(image_path, output_path, channels_to_delete):
    image = cv2.imread(image_path)
    for channel in channels_to_delete:
        image[:, :, channel] = 0
    cv2.imwrite(output_path, image)
    return output_path