import random
import uuid
from datetime import datetime, timedelta
import sys
import os

# Add parent directory to path to import app modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db.database import SessionLocal
from app.models.report import Report

def seed_demo_data():
    """Génère 50 rapports de démonstration réalistes"""
    db = SessionLocal()
    
    # Localisation fictive (Abidjan, Côte d'Ivoire)
    base_lat = 5.3599
    base_lng = -4.0083
    
    crisis_types = ["flood", "fire", "earthquake", "cyclone", "conflict"]
    damage_levels = ["minimal", "partial", "total"]
    infrastructure_types = ["residential", "commercial", "public", "infrastructure", "other"]
    
    # Clear existing demo data (optional)
    # db.query(Report).delete()
    
    reports = []
    for i in range(50):
        # Date aléatoire sur les 7 derniers jours
        random_days = random.randint(0, 7)
        random_hours = random.randint(0, 23)
        random_minutes = random.randint(0, 59)
        created_at = datetime.utcnow() - timedelta(days=random_days, hours=random_hours, minutes=random_minutes)
        
        # Position aléatoire autour d'Abidjan (±0.05 degrés)
        lat = base_lat + random.uniform(-0.05, 0.05)
        lng = base_lng + random.uniform(-0.05, 0.05)
        
        crisis = random.choice(crisis_types)
        damage = random.choice(damage_levels)
        infra = random.choice(infrastructure_types)
        
        report = Report(
            id=uuid.uuid4(),
            title=f"Incident {crisis.capitalize()} - Sector {random.choice(['Alpha', 'Bravo', 'Delta', 'Gamma'])}",
            description=f"Automated alert: High priority {crisis} detected at {lat:.4f}, {lng:.4f}. {damage.capitalize()} damage to {infra} observed.",
            damage_level=damage,
            crisis_type=crisis,
            infrastructure_type=infra,
            latitude=lat,
            longitude=lng,
            created_at=created_at,
            updated_at=created_at,
            confidence_score=random.uniform(0.7, 0.99),
            version=1
        )
        reports.append(report)
    
    try:
        db.add_all(reports)
        db.commit()
        print(f"✅ {len(reports)} rapports de démonstration créés avec succès.")
    except Exception as e:
        print(f"❌ Erreur lors du seeding: {str(e)}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_demo_data()
