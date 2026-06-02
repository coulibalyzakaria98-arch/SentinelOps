# 🔧 SENTINELOPS - TROUBLESHOOTING GUIDE

## Common Issues & Solutions

### 1. React "Invalid hook call / Dispatcher is null"

**Symptom**: Black screen, console error about hooks

**Cause**: 
- Double React import
- React not imported properly
- JSX transform misconfigured

**Solution**:
```javascript
// ❌ OLD (causes error)
import React, { useState } from 'react';

// ✅ NEW (React 18+ JSX transform)
import { useState } from 'react';
```

**Verify**:
```bash
# Check vite.config.js has @vitejs/plugin-react
# Check no "import React from 'react'" in App.jsx
grep -r "import React," src/
```

---

### 2. API Returns HTTP 500 on /api/v1/reports

**Symptom**: 
```json
{"detail": "Internal server error"}
```

**Causes**:
- Database connection failed
- PostGIS geometry extraction error
- Missing dependencies

**Solutions**:

**Check database:**
```bash
docker-compose exec db psql -U postgres -d sentinelops -c "SELECT COUNT(*) FROM reports"
```

**Check backend logs:**
```bash
docker-compose logs backend | tail -20
```

**Verify PostGIS is installed:**
```bash
docker-compose exec db psql -U postgres -d sentinelops -c "SELECT PostGIS_version();"
```

**Restart backend:**
```bash
docker-compose restart backend
```

---

### 3. Nginx Returns 502 Bad Gateway

**Symptom**:
```
502 Bad Gateway
nginx/1.21.6
```

**Causes**:
- Backend not running
- Backend port mismatch
- Nginx config error

**Solutions**:

**Verify services:**
```bash
docker-compose ps
# Should show: backend, frontend, nginx, db, redis all "Up"
```

**Check nginx logs:**
```bash
docker-compose logs nginx | tail -10
```

**Test backend directly:**
```bash
docker-compose exec backend curl http://localhost:8000/api/v1/health
```

**Restart nginx:**
```bash
docker-compose restart nginx
```

---

### 4. Frontend Shows Blank/Black Screen

**Symptom**:
- URL loads but blank
- No console errors initially
- Page stays black

**Solutions**:

**Step 1: Clear browser cache**
```
DevTools → Application → Storage → Clear Site Data
```

**Step 2: Check Service Worker**
```
DevTools → Application → Service Workers → Unregister all
Refresh page
```

**Step 3: Check frontend logs**
```bash
docker-compose logs frontend
```

**Step 4: Verify React loads**
```bash
curl http://localhost:8080 | grep -i "root"
```

**Step 5: Check console errors**
```
F12 → Console → Check for red errors
```

---

### 5. Service Worker "Failed to fetch"

**Symptom**:
```
❌ Service Worker Deployment Failure
TypeError: Failed to fetch
```

**Causes**:
- Service Worker not served correctly
- CORS issue
- 404 on sw.js

**Solutions**:

**Verify sw.js is served:**
```bash
curl http://localhost:8080/sw.js
# Should return JavaScript, not 404
```

**Check service worker registration:**
```javascript
// DevTools → Console
navigator.serviceWorker.getRegistrations().then(regs => 
  console.log(regs)
)
```

**Clear and re-register:**
```javascript
navigator.serviceWorker.getRegistrations().then(regs => {
  regs.forEach(r => r.unregister());
});
// Then refresh page
```

---

### 6. Dexie "Schema was extended" Error

**Symptom**:
```
QuotaExceededError: (DOM Exception -22)
DOMException: "QuotaExceededError"
Or error in console about schema
```

**Cause**:
- IndexedDB database structure changed
- Dexie version mismatch
- Corrupted IndexedDB data

**Solutions**:

**Delete IndexedDB:**
```javascript
// DevTools → Console
indexedDB.deleteDatabase('SentinelOpsDB');
// Then refresh
```

**Or manually:**
```
DevTools → Application → IndexedDB → SentinelOpsDB (right-click) → Delete
```

**Verify:**
```javascript
// DevTools → Console
db.tables.map(t => t.name)  // Should show: ['reports', 'syncQueue']
```

---

### 7. API 500 After Report Submit

**Symptom**:
- Report submit → 500 error
- "Report Secured" message doesn't appear

**Causes**:
- Geometry creation failed
- Image upload failed
- Database constraint violation

**Solutions**:

**Check backend logs:**
```bash
docker-compose logs backend --tail 50
```

**Try simpler report:**
```bash
curl -X POST http://localhost:8080/api/v1/reports \
  -F "damage_level=partial" \
  -F "infrastructure_type=residential" \
  -F "crisis_type=flood" \
  -F "latitude=40.7" \
  -F "longitude=-74.0"
```

**Verify database:**
```bash
docker-compose exec db psql -U postgres -d sentinelops -c "SELECT * FROM reports LIMIT 1;"
```

---

### 8. Offline Mode Not Working

**Symptom**:
- Submit report offline → doesn't queue
- "Stored in Local Queue" not showing

**Causes**:
- Service Worker not registered
- IndexedDB disabled
- Offline storage not initialized

**Solutions**:

**Check Service Worker:**
```javascript
// DevTools → Console
navigator.serviceWorker.controller ? 'Active' : 'Not active'
```

**Check IndexedDB:**
```javascript
// DevTools → Console
await db.table('reports').count()  // Should show count
```

**Check Dexie:**
```javascript
// DevTools → Console
import('dexie').then(({Dexie}) => console.log('OK'))
```

**Enable offline test:**
```
DevTools → Network → Offline
Submit report
DevTools → Network → Online (auto-restore)
Check if report appears in dashboard
```

