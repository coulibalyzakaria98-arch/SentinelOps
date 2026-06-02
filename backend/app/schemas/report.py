from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from uuid import UUID

class ReportBase(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    damage_level: str
    infrastructure_type: str
    crisis_type: str
    latitude: float
    longitude: float
    metadata: Optional[dict] = Field({}, validation_alias='extra_metadata')

class ReportCreate(ReportBase):
    version: Optional[int] = 1

class ReportUpdate(ReportBase):
    version: int

class ReportInDB(ReportBase):
    id: UUID
    version: int
    image_path: Optional[str] = None
    image_hash: Optional[str] = None
    confidence_score: float
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class Stats(BaseModel):
    total_reports: int
    by_damage_level: dict
    by_crisis_type: dict
    recent_trend: List[dict]
