from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
import json
from ...db.database import get_db
from ...schemas.report import ReportCreate, ReportInDB
from ...services.report_service import report_service
from ...services.spatial_service import spatial_service
from ...services.scoring_service import scoring_service
from geoalchemy2.functions import ST_X, ST_Y
from sqlalchemy import func

router = APIRouter()

@router.get("/clusters")
def list_clusters(db: Session = Depends(get_db)):
    """
    Intelligence Hotspots: Returns clusters of reports detected via PostGIS ST_ClusterDBSCAN.
    Used for tactical identification of impact zones.
    """
    try:
        data = spatial_service.get_crisis_clusters(db)
        return {"success": True, "data": data}
    except Exception as e:
        print(f"❌ Error in cluster analysis: {str(e)}")
        return {"success": False, "data": []}

@router.post("/", response_model=ReportInDB)
async def create_report(
    title: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    damage_level: str = Form(...),
    infrastructure_type: str = Form(...),
    crisis_type: str = Form(...),
    latitude: float = Form(...),
    longitude: float = Form(...),
    metadata: str = Form("{}"),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    report_data = ReportCreate(
        title=title,
        description=description,
        damage_level=damage_level,
        infrastructure_type=infrastructure_type,
        crisis_type=crisis_type,
        latitude=latitude,
        longitude=longitude,
        metadata=json.loads(metadata)
    )
    return await report_service.create_report(db, report_data, image)

@router.get("/", response_model=List[dict])
def list_reports(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    🔥 FIX: Optimization des performances et correction de l'extraction de géométrie.
    Utilise une seule requête pour récupérer les rapports et leurs coordonnées.
    """
    from ...models.report import Report # Local import to avoid circular dependency if any
    
    query = db.query(
        Report,
        func.ST_Y(Report.location).label('lat'),
        func.ST_X(Report.location).label('lon')
    ).offset(skip).limit(limit).all()
    
    result = []
    for r, lat, lon in query:
        try:
            mock_duplicates_count = (r.version - 1) * 2
            
            report_dict = {
                "id": str(r.id),
                "title": r.title or "Unnamed Report",
                "description": r.description or "",
                "damage_level": r.damage_level,
                "infrastructure_type": r.infrastructure_type,
                "crisis_type": r.crisis_type,
                "latitude": float(lat) if lat is not None else 0.0,
                "longitude": float(lon) if lon is not None else 0.0,
                "confidence_score": float(r.confidence_score or 0.0),
                "image_path": r.image_path,
                "created_at": r.created_at.isoformat() if r.created_at else None,
                "version": r.version or 1,
                "priority_explanation": scoring_service.get_explanation(r, mock_duplicates_count)
            }
            result.append(report_dict)
        except Exception as e:
            print(f"❌ Error serializing report {r.id}: {str(e)}")
            continue
    
    return result
