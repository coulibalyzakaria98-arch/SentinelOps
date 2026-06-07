from sqlalchemy.orm import Session
from ..models.report import Report
from ..schemas.report import ReportCreate, ReportUpdate
from ..services.image_service import image_service
from ..services.duplicate_service import duplicate_service
from ..services.scoring_service import scoring_service
from ..core.security import sign_report
from geoalchemy2.functions import ST_GeomFromText
from fastapi import UploadFile
import uuid

class ReportService:
    @staticmethod
    async def create_report(db: Session, report_data: ReportCreate, image: UploadFile = None):
        image_filename = None
        image_url = None
        image_hash = None
        
        if image:
            image_filename, image_url, image_hash = await image_service.process_and_upload(image)
        
        # Check for duplicates
        duplicates = duplicate_service.check_duplicates(
            db, report_data.latitude, report_data.longitude, image_hash
        )
        
        # 🔥 FIX: Créer la géométrie correctement avec PostGIS ST_GeomFromText
        wkt_point = f'POINT({report_data.longitude} {report_data.latitude})'
        geometry = ST_GeomFromText(wkt_point, 4326)
        
        new_report = Report(
            title=report_data.title,
            description=report_data.description,
            damage_level=report_data.damage_level,
            infrastructure_type=report_data.infrastructure_type,
            crisis_type=report_data.crisis_type,
            location=geometry,  # 🔥 Utiliser l'objet geometry, pas string
            image_path=image_filename,
            image_url=image_url,
            image_hash=image_hash,
            metadata_json=report_data.metadata,
            version=report_data.version
        )
        
        # Calcul du score de confiance
        new_report.confidence_score = scoring_service.calculate_score(new_report, len(duplicates))
        
        # 🔐 Data Integrity: Sign the report for non-repudiation
        report_dict = {
            "latitude": report_data.latitude,
            "longitude": report_data.longitude,
            "damage_level": report_data.damage_level,
            "infrastructure_type": report_data.infrastructure_type
        }
        new_report.signature = sign_report(report_dict)

        db.add(new_report)
        db.commit()
        db.refresh(new_report)
        
        # 🛰️ REAL-TIME BROADCAST: Notify all active command centers
        from ..core.ws import manager
        import asyncio
        
        # Convert to dict for JSON serialization
        # Note: We use properties added earlier (latitude, longitude)
        report_dict = {
            "id": str(new_report.id),
            "title": new_report.title or "Rapid Capture",
            "description": new_report.description or "",
            "latitude": float(report_data.latitude),
            "longitude": float(report_data.longitude),
            "damage_level": new_report.damage_level,
            "infrastructure_type": new_report.infrastructure_type,
            "crisis_type": new_report.crisis_type,
            "confidence_score": float(new_report.confidence_score or 0.5),
            "created_at": new_report.created_at.isoformat()
        }
        
        # Use background task to not block the response
        try:
            loop = asyncio.get_event_loop()
            if loop.is_running():
                loop.create_task(manager.broadcast({"type": "NEW_REPORT", "data": report_dict}))
        except Exception as e:
            print(f"⚠️ WebSocket Broadcast Failed: {e}")
            
        return new_report

    @staticmethod
    def get_reports(db: Session, skip: int = 0, limit: int = 100):
        return db.query(Report).offset(skip).limit(limit).all()

report_service = ReportService()
