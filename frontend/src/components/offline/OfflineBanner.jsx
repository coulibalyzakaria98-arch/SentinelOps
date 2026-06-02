import React, { useState } from 'react';
import { useOffline } from '../../contexts/OfflineContext';
import { 
  WifiOff, 
  RefreshCw, 
  CloudOff, 
  Database, 
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle2
} from 'lucide-react';

const OfflineBanner = () => {
  const { isOnline, pendingCount, forceSync, isSyncing } = useOffline();
  const [showQueue, setShowQueue] = useState(false);
  
  // Only show if offline or if there are pending items to sync
  if (isOnline && pendingCount === 0) return null;
  
  return (
    <div className={`fixed top-0 left-0 right-0 z-[9999] shadow-2xl transition-all duration-500 animate-slide-down`}>
      {/* MAIN BANNER */}
      <div className={`
        ${isOnline ? 'bg-amber-600' : 'bg-red-700'} 
        border-b border-white/20 px-6 py-3
      `}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md">
              {isOnline ? (
                <Database className="text-white animate-pulse" size={20} />
              ) : (
                <WifiOff className="text-white" size={20} />
              )}
            </div>
            
            <div>
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-white">
                {isOnline ? 'CONGESTION DE SYNCHRONISATION' : 'MODE OPÉRATIONNEL HORS LIGNE'}
              </h2>
              <p className="text-[10px] font-bold text-white/80 uppercase tracking-widest mt-0.5 leading-none">
                {isOnline 
                  ? `${pendingCount} PAQUETS DE DONNÉES EN ATTENTE D'INJECTION` 
                  : 'DONNÉES SAUVEGARDÉES DANS LE NOYAU LOCAL (INDEXEDDB)'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {pendingCount > 0 && (
              <button 
                onClick={() => setShowQueue(!showQueue)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/20 hover:bg-black/30 text-[10px] font-black uppercase text-white transition-all border border-white/10"
              >
                File d'attente
                {showQueue ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            )}

            {isOnline && pendingCount > 0 && (
              <button
                onClick={forceSync}
                disabled={isSyncing}
                className="flex items-center gap-2 px-5 py-2 bg-white text-amber-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-50 transition-all shadow-lg shadow-black/20 disabled:opacity-50"
              >
                {isSyncing ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    INJECTION...
                  </>
                ) : (
                  <>
                    <RefreshCw size={14} />
                    SYNCHRONISER
                  </>
                )}
              </button>
            )}
            
            {!isOnline && (
              <div className="px-4 py-2 bg-red-800/50 rounded-xl border border-white/10">
                <span className="text-[10px] font-black uppercase tracking-widest text-white">LIAISON ROMPUE</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* QUEUE PANEL (Collapsible) */}
      {showQueue && pendingCount > 0 && (
        <div className="bg-[#0D1535] border-b border-white/5 shadow-inner max-h-60 overflow-y-auto custom-scrollbar animate-fade-in">
          <div className="max-w-7xl mx-auto p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {/* This is a visual representation, in a real scenario we would map through the actual queue items if exposed by context */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                    <Clock size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-white uppercase">RAPPORT_LOCAL_001</p>
                    <p className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter">Attente d'envoi • 2.4MB</p>
                  </div>
                </div>
                <div className="text-[8px] font-black text-amber-500 uppercase">PENDING</div>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                    <CheckCircle2 size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-white uppercase">IMAGE_SECTEUR_B</p>
                    <p className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter">Vérification noyau • 1.1MB</p>
                  </div>
                </div>
                <div className="text-[8px] font-black text-emerald-500 uppercase">READY</div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-red-500/5 border border-red-500/10">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-red-500/10 text-red-500">
                    <AlertTriangle size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-white uppercase">DATA_FUSION_Z3</p>
                    <p className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter">Échec injection • Retry #3</p>
                  </div>
                </div>
                <div className="text-[8px] font-black text-red-500 uppercase">CONFLICT</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfflineBanner;
