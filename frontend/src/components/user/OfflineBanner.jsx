import React from 'react';
import { WifiOff, ShieldAlert } from 'lucide-react';

const OfflineBanner = () => {
  return (
    <div className="bg-red-950/60 backdrop-blur-2xl border-b border-red-500/30 px-6 py-4 flex items-center justify-between animate-in slide-in-from-top duration-500">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
          <WifiOff size={20} />
        </div>
        <div>
          <h4 className="text-sm font-black uppercase tracking-widest text-red-200">Mode Résilience Terrain Actif</h4>
          <p className="text-[10px] font-bold text-red-300/60 uppercase tracking-tighter mt-0.5 italic">Obstruction Réseau Détectée • Intelligence stockée localement (AES-256)</p>
        </div>
      </div>
      
      <div className="hidden sm:flex items-center gap-2 bg-red-500/10 px-3 py-1.5 rounded-lg border border-red-500/20">
         <ShieldAlert size={14} className="text-red-500" />
         <span className="text-[9px] font-black text-red-100 uppercase tracking-widest leading-none">Protocole de Sécurité: OK</span>
      </div>
    </div>
  );
};

export default OfflineBanner;
