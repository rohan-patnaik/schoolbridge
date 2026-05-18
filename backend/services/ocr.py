import io
import base64
import pytesseract
import cv2
import numpy as np
from PIL import Image
import pdfplumber


def preprocess_image(image: Image.Image) -> Image.Image:
    img_array = np.array(image)
    if len(img_array.shape) == 3:
        gray = cv2.cvtColor(img_array, cv2.COLOR_RGB2GRAY)
    else:
        gray = img_array
    denoised = cv2.fastNlMeansDenoising(gray, h=10)
    binary = cv2.adaptiveThreshold(
        denoised, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2
    )
    return Image.fromarray(binary)


def extract_text_from_image(file_bytes: bytes) -> str:
    image = Image.open(io.BytesIO(file_bytes))
    processed = preprocess_image(image)
    text = pytesseract.image_to_string(processed)
    return text.strip()


def extract_text_from_pdf(file_bytes: bytes) -> str:
    pages_text = []
    with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
        for page in pdf.pages:
            text = page.extract_text()
            if text:
                pages_text.append(text)
    return "\n\n".join(pages_text).strip()


def image_to_base64(file_bytes: bytes) -> str:
    image = Image.open(io.BytesIO(file_bytes))
    if image.mode == "RGBA":
        image = image.convert("RGB")
    buf = io.BytesIO()
    image.save(buf, format="JPEG", quality=85)
    return base64.b64encode(buf.getvalue()).decode("utf-8")


def extract_text(file_bytes: bytes, content_type: str) -> tuple[str, str | None]:
    """Returns (ocr_text, base64_image_or_none)."""
    if content_type == "application/pdf":
        return extract_text_from_pdf(file_bytes), None
    if content_type and content_type.startswith("text/"):
        return file_bytes.decode("utf-8", errors="replace").strip(), None
    b64 = image_to_base64(file_bytes)
    text = extract_text_from_image(file_bytes)
    return text, b64
