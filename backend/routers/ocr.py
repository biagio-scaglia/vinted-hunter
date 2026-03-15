import io
import re
import logging

import numpy as np
from fastapi import APIRouter, UploadFile, File
from PIL import Image, ImageEnhance, ImageFilter

logger = logging.getLogger(__name__)
router = APIRouter()

_ocr_reader = None


def _get_reader():
    global _ocr_reader
    if _ocr_reader is None:
        import easyocr
        logger.info("Initializing EasyOCR reader (first call)")
        _ocr_reader = easyocr.Reader(["it", "en"], gpu=False)
    return _ocr_reader


@router.post("/ocr")
async def ocr_image(file: UploadFile = File(...)):
    contents = await file.read()
    image = Image.open(io.BytesIO(contents)).convert("RGB")

    # Upscale small images — EasyOCR works best when long side >= 1200 px
    w, h = image.size
    long_side = max(w, h)
    if long_side < 1200:
        scale = 1200 / long_side
        image = image.resize((int(w * scale), int(h * scale)), Image.LANCZOS)

    image = image.filter(ImageFilter.SHARPEN)
    image = ImageEnhance.Contrast(image).enhance(1.5)

    img_array = np.array(image)
    reader = _get_reader()
    raw = reader.readtext(img_array, detail=1, paragraph=False)

    tokens = []
    for (_bbox, text, conf) in raw:
        if conf < 0.45:
            continue
        text = text.strip()
        clean = re.sub(r"[^a-zA-Z0-9àèéìòùÀÈÉÌÒÙ\s'-]", "", text).strip()
        if len(clean) < 2:
            continue
        # Skip isolated 1-2 digit numbers (ratings, page counts)
        if re.fullmatch(r"\d{1,2}", clean):
            continue
        tokens.append(clean)

    text = re.sub(r"\s{2,}", " ", " ".join(tokens)).strip()
    logger.info("OCR extracted %d tokens → %d chars", len(tokens), len(text))
    return {"text": text}
