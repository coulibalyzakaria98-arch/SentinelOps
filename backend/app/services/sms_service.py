import httpx
import logging
from typing import Optional, Tuple
from ..schemas.report import ReportCreate
from .report_service import report_service
from sqlalchemy.orm import Session

logger = logging.getLogger(__name__)

class SMSService:
    # 🌍 Operational Bias: Optimize for West African context
    GEO_BIAS = "Côte d'Ivoire"
    
    async def geocode_location(self, location_name: str) -> Tuple[Optional[float], Optional[float]]:
        """
        Humanitarian Geocoding: Resolves place names into coordinates via OpenStreetMap.
        Includes a geographic bias to ensure accuracy in crisis zones.
        """
        async with httpx.AsyncClient() as client:
            try:
                params = {
                    "q": f"{location_name}, {self.GEO_BIAS}",
                    "format": "json",
                    "limit": 1
                }
                headers = { "User-Agent": "SentinelOps-CrisisCenter/1.0" }
                
                response = await client.get("https://nominatim.openstreetmap.org/search", params=params, headers=headers)
                data = response.json()
                
                if data:
                    return float(data[0]["lat"]), float(data[0]["lon"])
                
                # Fallback: Search without bias if no results
                params["q"] = location_name
                response = await client.get("https://nominatim.openstreetmap.org/search", params=params, headers=headers)
                data = response.json()
                if data:
                    return float(data[0]["lat"]), float(data[0]["lon"])
                    
                return None, None
            except Exception as e:
                logger.error(f"Geocoding failure for {location_name}: {str(e)}")
                return None, None

    def parse_sms(self, message: str) -> dict:
        """
        Flexible Tactical Parser: Handles both GPS and Place Name formats.
        Format A: RR|[TYPE]|[SEVERITY]|[LAT]|[LON]|[DESC]
        Format B: RR|[TYPE]|[SEVERITY]|[PLACE_NAME]|[DESC]
        """
        parts = [p.strip() for p in message.split("|")]
        
        if not parts or parts[0].upper() != "RR":
            raise ValueError("Invalid Protocol: Missing RR header")

        if len(parts) == 6:
            # GPS Format (RR|TYPE|SEVERITY|LAT|LON|DESC)
            return {
                "type": parts[1].lower(),
                "severity": parts[2].lower(),
                "latitude": float(parts[3]),
                "longitude": float(parts[4]),
                "description": parts[5],
                "location_name": None
            }
        elif len(parts) == 5:
            # Place Name Format (RR|TYPE|SEVERITY|PLACE_NAME|DESC)
            return {
                "type": parts[1].lower(),
                "severity": parts[2].lower(),
                "location_name": parts[3],
                "description": parts[4],
                "latitude": None,
                "longitude": None
            }
        else:
            raise ValueError(f"Protocol Violation: Unexpected part count ({len(parts)})")

    async def process_incoming_sms(self, db: Session, message: str):
        """
        End-to-end SMS Processing Pipeline: Parse -> Geocode -> Register -> Score
        """
        try:
            # 1. Parsing
            raw_report = self.parse_sms(message)
            
            # 2. Intelligence Enhancement (Geocoding)
            lat, lon = raw_report["latitude"], raw_report["longitude"]
            if lat is None:
                logger.info(f"📍 Geocoding request for tactical location: {raw_report['location_name']}")
                lat, lon = await self.geocode_location(raw_report["location_name"])
            
            if lat is None:
                return {"status": "error", "reason": "location_unresolved", "data": raw_report}

            # 3. Report Registration
            report_data = ReportCreate(
                title=f"SMS: {raw_report['type'].upper()} ({raw_report['location_name'] or 'GPS'})",
                description=f"[SMS ORIGIN] {raw_report['description']}",
                damage_level=raw_report["severity"],
                infrastructure_type=raw_report["type"],
                crisis_type="emergency",
                latitude=lat,
                longitude=lon,
                metadata={"source": "sms_gateway", "original_msg": message}
            )

            report = await report_service.create_report(db, report_data)
            return {"status": "processed", "id": str(report.id), "lat": lat, "lon": lon}

        except Exception as e:
            logger.error(f"SMS Pipeline Failure: {str(e)}")
            raise e

sms_service = SMSService()
