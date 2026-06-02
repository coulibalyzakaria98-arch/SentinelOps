import React, { useState } from 'react';
import StatusBar from '../components/common/StatusBar';
import TrendChart from '../components/analytics/TrendChart';
import HeatmapOverlay from '../components/analytics/HeatmapOverlay';
import ExportPanel from '../components/analytics/ExportPanel';
import Header from '../components/Header';
import { BarChart3, TrendingUp, Globe, FileDown, Search } from 'lucide-react';

const AnalyticsDashboard = () => {
  const [timeRange, setTimeRange] = useState('7d');

  return (
    <div className="min-h-screen bg-[#0A0F2A] flex flex-col font-sans overflow-y-auto pb-20">
      <Header />

      {/* SUB-HEADER: ANALYTICS CONTROLS */}
      <div className="px-8 py-6 border-b border-white/5 bg-slate-950/40 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h2 className="text-3xl font-black uppercase tracking-tighter text-white flex items-center gap-3">
              <BarChart3 size={28} className="text-blue-500" /> Intelligence Analytique
           </h2>
           <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mt-1">Analyse Post-Crise • Tendances Globale • Prévisions IA</p>
        </div>

        <div className="flex items-center gap-3 p-1.5 bg-slate-900 rounded-2xl border border-white/5 shadow-inner">
          {[
            { id: '24h', label: '24 Heures' },
            { id: '7d', label: '7 Jours' },
            { id: '30d', label: '30 Jours' },
            { id: '1y', label: '1 An' }
          ].map((range) => (
            <button
              key={range.id}
              onClick={() => setTimeRange(range.id)}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                timeRange === range.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      <main className="p-8 max-w-[1600px] mx-auto w-full grid grid-cols-1 xl:grid-cols-3 gap-8 relative z-10">
        
        {/* LEFT & CENTER: DATA VISUALS */}
        <div className="xl:col-span-2 space-y-8">
           
           {/* TRENDS CHART */}
           <div className="glass-panel p-8 rounded-[2.5rem] border-white/5 bg-[#1E293B]/30 shadow-2xl">
              <div className="flex items-center justify-between mb-8">
                 <div className="flex items-center gap-3">
                    <TrendingUp size={20} className="text-blue-500" />
                    <h3 className="text-sm font-black uppercase tracking-widest text-white">Évolution des Signalements</h3>
                 </div>
                 <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 rounded-lg">
                    <span className="text-[9px] font-black text-green-500 uppercase">+12% vs période précédente</span>
                 </div>
              </div>
              <div className="h-80 w-full">
                 <TrendChart timeRange={timeRange} metric="reports" />
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* DAMAGE DISTRIBUTION */}
              <div className="glass-panel p-8 rounded-[2.5rem] border-white/5 bg-[#1E293B]/30">
                 <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-8">Répartition des Dégâts</h3>
                 <div className="h-64 flex items-center justify-center">
                    <TrendChart timeRange={timeRange} metric="damage" type="pie" />
                 </div>
              </div>

              {/* DENSITY MAP PREVIEW */}
              <div className="glass-panel p-8 rounded-[2.5rem] border-white/5 bg-[#1E293B]/30 overflow-hidden group">
                 <div className="flex items-center justify-between mb-6">
                    <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Densité Géospatiale</h3>
                    <Globe size={16} className="text-blue-500 group-hover:rotate-12 transition-transform" />
                 </div>
                 <HeatmapOverlay timeRange={timeRange} />
              </div>
           </div>
        </div>

        {/* RIGHT: EXPORT & TOOLS */}
        <div className="space-y-8">
           
           {/* SEARCH & FILTERS */}
           <div className="glass-panel p-8 rounded-[2.5rem] border-white/5 bg-[#1E293B]/30 shadow-xl">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                 <Search size={14} /> Filtres Avancés
              </h3>
              <div className="space-y-4">
                 <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5">
                    <p className="text-[9px] font-black text-slate-600 uppercase mb-2">Secteur Géographique</p>
                    <p className="text-xs font-bold text-white tracking-tight">Zone Abidjan Est (Toutes)</p>
                 </div>
                 <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 opacity-40">
                    <p className="text-[9px] font-black text-slate-600 uppercase mb-2">Filtrage Mots-Clés</p>
                    <p className="text-xs font-bold text-white tracking-tight italic">Option premium désactivée</p>
                 </div>
              </div>
           </div>

           {/* EXPORT OPTIONS */}
           <div className="glass-panel p-8 rounded-[2.5rem] border-blue-500/20 bg-blue-500/5 shadow-[0_20px_50px_rgba(31,119,210,0.1)]">
              <div className="flex items-center gap-3 mb-8">
                 <FileDown size={20} className="text-blue-500" />
                 <h3 className="text-sm font-black uppercase tracking-widest text-white">Export de Données</h3>
              </div>
              <ExportPanel />
           </div>

        </div>
      </main>
    </div>
  );
};

export default AnalyticsDashboard;
