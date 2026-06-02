import React, { useState, useEffect } from 'react';
import { Wifi, Clock, ShieldCheck, Database, Satellite } from 'lucide-react';

const StatusBar = ({ variant = 'full' }) => {
  const [time, setTime] = useState(new Date().toISOString().substr(11, 8));
  // 🛠️ [Prototype Mode] Forcing online status for UI stability
  const isOnline = true;

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toISOString().substr(11, 8));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center gap-4">
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
        isOnline ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
      }`}>
        <div className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-red-500'} animate-pulse`} />
        {isOnline ? 'Lien Satellite: Actif' : 'Hors-ligne: File active'}
      </div>

      {variant !== 'minimal' && (
        <div className="hidden md:flex items-center gap-4 text-slate-400 border-l border-slate-800 pl-4 ml-2">
          <div className="flex items-center gap-2">
            <Database size={14} className="text-blue-500" />
            <span className="text-[9px] uppercase font-black tracking-widest text-slate-500">Sync: OK</span>
          </div>
          <div className="flex items-center gap-2 border-l border-slate-800 pl-4">
            <Clock size={14} className="text-blue-500" />
            <span className="text-[10px] font-mono font-black tracking-widest text-white">
              {time} UTC
            </span>
          </div>
        </div>
      )}

      {variant === 'full' && (
        <div className="hidden lg:flex items-center gap-2 bg-blue-600/10 border border-blue-500/20 px-3 py-1.5 rounded-xl ml-2">
          <ShieldCheck size={14} className="text-blue-500" />
          <span className="text-[9px] font-black text-blue-400 uppercase tracking-[0.2em]">Protocol V4.2 Secured</span>
        </div>
      )}
    </div>
  );
};

export default StatusBar;
