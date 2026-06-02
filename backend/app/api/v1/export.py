from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from ...db.database import get_db
from ...models.report import Report
from geoalchemy2.functions import ST_X, ST_Y
import io
import csv
import json

router = APIRouter()

@router.get("/csv")
def export_csv(db: Session = Depends(get_db)):
    reports = db.query(Report).all()
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["id", "damage_level", "lat", "lon", "created_at"])
    
    for r in reports:
        writer.writerow([r.id, r.damage_level, db.scalar(ST_Y(r.location)), db.scalar(ST_X(r.location)), r.created_at])
        
    output.seek(0)
    return StreamingResponse(output, media_type="text/csv", headers={"Content-Disposition": "attachment; filename=reports.csv"})

@router.get("/geojson")
def export_geojson(db: Session = Depends(get_db)):
    reports = db.query(Report).all()
    features = []
    
    for r in reports:
        features.append({
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [db.scalar(ST_X(r.location)), db.scalar(ST_Y(r.location))]
            },
            "properties": {
                "id": str(r.id),
                "damage_level": r.damage_level,
                "confidence_score": r.confidence_score
            }
        })
        
    geojson = {"type": "FeatureCollection", "features": features}
    return geojson
