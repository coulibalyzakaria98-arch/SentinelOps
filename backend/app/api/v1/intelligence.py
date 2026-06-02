from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ...db.database import get_db
from ...services.intelligence_service import intelligence_service
from typing import List

router = APIRouter()

@router.get("/fusion")
def get_fused_intelligence(db: Session = Depends(get_db)):
    """
    Strategic Intelligence Feed: Merges ground and satellite data.
    Provides the final decision-making layer for humanitarian response.
    """
    try:
        data = intelligence_service.get_fused_intelligence(db)
        return {"success": True, "data": data}
    except Exception as e:
        print(f"❌ Error getting fused intelligence: {str(e)}")
        return {"success": False, "data": []}
