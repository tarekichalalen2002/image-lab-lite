import cv2

def convert_to_black_and_white(image_path, output_path, threshold=128):
    image = cv2.imread(image_path)
    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    _, bw_image = cv2.threshold(gray_image, threshold, 255, cv2.THRESH_BINARY)
    cv2.imwrite(output_path, bw_image)
    return output_path