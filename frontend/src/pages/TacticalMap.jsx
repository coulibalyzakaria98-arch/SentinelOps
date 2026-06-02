import React, { useState } from 'react';
import { CrisisMap } from '../components/command/CrisisMap';
import FilterBar from '../components/command/FilterBar';
import { Shield, Layers, Crosshair } from 'lucide-react';

const TacticalMapPage = () => {
  const [filters, setFilters] = useState({ type: 'all' });

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col gap-4 animate-fade-in">
      {/* Mini Header Tactique */}
      <div className="glass-panel p-4 rounded-2xl flex items-center justify-between border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600/20 text-blue-400 rounded-lg">
            <Layers size={18} />
          </div>
          <div>
            <h2 className="text-sm font-black text-white uppercase tracking-widest">Vue Terrain</h2>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">Conscience Situationnelle Active</p>
          </div>
        </div>
        
        <FilterBar filters={filters} onChange={setFilters} />
      </div>

      {/* Carte Plein Écran */}
      <div className="flex-1 glass-panel rounded-3xl overflow-hidden border-white/10 relative shadow-2xl">
        <CrisisMap filters={filters} />
        
        {/* Overlays spécifiques Terrain */}
        <div className="absolute top-4 left-4 z-[1000] pointer-events-none space-y-2">
           <div className="glass-panel px-3 py-1.5 rounded-xl border-blue-500/30 flex items-center gap-2">
              <Shield className="w-3 h-3 text-blue-400" />
              <span className="text-[8px] font-black text-white uppercase tracking-widest leading-none">Canal de Liaison Alpha</span>
           </div>
        </div>

        <button 
          className="absolute bottom-6 right-6 z-[1000] p-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl shadow-xl shadow-blue-600/30 transition-all active:scale-95"
          onClick={() => window.location.reload()} // Placeholder pour recentrer
        >
          <Crosshair size={24} />
        </button>
      </div>
    </div>
  );
};

export default TacticalMapPage;