---

### 9. Database Connection Error

**Symptom**:
```
could not connect to server: Connection refused
```

**Causes**:
- PostgreSQL not running
- Wrong DATABASE_URL
- Port 5432 not accessible

**Solutions**:

**Verify container running:**
```bash
docker-compose ps db
# Should show "Up"
```

**Check .env DATABASE_URL:**
```bash
grep DATABASE_URL .env
# Should be: postgresql://postgres:postgres@db:5432/sentinelops
```

**Test connection:**
```bash
docker-compose exec db psql -U postgres -c "SELECT 1"
```

**View logs:**
```bash
docker-compose logs db
```

---

### 10. Redis Connection Error

**Symptom**:
```
ConnectionError: Error 111 connecting to redis
```

**Causes**:
- Redis not running
- Wrong REDIS_URL
- Network issue

**Solutions**:

**Verify Redis running:**
```bash
docker-compose ps redis
```

**Test connection:**
```bash
docker-compose exec redis redis-cli PING
# Should return: PONG
```

**Check .env:**
```bash
grep REDIS_URL .env
# Should be: redis://redis:6379/0
```

---

### 11. Port Already in Use

**Symptom**:
```
Error: listen EADDRINUSE :::8080
```

**Cause**:
- Port 8080 already in use

**Solutions**:

**Find what's using port:**
```bash
netstat -ano | findstr :8080
# Windows

lsof -i :8080
# Mac/Linux
```

**Kill the process:**
```bash
taskkill /PID <PID> /F
# Windows

kill -9 <PID>
# Mac/Linux
```

**Or change docker-compose.yml:**
```yaml
nginx:
  ports:
    - "8081:80"  # Change 8080 to 8081
```

---

### 12. Docker Images Not Building

**Symptom**:
```
ERROR: failed to solve with frontend dockerfile.v0
```

**Causes**:
- Dockerfile syntax error
- Missing files
- Build context issue

**Solutions**:

**Check Docker logs:**
```bash
docker-compose build --no-cache
# Shows more detail
```

**Verify Dockerfile:**
```bash
# Check frontend/Dockerfile exists
ls frontend/Dockerfile
ls backend/Dockerfile
```

**Clean and rebuild:**
```bash
docker-compose down
docker system prune -a -f
docker-compose build
```

---

### 13. Slow API Response (>5s)

**Symptom**:
- API requests take 5+ seconds
- Dashboard loading slowly

**Causes**:
- Database query too complex
- PostGIS operations expensive
- No indexes

**Solutions**:

**Add database indexes:**
```bash
docker-compose exec db psql -U postgres -d sentinelops << EOF
CREATE INDEX idx_reports_location ON reports USING GIST(location);
CREATE INDEX idx_reports_created_at ON reports(created_at DESC);
EOF
```

**Check slow queries:**
```bash
# Enable query logging in postgresql.conf
docker-compose exec db psql -U postgres -d sentinelops -c "EXPLAIN (ANALYZE) SELECT * FROM reports LIMIT 10;"
```

**Check Redis cache:**
```bash
docker-compose exec redis redis-cli KEYS "*"
```

---

### 14. HTTPS Certificate Errors

**Symptom**:
```
NET::ERR_CERT_COMMON_NAME_INVALID
```

**Cause**:
- HTTPS not configured
- Self-signed cert issue

**Solutions**:

**For development:**
```
Just use http://localhost:8080
```

**For production:**
```nginx
# nginx/default.conf
server {
    listen 443 ssl;
    ssl_certificate /etc/ssl/cert.pem;
    ssl_certificate_key /etc/ssl/key.pem;
    ...
}
```

---

### 15. Memory/Performance Issues

**Symptom**:
- Services stop suddenly
- Docker container killed
- Browser becomes unresponsive

**Cause**:
- Low memory
- Memory leak
- Too many reports

**Solutions**:

**Check container stats:**
```bash
docker stats
```

**Increase memory limit in docker-compose.yml:**
```yaml
services:
  backend:
    mem_limit: 1g  # Add this
```

**Restart Docker:**
```bash
docker-compose restart
```

**Clear old reports:**
```bash
docker-compose exec db psql -U postgres -d sentinelops -c "DELETE FROM reports WHERE created_at < NOW() - INTERVAL '7 days';"
```

---

## 🆘 EMERGENCY PROCEDURES

### Full Reset
```bash
# Stop everything
docker-compose down

# Remove volumes (WARNING: deletes all data)
docker volume prune -f

# Restart fresh
docker-compose up -d
```

### Recover from Corruption
```bash
# Remove specific corrupted service
docker-compose down db
docker volume rm sentinelops_postgres_data
docker-compose up -d db

# Reinitialize schema
docker-compose exec db psql -U postgres -d sentinelops < database/init.sql
```

### Get All Logs
```bash
# Save full logs to file
docker-compose logs > debug-logs.txt

# Check specific service
docker-compose logs -f backend --tail 100
```

---

## 📞 WHEN NOTHING WORKS

1. **Gather information**:
   ```bash
   docker-compose ps > status.txt
   docker-compose logs > logs.txt
   docker stats > stats.txt
   ```

2. **Nuclear option**:
   ```bash
   docker-compose down -v
   docker system prune -a -f
   docker-compose up -d --build
   ```

3. **Check disk space**:
   ```bash
   df -h
   docker system df
   ```

4. **Check Docker daemon**:
   ```bash
   docker info
   docker ps
   ```

---

**Last Updated**: April 21, 2026  
**Covers**: v1.1.0  
**Status**: ✅ Comprehensive Guide
