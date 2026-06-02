import json
import random
import uuid
from datetime import datetime, timedelta
import httpx
import asyncio

# Configuration
API_URL = "http://localhost:8000/api/v1/reports/"
CITIES = {
    "demo_zone": {"lat": 5.336, "lon": -4.026} # Abidjan, matching CrisisMap center
}

DAMAGE_LEVELS = ["minimal", "partial", "total"]
INFRASTRUCTURES = ["residential", "commercial", "public", "infrastructure"]
CRISES = ["earthquake", "flood", "fire"]

async def seed_data(count=50):
    print(f"🚀 Génération de {count} rapports de démo pour Abidjan...")
    
    async with httpx.AsyncClient() as client:
        for i in range(count):
            # Simulation de cluster (points proches pour créer une heatmap)
            lat = CITIES["demo_zone"]["lat"] + random.uniform(-0.05, 0.05)
            lon = CITIES["demo_zone"]["lon"] + random.uniform(-0.05, 0.05)
            
            payload = {
                "title": f"Tactical Alert #{i+1}",
                "description": "Cross-verified intelligence report for UN/UNDP strategic simulation.",
                "damage_level": random.choice(DAMAGE_LEVELS),
                "infrastructure_type": random.choice(INFRASTRUCTURES),
                "crisis_type": random.choice(CRISES),
                "latitude": str(lat),
                "longitude": str(lon),
                "metadata": json.dumps({"demo": True, "source": "seed_script"})
            }
            
            try:
                # Note: On envoie sans image pour le seed rapide
                response = await client.post(API_URL, data=payload)
                if response.status_code == 200:
                    print(f"✅ Rapport {i+1} créé (Score: {response.json().get('confidence_score', 'N/A')})")
                else:
                    print(f"❌ Erreur {response.status_code}: {response.text}")
            except Exception as e:
                print(f"⚠️ Erreur de connexion : {e}")

if __name__ == "__main__":
    asyncio.run(seed_data(40))
