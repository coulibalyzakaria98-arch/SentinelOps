import React from 'react';
import { Camera, Zap } from 'lucide-react';

const QuickCamera = ({ onCapture }) => {
  return (
    <div className="glass-panel p-8 rounded-[2.5rem] border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10 transition-all duration-700 group relative overflow-hidden flex flex-col items-center justify-center text-center shadow-2xl">
      {/* Decorative pulse background */}
      <div className="absolute inset-0 bg-blue-500/5 animate-pulse-slow" />
      
      <div className="relative z-10 w-24 h-24 rounded-3xl bg-blue-600 flex items-center justify-center shadow-[0_0_50px_rgba(37,99,235,0.4)] mb-6 group-hover:scale-110 transition-transform duration-500 border border-white/20">
         <Camera size={44} className="text-white" />
      </div>

      <div className="relative z-10">
        <h2 className="text-3xl font-black uppercase tracking-tighter text-white mb-2">Capture Instantanée</h2>
        <p className="text-slate-400 text-sm font-medium uppercase tracking-[0.2em] mb-8">Intelligence Visuelle Immédiate</p>
        
        <label className="cursor-pointer inline-flex items-center gap-3 px-8 py-4 bg-[#1F77D2] hover:bg-[#2589e9] text-white rounded-2xl shadow-xl transition-all font-black uppercase tracking-[0.15em] text-xs active:scale-95 border border-white/20 group/btn">
          <Zap size={16} className="group-hover:animate-pulse" />
          Activer la Caméra
          <input type="file" accept="image/*" capture="environment" onChange={onCapture} className="hidden" />
        </label>
      </div>

      {/* Proof elements */}
      <div className="mt-8 flex gap-4 opacity-40 group-hover:opacity-60 transition-opacity">
         <div className="text-[9px] font-black uppercase tracking-widest text-slate-500 border border-slate-700 px-2 py-1 rounded">SSL Secure</div>
         <div className="text-[9px] font-black uppercase tracking-widest text-slate-500 border border-slate-700 px-2 py-1 rounded">EXIF Stripped</div>
         <div className="text-[9px] font-black uppercase tracking-widest text-slate-500 border border-slate-700 px-2 py-1 rounded">No Logs</div>
      </div>
    </div>
  );
};

export default QuickCamera;
