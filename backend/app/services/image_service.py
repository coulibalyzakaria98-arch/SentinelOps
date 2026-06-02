import hashlib
import os
from PIL import Image
from ..config import settings
from fastapi import UploadFile
import uuid

class ImageService:
    @staticmethod
    def strip_exif_and_save(file: UploadFile) -> tuple[str, str]:
        """Strips EXIF data and saves the image. Returns (filename, sha256_hash)."""
        content = file.file.read()
        sha256_hash = hashlib.sha256(content).hexdigest()
        
        # Reset file pointer for Pillow
        file.file.seek(0)
        img = Image.open(file.file)
        
        # Ensure image is in RGB mode (converts RGBA/Transparency for JPEG compatibility)
        if img.mode != "RGB":
            img = img.convert("RGB")
        
        filename = f"{uuid.uuid4()}.jpg"
        filepath = os.path.join(settings.UPLOAD_DIR, filename)
        
        # Ensure directory exists
        os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
        
        img.save(filepath, "JPEG", quality=85, optimize=True)
        
        return filename, sha256_hash

image_service = ImageService()
