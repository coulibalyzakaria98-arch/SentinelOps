import React, { useState, useEffect } from 'react';
import KPICard from '../components/common/KPICard';
import { useAuth } from '../contexts/AuthContext';
import { useOffline } from '../contexts/OfflineContext';
import { CrisisMap } from '../components/command/CrisisMap';
import FilterBar from '../components/command/FilterBar';
import AlertPanel from '../components/command/AlertPanel';
import LiveFeed from '../components/command/LiveFeed';
import IntelligencePanel from '../components/command/IntelligencePanel';
import {
  Shield,
  AlertTriangle,
  Users,
  Activity,
  BarChart3,
  BrainCircuit,
} from 'lucide-react';

const CommandCenter = () => {
  const { isOnline } = useOffline();
  const [filters, setFilters] = useState({ type: 'all' });
  const [activeIncidents, setActiveIncidents] = useState(14);
  const [deployedUnits, setDeployedUnits] = useState(14);
  const [groundIntel, setGroundIntel] = useState(47);
  const [fusionScore] = useState(88);

  const statusBadge = isOnline ? 'En direct' : 'Hors ligne';

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIncidents(prev => Math.max(0, prev + (Math.random() > 0.7 ? 1 : Math.random() > 0.8 ? -1 : 0)));
      setGroundIntel(prev => Math.max(0, prev + (Math.random() > 0.6 ? 2 : -1)));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* 🚀 OPERATIONAL SUMMARY GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Renseignements au sol"
          value={groundIntel.toString()}
          subtitle="Signaux actifs"
          icon={<Activity size={20} />}
          color="blue"
        />
        <KPICard
          title="Unités actives"
          value={deployedUnits.toString()}
          subtitle="Sur le terrain"
          icon={<Users size={20} />}
          color="emerald"
        />
        <KPICard
          title="Incidents Critiques"
          value={activeIncidents.toString()}
          subtitle="En cours"
          icon={<AlertTriangle size={20} />}
          color="red"
        />
        <KPICard
          title="Score de fusion"
          value={`${fusionScore}%`}
          subtitle="Global"
          icon={<BarChart3 size={20} />}
          color="accent"
        />
      </div>

      {/* 🗺 TACTICAL AREA: MAP + SIDEBAR */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 min-h-[700px]">
        
        {/* LEFT: MAP PANEL */}
        <div className="flex flex-col gap-6">
          <div className="glass-panel rounded-3xl border border-white/10 bg-[#07101F]/80 p-5 shadow-xl backdrop-blur-xl shrink-0">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.35em] text-slate-500 font-black">Filtres tactiques</p>
                <h2 className="mt-1 text-xl font-black text-white uppercase tracking-tighter">Secteur Opérationnel</h2>
              </div>
            </div>
            <div className="mt-4">
              <FilterBar filters={filters} onChange={setFilters} />
            </div>
          </div>

          <div className="glass-panel relative flex-1 min-h-[500px] overflow-hidden rounded-[2rem] border border-white/10 bg-[#07101F]/80 shadow-2xl">
            <CrisisMap filters={filters} />
            {/* Map UI Overlays */}
            <div className="absolute top-4 left-4 z-[1000] glass-panel px-3 py-1.5 rounded-xl border-blue-500/20 pointer-events-none">
              <div className="flex items-center gap-2">
                <Shield className="w-3 h-3 text-blue-400" />
                <span className="text-[9px] font-black text-white uppercase tracking-widest italic leading-none">Grid CI-ABJ / OPS-COORD-3</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: INTELLIGENCE & ALERTS */}
        <div className="flex flex-col gap-6">
          <IntelligencePanel fusionScore={fusionScore} />

          {/* Alert Panel (Quick View) */}
          <div className="glass-panel rounded-[2rem] border border-white/10 bg-[#07101F]/90 p-6 shadow-xl backdrop-blur-xl flex flex-col max-h-[400px]">
            <div className="flex items-center gap-3 mb-4">
              <div className="rounded-2xl bg-red-500/10 p-2.5 text-red-400 flex-shrink-0">
                <AlertTriangle size={20} />
              </div>
              <div className="flex-1">
                <p className="text-[10px] uppercase tracking-[0.35em] text-slate-500 font-black">Flux d'Urgences</p>
                <h3 className="mt-0.5 text-lg font-black text-white uppercase tracking-tighter">Alertes</h3>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
              <AlertPanel />
            </div>
          </div>
        </div>
      </div>

      {/* 📊 LIVE FEED SECTION */}
      <div className="glass-panel rounded-[2rem] border border-white/10 bg-[#07101F]/90 p-6 shadow-xl backdrop-blur-xl">
        <div className="flex items-center justify-between mb-6 px-2">
          <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            Lien Tactique en Direct
          </h3>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{statusBadge}</span>
        </div>
        <div className="h-[250px] overflow-y-auto custom-scrollbar">
          <LiveFeed />
        </div>
      </div>

      {/* 📊 SYSTEM METRICS SECTION */}
      <div className="glass-panel rounded-[2rem] border border-white/10 bg-[#07101F]/90 p-6 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-slate-500 font-black">Système Sentinel-2</p>
            <h3 className="mt-1 text-xl font-black text-white uppercase tracking-tighter">Métriques d'opération</h3>
          </div>
          <div className="rounded-2xl bg-slate-950/50 px-4 py-2 border border-white/5">
             <span className="text-[10px] uppercase tracking-[0.3em] text-emerald-400 font-black">Disponibilité +99.98%</span>
          </div>
        </div>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4 hover:bg-slate-950/60 transition-colors">
            <p className="text-[10px] uppercase tracking-[0.35em] text-slate-500 font-bold mb-1">Latence Liaison</p>
            <p className="text-2xl font-black text-blue-400 tracking-tighter">42 <span className="text-xs uppercase ml-1">ms</span></p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4 hover:bg-slate-950/60 transition-colors">
            <p className="text-[10px] uppercase tracking-[0.35em] text-slate-500 font-bold mb-1">Capacité Calcul</p>
            <p className="text-2xl font-black text-white tracking-tighter">78 <span className="text-xs uppercase ml-1">%</span></p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4 hover:bg-slate-950/60 transition-colors">
            <p className="text-[10px] uppercase tracking-[0.35em] text-slate-500 font-bold mb-1">Flux de Données</p>
            <p className="text-2xl font-black text-emerald-400 tracking-tighter">Nominal</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandCenter;
