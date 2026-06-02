from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://postgres:postgres@db:5432/sentinelops"
    REDIS_URL: str = "redis://redis:6379/0"
    SECRET_KEY: str = "devsecret"
    ENV: str = "development"
    UPLOAD_DIR: str = "/app/uploads"
    
    # Form Schema (Dynamic)
    FORM_SCHEMA: dict = {
        "damage_levels": ["minimal", "partial", "total"],
        "infrastructure_types": ["residential", "commercial", "public", "infrastructure", "other"],
        "crisis_types": ["earthquake", "flood", "fire", "war", "other"]
    }

    class Config:
        env_file = ".env"

settings = Settings()
