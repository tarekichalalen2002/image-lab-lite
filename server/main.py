from flask import Flask, request, send_file
from flask_cors import CORS
from functions.remove_background import remove_background
from functions.to_gray import to_gray
from functions.blure_faces import blur_faces
from functions.bw_conversion import convert_to_black_and_white
import os

app = Flask(__name__)
CORS(app)

@app.route('/remove-background', methods=['POST'])
def remove_background_api():
    if request.method == 'POST':
        image = request.files['image']
        image_path = f'images/{image.filename}'
        image.save(image_path)
        output_path = f'output/{image.filename}'
        output_path = remove_background(image_path, output_path)
        os.remove(image_path)
        return send_file(output_path, as_attachment=True)
    
@app.route("/to-gray", methods=['POST'])
def image_to_gray():
    if request.method == 'POST':
        image = request.files['image']
        image_path = f'images/{image.filename}'
        image.save(image_path)
        output_path = to_gray(image_path, f'output/{image.filename}')
        os.remove(image_path)
        return send_file(output_path, as_attachment=True)

@app.route('/blur-face', methods=['POST'])
def image_blur_face():
    if request.method == 'POST':
        image = request.files['image']
        image_path = f'images/{image.filename}'
        image.save(image_path)
        output_path = blur_faces(image_path, f'output/{image.filename}')
        os.remove(image_path)
        return send_file(output_path, as_attachment=True)

@app.route('/to-black-white', methods=['POST'])

def image_to_black_and_white():
    if request.method == 'POST':
        image = request.files['image']
        image_path = f'images/{image.filename}'
        image.save(image_path)
        output_path = convert_to_black_and_white(image_path, f'output/{image.filename}')
        os.remove(image_path)
        return send_file(output_path, as_attachment=True)


if __name__ == '__main__':
    app.run(debug=True)