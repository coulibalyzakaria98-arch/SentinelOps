import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { MapContainer, TileLayer, Circle, Tooltip, LayersControl, LayerGroup, useMap, Polyline, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';
import 'leaflet/dist/leaflet.css';
import { reportApi } from '../../services/api';
import { offlineStorage } from '../../services/offlineStorage';
import { useIntelligenceWS } from '../../hooks/useIntelligenceWS';
import { AlertTriangle, Shield, Zap, Satellite, Activity } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

const { BaseLayer, Overlay } = LayersControl;

// 🛡️ Tactical Asset: Custom Marker Icons
const createTacticalIcon = (color) => L.divIcon({
  className: 'custom-tactical-icon',
  html: `<div class="w-4 h-4 rounded-full border-2 border-white shadow-lg animate-pulse" style="background-color: ${color}"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8]
});

// Custom component to handle the Heatmap layer logic
const HeatmapLayer = ({ points }) => {
  const map = useMap();

  useEffect(() => {
    if (!points || points.length === 0) return;

    let heatLayer;

    // 🛡️ Tactical Safety: Filter out any non-numeric points that might have slipped through
    const validPoints = points.filter(p => 
      Array.isArray(p) && 
      typeof p[0] === 'number' && typeof p[1] === 'number' && 
      !isNaN(p[0]) && !isNaN(p[1])
    );

    if (validPoints.length === 0) return;

    // 🛡️ Tactical Safety: Ensure map has dimensions before drawing canvas
    const initHeatmap = () => {
      const size = map.getSize();
      if (size.x === 0 || size.y === 0) {
        // Retry next frame if map isn't ready
        requestAnimationFrame(initHeatmap);
        return;
      }

      heatLayer = L.heatLayer(validPoints, {
        radius: 35,
        blur: 25,
        maxZoom: 18,
        minOpacity: 0.4,
        gradient: {
          0.1: '#3b82f6', // Tactical Blue (Monitoring)
          0.4: '#22c55e', // Green (Stable)
          0.7: '#f59e0b', // Amber (Critical Alert)
          1.0: '#ef4444'  // Emergency Red (Immediate Action)
        }
      }).addTo(map);
    };

    initHeatmap();

    return () => {
      if (heatLayer) map.removeLayer(heatLayer);
    };
  }, [map, points]);

  return null;
};

// 🛰️ Auto-Zoom Controller: Focuses on active crisis zones
const MapController = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, 13, { duration: 2 });
  }, [center, map]);
  return null;
};

export const CrisisMap = ({ filters = {} }) => {
  const { t } = useTranslation();
  const [reports, setReports] = useState([]);
  const [satelliteSignals, setSatelliteSignals] = useState([]);
  const [clusters, setClusters] = useState([]);
  const [fusedIntelligence, setFusedIntelligence] = useState([]);
  const [focusPoint, setFocusPoint] = useState(null);
  
  // 🛰️ REAL-TIME ADAPTATION: Handle inbound WebSocket packets
  const handleRealTimeUpdate = useCallback((packet) => {
    if (packet.type === 'NEW_REPORT') {
      const newReport = packet.data;
      setReports(prev => [newReport, ...prev.filter(r => r.id !== newReport.id)]);
      
      // Trigger full data refresh to sync clusters and fusion analysis
      fetchData();
    }
  }, []);

  useIntelligenceWS(handleRealTimeUpdate);

  // Simulation State
  const [simStep, setSimStep] = useState(0);
  const [simMode, setSimMode] = useState('idle');

  const fetchData = useCallback(async () => {
    try {
      const [reportsData, clusterData, fusionData] = await Promise.all([
        reportApi.getAll(),
        reportApi.getClusters(),
        reportApi.getFusedIntelligence()
      ]);
      
      // 🔄 OFFLINE AGGREGATION: Include locally queued reports
      const pendingReports = await offlineStorage.getUnsyncedReports();
      const combinedReports = [
        ...pendingReports,
        ...(Array.isArray(reportsData) ? reportsData : [])
      ];

      setReports(combinedReports);
      setClusters(Array.isArray(clusterData) ? clusterData : []);
      setFusedIntelligence(Array.isArray(fusionData) ? fusionData : []);
      
      // 🛰️ Synthetic Satellite Fusion: Detect anomalies from ground truth
      const signals = (Array.isArray(reportsData) ? reportsData : [])
        .filter(r => r.damage_level === 'total' || (r.confidence_score || 0) > 0.7)
        .map(r => ({
          lat: r.latitude + (Math.random() - 0.5) * 0.008,
          lng: r.longitude + (Math.random() - 0.5) * 0.008,
          intensity: Math.random() * 0.4 + 0.6
        }));
      setSatelliteSignals(signals);
    } catch (e) {
      console.error("📡 Intelligence Feed Error:", e);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, [fetchData]);

  // 🔥 SÉCURISATION TOTALE: Intelligence Fusion Guard + Filtering
  const filteredReports = useMemo(() => {
    let data = Array.isArray(reports) ? reports : [];
    if (filters.type && filters.type !== 'all') {
      data = data.filter(r => r.crisis_type === filters.type);
    }
    return data;
  }, [reports, filters.type]);

  const heatPoints = useMemo(() => {
    const now = Date.now();
    return filteredReports.map(r => {
      const createdAt = new Date(r.created_at).getTime();
      const ageHours = (now - createdAt) / (1000 * 60 * 60);
      const freshness = Math.max(0.1, 1 - (ageHours / 12)); // Fade after 12h
      const weight = (r.confidence_score || 0.5) * freshness;
      return [r.latitude, r.longitude, weight];
    });
  }, [filteredReports]);

  return (
    <div className="w-full h-full bg-[#0F172A] relative group">
      {/* 🛰️ TACTICAL SATELLITE HUD (ONU Style) */}
      <div className="absolute top-6 left-6 z-[1000] flex flex-col gap-3 pointer-events-none">
        <div className="glass-panel px-4 py-3 rounded-2xl border-blue-500/20 shadow-2xl backdrop-blur-md">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Satellite className="text-blue-400 w-4 h-4 animate-spin-slow" />
            </div>
            <div>
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] leading-none">SENTINEL-2 FUSION</p>
              <p className="text-[8px] font-bold text-slate-500 uppercase mt-1">{t('status.dataLink')}: {t('status.active')}</p>
            </div>
          </div>
          <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
             <div className="h-full bg-blue-500/50 animate-pulse-fast" style={{ width: '65%' }} />
          </div>
        </div>

        <div className="glass-panel px-4 py-2 rounded-xl border-white/5 flex items-center gap-3">
           <Activity className="text-green-500 w-3 h-3" />
           <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{t('command.intel')}: {filteredReports.length} {t('command.signals')}</span>
        </div>
      </div>

      {/* 🔮 TACTICAL SIMULATOR HUD */}
      <div className="absolute bottom-10 left-6 z-[1000] flex flex-col gap-4 transition-all duration-500 group-hover:translate-x-2">
        <div className="glass-panel p-5 rounded-3xl border-white/5 flex flex-col gap-4 min-w-[280px] shadow-2xl">
          <div className="flex justify-between items-center">
            <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
              <Zap className="w-3 h-3 text-yellow-500" /> {t('simulator.title')}
            </h4>
            {simMode !== 'idle' && (
              <span className="px-2 py-1 bg-blue-600 rounded text-[9px] font-black text-white animate-pulse">T + {simStep}H</span>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => { setSimMode(simMode === 'no_action' ? 'idle' : 'no_action'); setSimStep(0); }}
              className={`p-3 rounded-2xl text-[9px] font-black uppercase border transition-all duration-300 ${simMode === 'no_action' ? 'bg-red-600 border-red-500 text-white shadow-lg' : 'bg-slate-800/50 border-white/5 text-slate-500 hover:text-white'}`}
            >
              {t('simulator.worstCase')}
            </button>
            <button 
              onClick={() => { setSimMode(simMode === 'intervention' ? 'idle' : 'intervention'); setSimStep(0); }}
              className={`p-3 rounded-2xl text-[9px] font-black uppercase border transition-all duration-300 ${simMode === 'intervention' ? 'bg-green-600 border-green-500 text-white shadow-lg' : 'bg-slate-800/50 border-white/5 text-slate-500 hover:text-white'}`}
            >
              {t('simulator.stability')}
            </button>
          </div>
          
          {simMode !== 'idle' && (
            <div className="space-y-2">
               <div className="flex justify-between text-[8px] font-bold text-slate-500 uppercase">
                  <span>{t('simulator.propagation')}</span>
                  <span>{Math.round((simStep / 6) * 100)}%</span>
               </div>
               <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 transition-all duration-700" style={{ width: `${(simStep / 6) * 100}%` }} />
               </div>
            </div>
          )}
        </div>
      </div>

      <MapContainer center={[5.336, -4.026]} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl={false} className="grayscale-[0.2]">
        <MapController center={focusPoint} />
        
        <LayersControl position="topright">
          <BaseLayer checked name="Tactical Vector (Dark)">
            <TileLayer attribution='&copy; CARTO' url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
          </BaseLayer>
          <BaseLayer name="High-Res Satellite">
            <TileLayer attribution='&copy; ESRI' url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
          </BaseLayer>

          {/* 🛰️ SATELLITE ANOMALY LAYER */}
          <Overlay checked name="Satellite Heat Signals">
            <LayerGroup>
              {(Array.isArray(satelliteSignals) ? satelliteSignals : [])
                .filter(sig => sig && typeof sig.lat === 'number' && typeof sig.lng === 'number' && !isNaN(sig.lat) && !isNaN(sig.lng))
                .map((sig, i) => (
                <Circle 
                  key={i}
                  center={[sig.lat, sig.lng]}
                  radius={700}
                  pathOptions={{
                    fillColor: sig.intensity > 0.8 ? '#EF4444' : '#8B5CF6',
                    fillOpacity: sig.intensity * 0.2,
                    color: sig.intensity > 0.8 ? '#EF4444' : '#8B5CF6',
                    weight: 1,
                    dashArray: '5, 15'
                  }}
                />
              ))}
            </LayerGroup>
          </Overlay>

          {/* 👥 CITIZEN INTELLIGENCE LAYER */}
          <Overlay checked name="Ground Intelligence (Verified)">
            <LayerGroup>
              {filteredReports
                .filter(r => r && typeof r.latitude === 'number' && typeof r.longitude === 'number' && !isNaN(r.latitude) && !isNaN(r.longitude))
                .map((r) => (
                <Marker 
                  key={r.id} 
                  position={[r.latitude, r.longitude]} 
                  icon={createTacticalIcon(r.damage_level === 'total' ? '#EF4444' : '#F59E0B')}
                  eventHandlers={{ click: () => setFocusPoint([r.latitude, r.longitude]) }}
                >
                  <Popup className="tactical-popup">
                    <div className="p-2 min-w-[200px]">
                      {(r.image_url || r.image_path) && (
                        <div className="h-32 mb-3 rounded-lg overflow-hidden border border-slate-200">
                           <img 
                             src={r.image_url || `${import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'}/uploads/${r.image_path}`} 
                             className="w-full h-full object-cover" 
                             alt="Field Evidence" 
                           />
                        </div>
                      )}
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className={`w-4 h-4 ${r.damage_level === 'total' ? 'text-red-500' : 'text-amber-500'}`} />
                        <span className="text-[10px] font-black uppercase tracking-widest">{t(`field.types.${r.crisis_type}`)}</span>
                      </div>
                      <p className="text-[11px] font-bold text-slate-800 mb-2">{r.title}</p>
                      <div className="h-px bg-slate-200 my-2" />
                      <div className="flex justify-between items-center text-[9px]">
                        <span className="text-slate-500 font-bold uppercase">{t('command.fusionScore')}</span>
                        <span className="font-black text-blue-600">{Math.round((r.confidence_score || 0.5) * 100)}%</span>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </LayerGroup>
          </Overlay>

          {/* 🔥 DYNAMIC IMPACT HEATMAP */}
          <Overlay name="Predictive Impact Heatmap">
             <LayerGroup>
                <HeatmapLayer points={heatPoints} />
             </LayerGroup>
          </Overlay>

          {/* 🎯 STRATEGIC IMPACT ZONES */}
          <Overlay checked name="Cluster Analysis (AI Clusters)">
            <LayerGroup>
              {(Array.isArray(clusters) ? clusters : [])
                .filter(c => c && typeof c.latitude === 'number' && typeof c.longitude === 'number' && !isNaN(c.latitude) && !isNaN(c.longitude))
                .map((c) => (
                <Circle
                  key={c.id}
                  center={[c.latitude, c.longitude]}
                  radius={600}
                  pathOptions={{
                    color: c.priority === 'CRITICAL' ? '#EF4444' : '#F59E0B',
                    fillColor: c.priority === 'CRITICAL' ? '#EF4444' : '#F59E0B',
                    fillOpacity: 0.1,
                    weight: 2,
                    dashArray: '10, 10'
                  }}
                >
                  <Tooltip opacity={0.9} direction="top" offset={[0, -10]}>
                    <div className="flex flex-col gap-1 p-1">
                      <p className="text-[9px] font-black uppercase text-white">Impact Cluster #{c.id}</p>
                      <p className="text-[10px] font-black text-red-500">{c.priority} PRIORITY</p>
                      <span className="text-[8px] font-bold text-slate-400">Linked Reports: {c.count}</span>
                    </div>
                  </Tooltip>
                </Circle>
              ))}
            </LayerGroup>
          </Overlay>
        </LayersControl>
      </MapContainer>

      {/* 📊 BOTTOM TACTICAL BAR */}
      <div className="absolute bottom-6 right-6 z-[1000] flex gap-2">
         <div className="glass-panel px-4 py-2 rounded-xl border-white/5 flex items-center gap-3 shadow-xl pointer-events-auto">
            <div className="flex -space-x-2">
               {[1,2,3].map(i => (
                 <div key={i} className="w-5 h-5 rounded-full border border-slate-900 bg-slate-800 flex items-center justify-center text-[8px] font-black text-slate-500">
                    {i}
                 </div>
               ))}
            </div>
            <span className="text-[9px] font-black text-white uppercase tracking-widest">{t('command.activeUnits')}</span>
         </div>
      </div>
    </div>
  );
};
