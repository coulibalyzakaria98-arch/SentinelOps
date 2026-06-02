from sqlalchemy import Column, String, Integer, Float, DateTime, JSON, UUID
from geoalchemy2 import Geometry
from datetime import datetime
import uuid
from ..db.database import Base

class Report(Base):
    __tablename__ = "reports"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    version = Column(Integer, default=1)
    title = Column(String, nullable=True)
    description = Column(String, nullable=True)
    damage_level = Column(String, nullable=False)
    infrastructure_type = Column(String, nullable=False)
    crisis_type = Column(String, nullable=False)
    location = Column(Geometry(geometry_type='POINT', srid=4326), nullable=False)
    image_path = Column(String, nullable=True)
    image_hash = Column(String, nullable=True)
    confidence_score = Column(Float, default=0.0)
    signature = Column(String, nullable=True)
    metadata_json = Column("metadata", JSON, default={})
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    @property
    def latitude(self):
        # We need to handle cases where geometry might not be loaded or is in WKB
        from geoalchemy2.shape import to_shape
        if self.location is not None:
            try:
                point = to_shape(self.location)
                return point.y
            except:
                return 0.0
        return 0.0

    @property
    def longitude(self):
        from geoalchemy2.shape import to_shape
        if self.location is not None:
            try:
                point = to_shape(self.location)
                return point.x
            except:
                return 0.0
        return 0.0

    @property
    def extra_metadata(self):
        return self.metadata_json
