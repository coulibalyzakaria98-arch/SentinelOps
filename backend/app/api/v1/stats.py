from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from ...db.database import get_db
from ...models.report import Report
from ...schemas.report import Stats

router = APIRouter()

@router.get("/", response_model=Stats)
def get_stats(
    range: str = Query("7d", description="Période: 24h, 7d, 30d, 90d, 1y"),
    db: Session = Depends(get_db)
):
    try:
        # Calcul de la date de début selon la période
        now = datetime.utcnow()
        if range == "24h":
            start_date = now - timedelta(hours=24)
        elif range == "7d":
            start_date = now - timedelta(days=7)
        elif range == "30d":
            start_date = now - timedelta(days=30)
        elif range == "90d":
            start_date = now - timedelta(days=90)
        elif range == "1y":
            start_date = now - timedelta(days=365)
        else:
            start_date = now - timedelta(days=7)

        # Base query for the range
        base_query = db.query(Report).filter(Report.created_at >= start_date)
        
        total = base_query.count()
        
        damage_dist = base_query.with_entities(Report.damage_level, func.count(Report.id)).group_by(Report.damage_level).all()
        crisis_dist = base_query.with_entities(Report.crisis_type, func.count(Report.id)).group_by(Report.crisis_type).all()
        
        # Timeline trend (last 7 points)
        recent_trend = []
        # Group by day for the trend
        if range == "24h":
            # 6 points of 4 hours
            for i in range(5, -1, -1):
                t_end = now - timedelta(hours=i*4)
                t_start = t_end - timedelta(hours=4)
                count = base_query.filter(Report.created_at >= t_start, Report.created_at < t_end).count()
                recent_trend.append({"label": t_end.strftime("%H:%M"), "value": count})
        else:
            # 7 days
            for i in range(6, -1, -1):
                day = now - timedelta(days=i)
                t_start = datetime(day.year, day.month, day.day)
                t_end = t_start + timedelta(days=1)
                count = db.query(Report).filter(Report.created_at >= t_start, Report.created_at < t_end).count()
                recent_trend.append({"label": day.strftime("%d/%m"), "value": count})

        return Stats(
            total_reports=total,
            by_damage_level=dict(damage_dist) if damage_dist else {},
            by_crisis_type=dict(crisis_dist) if crisis_dist else {},
            recent_trend=recent_trend
        )
    except Exception as e:
        print(f"❌ Error getting stats: {str(e)}")
        return Stats(
            total_reports=0,
            by_damage_level={},
            by_crisis_type={},
            recent_trend=[]
        )
