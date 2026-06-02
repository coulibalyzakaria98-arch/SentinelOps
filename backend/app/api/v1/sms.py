from fastapi import APIRouter, Form, Depends
from sqlalchemy.orm import Session
from ...db.database import get_db
from ...services.sms_service import sms_service
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/sms")
async def receive_sms(message: str = Form(...), db: Session = Depends(get_db)):
    """
    Tactical SMS Gateway: Intelligent processing of crisis reports.
    Supports both GPS-based and location-name-based (geocoding) reporting.
    """
    try:
        result = await sms_service.process_incoming_sms(db, message)
        
        if result["status"] == "error":
            logger.warning(f"SMS processing failed for: {message}. Reason: {result['reason']}")
            return result

        logger.info(f"✅ SMS Intelligence successfully integrated: ID {result['id']}")
        return result

    except Exception as e:
        logger.error(f"Critical Gateway failure: {str(e)}")
        return {"status": "error", "message": "processing_failed"}
