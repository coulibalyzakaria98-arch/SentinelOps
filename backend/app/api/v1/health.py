from fastapi import APIRouter
from ...db.database import engine
from ...config import settings
import redis

router = APIRouter()

@router.get("/")
def health_check():
    health = {"status": "ok", "services": {}}
    
    # DB check
    try:
        engine.connect()
        health["services"]["db"] = "up"
    except Exception:
        health["services"]["db"] = "down"
        health["status"] = "degraded"
        
    # Redis check
    try:
        r = redis.from_url(settings.REDIS_URL)
        r.ping()
        health["services"]["redis"] = "up"
    except Exception:
        health["services"]["redis"] = "down"
        health["status"] = "degraded"
        
    return health
