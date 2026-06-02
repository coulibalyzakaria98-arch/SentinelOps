import React from 'react';
import { 
  AlertCircle, 
  ArrowLeftRight, 
  Check, 
  Database, 
  Globe, 
  Save,
  X
} from 'lucide-react';

const ConflictResolver = ({ conflict, onResolve, onCancel }) => {
  if (!conflict) return null;

  const { local, remote } = conflict;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="glass-panel w-full max-w-4xl rounded-[2rem] overflow-hidden border border-amber-500/30">
        {/* HEADER */}
        <div className="bg-amber-600 px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-white/20">
              <ArrowLeftRight className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-widest text-white">Conflit de Synchronisation</h2>
              <p className="text-xs font-bold text-white/80 uppercase">Collision détectée pour le paquet #{local.uuid?.slice(0, 8)}</p>
            </div>
          </div>
          <button onClick={onCancel} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
            <X className="text-white" size={24} />
          </button>
        </div>

        {/* COMPARISON BODY */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* LOCAL VERSION */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400">
              <Database size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">Version Locale (Votre appareil)</span>
            </div>
            
            <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-4">
              <div>
                <p className="text-[9px] font-black text-slate-500 uppercase">Description</p>
                <p className="text-sm text-white font-medium italic">"{local.description}"</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[9px] font-black text-slate-500 uppercase">Impact</p>
                  <span className="text-xs font-black text-red-400 uppercase">{local.damage_level}</span>
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-500 uppercase">Type</p>
                  <span className="text-xs font-black text-blue-400 uppercase">{local.infrastructure_type}</span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => onResolve('local')}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] transition-all shadow-lg shadow-blue-600/20"
            >
              Conserver ma version
            </button>
          </div>

          {/* REMOTE VERSION */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-emerald-600/10 border border-emerald-500/20 text-emerald-400">
              <Globe size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">Version Serveur (Sentinel-2 Cloud)</span>
            </div>
            
            <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-4 opacity-80">
              <div>
                <p className="text-[9px] font-black text-slate-500 uppercase">Description</p>
                <p className="text-sm text-white font-medium italic">"{remote.description}"</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[9px] font-black text-slate-500 uppercase">Impact</p>
                  <span className="text-xs font-black text-red-400 uppercase">{remote.damage_level}</span>
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-500 uppercase">Type</p>
                  <span className="text-xs font-black text-blue-400 uppercase">{remote.infrastructure_type}</span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => onResolve('remote')}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] transition-all shadow-lg shadow-emerald-600/20"
            >
              Utiliser la version serveur
            </button>
          </div>

        </div>

        {/* FOOTER ACTION */}
        <div className="px-8 py-6 bg-[#0A0F2A]/50 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-500">
            <AlertCircle size={16} />
            <span className="text-[9px] font-black uppercase tracking-widest leading-none">Attention: La version non choisie sera définitivement supprimée.</span>
          </div>
          <button 
            onClick={() => onResolve('merge')}
            className="px-6 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
          >
            Fusionner intelligemment
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConflictResolver;
