# 🧪 SENTINELOPS - GUIDE DE TEST (5 MINUTES)

## 1️⃣ STARTUP RAPIDE

```bash
# Terminal 1: Démarrer Docker
cd "c:\Users\HP\Desktop\SentinelOps Map"
docker-compose up -d

# Attendre 15s pour que les services démarrent
# Vérifier les logs
docker-compose ps
```

## 2️⃣ VÉRIFICATIONS CRITIQUES

### ✅ TEST 1: React UI Sans Écran Noir
```
URL: http://localhost:8080
Attendu: Header bleu "SentinelOps Live" + Navigation
Status: 🟢 OK si visible
```

### ✅ TEST 2: API Endpoint /reports (200 OK)
```bash
curl -X GET http://localhost:8080/api/v1/reports
Attendu: JSON array ou []
Status: 🟢 OK si 200, 🔴 FAIL si 500
```

### ✅ TEST 3: Soumettre un Report
```bash
curl -X POST http://localhost:8080/api/v1/reports \
  -F "title=Test" \
  -F "description=Test report" \
  -F "damage_level=partial" \
  -F "infrastructure_type=residential" \
  -F "crisis_type=flood" \
  -F "latitude=40.7128" \
  -F "longitude=-74.0060"

Attendu: Report ID retourné
Status: 🟢 OK si 200/201
```

### ✅ TEST 4: Dashboard Affiche Stats
```
URL: http://localhost:8080
Click: "Tableau de Bord" tab
Attendu: KPI cards avec nombres
Status: 🟢 OK si 4 cards avec données
```

### ✅ TEST 5: Offline Mode
```
DevTools → Network → Offline
Soumettre un report
Attendu: "Stored in Local Queue" message
Reconnect (DevTools → Online)
Attendu: Sync automatique
Status: 🟢 OK si synced
```

### ✅ TEST 6: Nginx Health
```bash
curl http://localhost:8080/health
Attendu: "Service Nominal"
Status: 🟢 OK si 200
```

### ✅ TEST 7: Print Report
```
URL: http://localhost:8080
Click: "Dashboard" → "Générer Rapport Officiel (PDF)"
Attendu: Print dialog avec rapport formaté
Status: 🟢 OK si PDF généré
```

---

## 🐛 TROUBLESHOOTING RAPIDE

### Problème: Écran blanc / Black screen
```
Solution 1: Effacer cache browser
  DevTools → Application → Cache Storage → Delete all
  
Solution 2: Vérifier service worker
  DevTools → Application → Service Workers → Unregister
  Refresh page
  
Solution 3: Logs frontend
  docker-compose logs frontend
```

### Problème: API 500 Error
```
Vérifier logs backend:
  docker-compose logs backend
  
Vérifier DB connection:
  docker-compose exec db psql -U postgres -d sentinelops -c "SELECT COUNT(*) FROM reports"
  
Redémarrer backend:
  docker-compose restart backend
```

### Problème: Nginx 502 Bad Gateway
```
Vérifier services running:
  docker-compose ps
  
Vérifier logs nginx:
  docker-compose logs nginx
  
Redémarrer nginx:
  docker-compose restart nginx
```

### Problème: Dexie "Schema was extended"
```
DevTools → Application → IndexedDB → SentinelOpsDB → Delete database
Refresh page
```

---

## 📊 QUICK METRICS

| Composant | Endpoint | Timing | Status |
|-----------|----------|--------|--------|
| Frontend | http://localhost:8080 | <1s | ✅ |
| Backend | http://localhost:8080/api/v1/health | <100ms | ✅ |
| Reports GET | http://localhost:8080/api/v1/reports | <500ms | ✅ |
| Reports POST | http://localhost:8080/api/v1/reports | <1s | ✅ |
| Nginx | http://localhost:8080/health | <50ms | ✅ |

---

## 🎯 DEMO SCRIPT (2 minutes)

1. **Accueil**: "Voici SentinelOps - Plateforme d'Intelligence Humanitaire"
2. **Map**: "Visualisation des rapports critiques en temps réel"
3. **Report**: Cliquer "Transmit Intelligence" → Prendre photo → Select "Catastrophic" → Submit
4. **Dashboard**: Voir le nouveau report dans les KPIs
5. **Offline**: Disable network → Soumettre report → Enable network → Voir sync
6. **Print**: "Export PDF pour rapport officiel UNDP"

---

## ⚙️ LOGS KEY PATTERNS

### ✅ Bon (Backend)
```
INFO: Application startup complete
INFO: Uvicorn running on http://0.0.0.0:8000
```

### ✅ Bon (Frontend)
```
✅ Service Worker Protocol Active
📦 Service Worker: Installing cache
```

### ❌ Mauvais (Backend)
```
ERROR: could not connect to server
ERROR: relation "reports" does not exist
```

### ❌ Mauvais (Frontend)
```
❌ Service Worker Deployment Failure
Invalid hook call
```

---

## 📋 PRE-DEMO CHECKLIST

- [ ] `docker-compose up -d` runs without errors
- [ ] Frontend loads (no black screen)
- [ ] API /reports returns 200
- [ ] Can submit a report
- [ ] Dashboard shows stats
- [ ] Offline mode works
- [ ] Print report generates PDF
- [ ] No console errors (F12)

---

## 🚀 POST-DEMO

```bash
# Cleanup (if needed)
docker-compose down
docker volume prune -f

# Save logs (for analysis)
docker-compose logs > logs.txt
```

---

**Last Updated**: April 21, 2026  
**Estimated Runtime**: 5 minutes  
**Success Rate Target**: 100% ✅
