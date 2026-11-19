# Image Lab Lite

A small image editor in the browser. You drop in a photo, pick a filter, and the React client sends the file to a Flask server. The server writes the result under `server/output/` and sends that file back. The page shows it and lets you download it as `downloaded-image.jpg`.

## Filters

| Filter in the UI | Request | What the server does |
| --- | --- | --- |
| gray scale | `POST /to-gray` | OpenCV converts BGR to gray |
| black & white | `POST /to-black-white` | Gray, then a binary threshold at 128 |
| blur faces | `POST /blur-face` | MTCNN finds faces, grows each box by 1.5, and applies a Gaussian blur |
| remove background | `POST /remove-background` | `rembg` removes the background and saves a PNG |
| green only | `POST /delete-channels` with `[0, 2]` | Zeros the blue and red channels (OpenCV order is BGR) |
| red only | `POST /delete-channels` with `[0, 1]` | Zeros blue and green |
| blue only | `POST /delete-channels` with `[1, 2]` | Zeros green and red |

Every route expects a multipart field named `image`. Channel deletion also expects a form field `channels`, a JSON list of channel indexes. The upload is saved in `server/images/`, processed, then deleted. The file in `server/output/` is left in place. Both folders are relative to the working directory, so start Flask from `server/`. `images/` has to exist before the first upload. `output/` is already in the repo.

The dropdown also opens **advanced modifications**: red, green, and blue sliders from 0 to 1. **Save** only keeps those numbers in React state. **Generate** never sends them, so the sliders do not change the image.

## Client

Vite and React 18, styled with Tailwind. The header is `Image Lab Lite`. The form is a drag-and-drop area (or **Browse**, limited to `image/*`), a filter menu, and a result panel. **Generate** posts the file to `http://127.0.0.1:5000`. While the request is in flight the button reads **Generating...** and a spinner replaces the result. Hover the result and click it, or the download icon, to save the blob.

`package.json` sets `"proxy": "http://localhost:5000"`, but the fetch calls use the absolute `127.0.0.1:5000` URL, so that proxy is unused.

| Path | Role |
| --- | --- |
| `client/src/App.jsx` | Renders the header and the form |
| `client/src/components/Header.jsx` | Title |
| `client/src/components/Form.jsx` | Drop zone, filters, advanced panel, result |
| `client/src/http/index.js` | One upload function per filter |

## Server

Flask with CORS, debug mode, default port **5000**.

| Path | Role |
| --- | --- |
| `server/main.py` | Routes, save upload, return the output file |
| `server/functions/to_gray.py` | Grayscale |
| `server/functions/bw_conversion.py` | Black and white |
| `server/functions/blure_faces.py` | Face blur |
| `server/functions/remove_background.py` | Background removal |
| `server/functions/delete_channels.py` | Zero selected BGR channels |

There is no `requirements.txt`. The server imports Flask, Flask-CORS, OpenCV (`cv2`), NumPy, Pillow, `rembg`, and `mtcnn`. Face detection through MTCNN also needs TensorFlow.

## Run

Terminal 1, from `server/` (create `images/` if it is missing):

```bash
cd image-lab-lite/server
mkdir -p images
pip install flask flask-cors opencv-python numpy pillow rembg mtcnn tensorflow
python main.py
```

Terminal 2:

```bash
cd image-lab-lite/client
npm install
npm run dev
```

Vite serves the page on its usual port (5173). The API stays on port 5000.
