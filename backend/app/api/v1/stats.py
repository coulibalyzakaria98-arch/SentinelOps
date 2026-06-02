from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from ...db.database import get_db
from ...models.report import Report
from ...schemas.report import Stats

router = APIRouter()

@router.get("/", response_model=Stats)
def get_stats(db: Session = Depends(get_db)):
    try:
        total = db.query(Report).count()
        
        damage_dist = db.query(Report.damage_level, func.count(Report.id)).group_by(Report.damage_level).all()
        crisis_dist = db.query(Report.crisis_type, func.count(Report.id)).group_by(Report.crisis_type).all()
        
        # 🔥 CRITICAL FIX: Return Stats schema directly, not wrapped
        return Stats(
            total_reports=total,
            by_damage_level=dict(damage_dist) if damage_dist else {},
            by_crisis_type=dict(crisis_dist) if crisis_dist else {},
            recent_trend=[]
        )
    except Exception as e:
        print(f"❌ Error getting stats: {str(e)}")
        # Return safe defaults matching Stats schema
        return Stats(
            total_reports=0,
            by_damage_level={},
            by_crisis_type={},
            recent_trend=[]
        )
