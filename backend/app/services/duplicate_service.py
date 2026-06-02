from sqlalchemy.orm import Session
from sqlalchemy import func
from ..models.report import Report
from geoalchemy2.functions import ST_DWithin, ST_MakePoint
from datetime import datetime, timedelta

class DuplicateService:
    @staticmethod
    def check_duplicates(db: Session, lat: float, lon: float, image_hash: str = None) -> list[Report]:
        """Checks for spatial (5m), temporal (5min) or hash-based duplicates."""
        
        # 1. Image hash match (exact duplicate)
        if image_hash:
            hash_matches = db.query(Report).filter(Report.image_hash == image_hash).all()
            if hash_matches:
                return hash_matches

        # 2. Spatial and Temporal match
        point = ST_MakePoint(lon, lat)
        five_mins_ago = datetime.utcnow() - timedelta(minutes=5)
        
        spatial_temporal_matches = db.query(Report).filter(
            ST_DWithin(Report.location, point, 0.00005), # ~5m at equator
            Report.created_at >= five_mins_ago
        ).all()
        
        return spatial_temporal_matches

duplicate_service = DuplicateService()
