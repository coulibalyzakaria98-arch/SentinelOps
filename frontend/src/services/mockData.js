export const MOCK_REPORTS = [
  { id: 1, title: "Effondrement Infrastructure Yamoussoukro", crisis_type: "INFRASTRUCTURE", damage_level: "total", latitude: 6.8276, longitude: -5.2893, confidence_score: 0.92, created_at: new Date().toISOString() },
  { id: 2, title: "Inondations Abidjan Sud", crisis_type: "INONDATION", damage_level: "high", latitude: 5.3599, longitude: -4.0083, confidence_score: 0.88, created_at: new Date().toISOString() },
  { id: 3, title: "Feu de brousse Bouaké Nord", crisis_type: "INCENDIE", damage_level: "high", latitude: 7.6908, longitude: -5.0330, confidence_score: 0.78, created_at: new Date().toISOString() },
  { id: 4, title: "Urgence Transport Daloa", crisis_type: "INFRASTRUCTURE", damage_level: "medium", latitude: 6.8774, longitude: -6.4506, confidence_score: 0.65, created_at: new Date().toISOString() },
  { id: 5, title: "Alerte San-Pédro Port", crisis_type: "INONDATION", damage_level: "medium", latitude: 4.7485, longitude: -6.6363, confidence_score: 0.72, created_at: new Date().toISOString() }
];

export const MOCK_STATS = {
  total_reports: 47,
  critical_count: 3,
  active_units: 14,
  fusion_score: 88
};

export const MOCK_CLUSTERS = [
  { id: "YAKRO-01", latitude: 6.8276, longitude: -5.2893, priority: "CRITICAL", count: 23, city: "Yamoussoukro" },
  { id: "ABJ-04", latitude: 5.3599, longitude: -4.0083, priority: "HIGH", count: 47, city: "Abidjan" },
  { id: "BKE-02", latitude: 7.6908, longitude: -5.0330, priority: "MEDIUM", count: 12, city: "Bouaké" },
  { id: "DLO-01", latitude: 6.8774, longitude: -6.4506, priority: "LOW", count: 5, city: "Daloa" },
  { id: "SPD-01", latitude: 4.7485, longitude: -6.6363, priority: "MEDIUM", count: 8, city: "San-Pédro" }
];

export const MOCK_INTELLIGENCE = {
  propagation_speed: "4.2 km/h",
  direction: "Nord-Est",
  risk_level: 78,
  advisor_summary: "ANALYSE : Rupture d'infrastructure majeure détectée en Secteur Alpha (Yamoussoukro). Déploiement prioritaire recommandé de l'unité mobile 04 pour sécuriser le périmètre de propagation (4.2km/h)."
};
