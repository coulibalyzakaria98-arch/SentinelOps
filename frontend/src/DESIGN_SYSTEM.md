# SentinelOps Ops Center — Design System

## Design tokens

Tailwind tokens are defined in `tailwind.config.js`:

- `primary`: #0B1C3D
- `panel`: #101F3D
- `surface`: #15274C
- `accent`: #2563EB
- `success`: #22C55E
- `warning`: #F59E0B
- `danger`: #EF4444
- `glass`: rgba(255,255,255,0.06)

## UI architecture

### Layout
- `components/layout/MainLayout.jsx`
- `components/layout/Topbar.jsx`
- `components/Sidebar.jsx`

### Core UI
- `components/ui/Card.jsx`
- `components/ui/Button.jsx`
- `components/ui/Input.jsx`
- `components/ui/Badge.jsx`
- `components/ui/Chip.jsx`
- `components/ui/Toast.jsx`
- `components/ui/Modal.jsx`
- `components/ui/LoaderSkeleton.jsx`

### Feature-level mapping
- `components/offline/OfflineBanner.jsx`
- `components/offline/SyncIndicator.jsx`
- `components/command/IncidentCard.jsx` (to add)
- `components/user/ReportForm.jsx`
- `components/command/CrisisMap.jsx`
- `components/analytics/TrendChart.jsx`
- `components/analytics/HeatmapOverlay.jsx`

## Recommended React structure

src/
 ├── components/
 │    ├── ui/
 │    ├── layout/
 │    ├── offline/
 │    ├── command/
 │    ├── analytics/
 │    ├── export/
 │    └── user/
 ├── contexts/
 │    ├── OfflineContext.jsx
 │    └── AuthContext.jsx
 ├── pages/
 │    ├── Login.jsx
 │    ├── UserDashboard.jsx
 │    ├── CommandDashboard.jsx
 │    └── AnalyticsDashboard.jsx
 ├── services/
 │    ├── offlineStorage.js
 │    ├── syncManager.js
 │    └── api.js
 └── hooks/

## Mapping example

### Home / role selection
- `pages/Login.jsx` can be extended to use `components/ui/Card.jsx`
- add role cards with `Card`, `Button`, `Badge`

### Field Agent
- Use `MainLayout` for the container
- `components/user/ReportForm.jsx` uses `Input`, `Button`, `Card`
- `components/offline/OfflineBanner.jsx` shows offline status
- `components/common/KPIcard.jsx` for metrics

### Command Center
- `components/command/CrisisMap.jsx` for map view
- `components/command/AlertPanel.jsx` for incident feed
- `components/command/FilterBar.jsx` uses `Chip`

### Intelligence Analyst
- `components/analytics/TrendChart.jsx` and `HeatmapOverlay.jsx`
- `components/analytics/ExportPanel.jsx` for PDF / CSV export

## Notes

- Keep `OfflineProvider` around the entire app in `src/App.jsx`
- Keep Dexie version increments strictly monotonic
- Use `clearAllData()` only as admin/reset, never on app startup
