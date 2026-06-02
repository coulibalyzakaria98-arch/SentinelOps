from sqlalchemy import text
from sqlalchemy.orm import Session
import logging

logger = logging.getLogger(__name__)

class SpatialService:
    @staticmethod
    def get_crisis_clusters(db: Session, radius_meters: int = 500, min_points: int = 3):
        """
        Geospatial Clustering (DBSCAN): Groups nearby reports to detect high-impact zones.
        Optimized for humanitarian decision making by focusing on hotspots.
        """
        # Convert radius from meters to degrees (approximate for Abidjan context)
        # 1 degree is roughly 111km, so 500m is approx 0.0045 degrees
        eps = radius_meters / 111000.0
        
        query = text("""
            SELECT
                cluster_id,
                COUNT(*) AS report_count,
                AVG(confidence_score) AS avg_confidence,
                ST_Y(ST_Centroid(ST_Collect(location))) AS lat,
                ST_X(ST_Centroid(ST_Collect(location))) AS lon,
                MODE() WITHIN GROUP (ORDER BY infrastructure_type) AS dominant_infra,
                MAX(damage_level) AS max_severity
            FROM (
                SELECT 
                    *,
                    ST_ClusterDBSCAN(location, eps := :eps, minpoints := :min_points) OVER () AS cluster_id
                FROM reports
            ) sub
            WHERE cluster_id IS NOT NULL
            GROUP BY cluster_id
            ORDER BY report_count DESC;
        """)
        
        try:
            result = db.execute(query, {"eps": eps, "min_points": min_points}).fetchall()
            
            clusters = []
            for row in result:
                clusters.append({
                    "id": row.cluster_id,
                    "count": row.report_count,
                    "confidence": round(row.avg_confidence, 2),
                    "latitude": row.lat,
                    "longitude": row.lon,
                    "dominant_infra": row.dominant_infra,
                    "severity": row.max_severity,
                    "priority": "CRITICAL" if row.report_count >= 5 and row.avg_confidence > 0.7 else "HIGH" if row.report_count >= 3 else "MONITOR"
                })
            
            logger.info(f"📍 Spatial Fusion: {len(clusters)} tactical impact zones detected.")
            return clusters
        except Exception as e:
            logger.error(f"Cluster detection failure: {str(e)}")
            return []

spatial_service = SpatialService()
