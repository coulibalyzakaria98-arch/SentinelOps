import logging
import time
from typing import List, Dict

logger = logging.getLogger(__name__)

class AlertService:
    def __init__(self):
        # 🛡️ Throttling Mechanism: 1 alert per node per 30 minutes.
        self.last_sent_cache: Dict[str, float] = {}
        self.THROTTLE_TIME = 1800 
        
        # 🏛️ GOVERNMENT PRIORITY CHANNELS
        self.CHANNELS = {
            "SMS": ["+2250102030405", "+2250708091011"],
            "WHATSAPP": ["SentinelOps Government Hub"],
            "EMAIL": ["crisis-response@gouv.ci"]
        }

    def _get_gov_priority(self, score: float) -> str:
        """Determines the official National Priority Level."""
        if score > 0.92: return "🔴 NIVEAU ROUGE (Intervention Immédiate)"
        if score > 0.85: return "🟠 NIVEAU ORANGE (Mobilisation Rapide)"
        return "🟢 NIVEAU VERT (Suivi Opérationnel)"

    def _format_tactical_sms(self, zone: dict) -> str:
        """Formats a high-density tactical alert for National Command."""
        priority_lvl = self._get_gov_priority(zone['ranking_score'])
        verif_status = "🛰️ SENTINEL-VERIFIED" if zone.get("satellite_verified") else "⚠️ GROUND-SIGNAL"
        
        return (
            f"🚨 SENTINELOPS NATIONAL ALERT\n"
            f"PRIORITY: {priority_lvl}\n"
            f"ZONE: IMPACT NODE #{zone['rank']}\n"
            f"INFRA: {zone['dominant_infra'].upper()}\n"
            f"COORDS: {zone['lat']:.4f},{zone['lng']:.4f}\n"
            f"INTEL: {verif_status}\n"
            f"REF: {int(time.time())}"
        )

    def trigger_critical_alerts(self, ranked_zones: List[dict]):
        """Dispatches automated alerts across multi-source government channels."""
        now = time.time()
        dispatched_count = 0

        for zone in ranked_zones:
            if zone["ranking_score"] > 0.85:
                zone_id = f"{zone['lat']}_{zone['lng']}"
                
                if zone_id in self.last_sent_cache and now - self.last_sent_cache[zone_id] < self.THROTTLE_TIME:
                    continue

                # 🚀 MULTI-CHANNEL DISPATCH (Simulated)
                message = self._format_tactical_sms(zone)
                
                print(f"\n📢 --- NATIONAL COMMAND DISPATCH ---")
                print(f"📡 CHANNEL [SMS]: {self.CHANNELS['SMS']}")
                print(f"📡 CHANNEL [WHATSAPP]: {self.CHANNELS['WHATSAPP']}")
                print(f"📝 CONTENT:\n{message}")
                print(f"------------------------------------\n")
                
                self.last_sent_cache[zone_id] = now
                dispatched_count += 1
                zone["sms_alert_sent"] = True
                zone["gov_priority"] = self._get_gov_priority(zone['ranking_score'])

        return dispatched_count

alert_service = AlertService()
