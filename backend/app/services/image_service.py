import hashlib
import os
from PIL import Image
from ..config import settings
from fastapi import UploadFile
import uuid
import cloudinary
import cloudinary.uploader

class ImageService:
    def __init__(self):
        # Configure Cloudinary if credentials are provided
        self.cloudinary_available = False
        cloud_name = os.getenv("CLOUDINARY_CLOUD_NAME")
        api_key = os.getenv("CLOUDINARY_API_KEY")
        api_secret = os.getenv("CLOUDINARY_API_SECRET")

        if all([cloud_name, api_key, api_secret]):
            cloudinary.config(
                cloud_name=cloud_name,
                api_key=api_key,
                api_secret=api_secret,
                secure=True
            )
            self.cloudinary_available = True
            print("✅ Cloudinary storage initialized")

    async def process_and_upload(self, file: UploadFile) -> tuple[str, str, str]:
        """
        Strips EXIF, saves locally, and uploads to Cloudinary if available.
        Returns (filename, image_url, sha256_hash).
        """
        content = await file.read()
        sha256_hash = hashlib.sha256(content).hexdigest()
        
        # Local processing
        from io import BytesIO
        img = Image.open(BytesIO(content))
        if img.mode != "RGB":
            img = img.convert("RGB")
        
        filename = f"{uuid.uuid4()}.jpg"
        local_path = os.path.join(settings.UPLOAD_DIR, filename)
        os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
        img.save(local_path, "JPEG", quality=85, optimize=True)
        
        # Upload to Cloudinary
        image_url = None
        if self.cloudinary_available:
            try:
                # Reset pointer for upload
                upload_result = cloudinary.uploader.upload(
                    content,
                    folder="sentinelops/reports",
                    public_id=filename.split('.')[0],
                    resource_type="image"
                )
                image_url = upload_result.get("secure_url")
                print(f"🚀 Image uploaded to Cloudinary: {image_url}")
            except Exception as e:
                print(f"⚠️ Cloudinary upload failed: {e}")
        
        return filename, image_url, sha256_hash

    def strip_exif_and_save(self, file: UploadFile) -> tuple[str, str]:
        """Legacy method for synchronous operations if needed"""
        file.file.seek(0)
        content = file.file.read()
        sha256_hash = hashlib.sha256(content).hexdigest()
        
        file.file.seek(0)
        img = Image.open(file.file)
        if img.mode != "RGB":
            img = img.convert("RGB")
        
        filename = f"{uuid.uuid4()}.jpg"
        filepath = os.path.join(settings.UPLOAD_DIR, filename)
        os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
        img.save(filepath, "JPEG", quality=85, optimize=True)
        
        return filename, sha256_hash

image_service = ImageService()
