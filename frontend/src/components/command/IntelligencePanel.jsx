import React from 'react';
import { 
  BrainCircuit, 
  Zap, 
  ShieldAlert, 
  TrendingUp, 
  Map as MapIcon,
  ChevronRight,
  Info
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const IntelligencePanel = ({ fusionScore = 88, intelligence = {} }) => {
  const { t } = useTranslation();
  
  const recommendations = [
    { id: 1, type: 'PRIORITY', text: t('ast.deployUnit'), icon: <ShieldAlert size={14} className="text-red-400" /> },
    { id: 2, type: 'TACTICAL', text: t('ast.securePerimeter'), icon: <Zap size={14} className="text-blue-400" /> },
    { id: 3, type: 'RISK', text: t('alerts.propagationWarning'), icon: <TrendingUp size={14} className="text-orange-400" /> }
  ];

  const getScoreColor = (score) => {
    if (score > 80) return 'text-emerald-400';
    if (score > 50) return 'text-amber-400';
    return 'text-red-400';
  };

  return (
    <div className="flex flex-col gap-6">
      {/* 🧠 AI FUSION CORE */}
      <div className="glass-panel p-6 rounded-[2rem] border border-blue-500/20 bg-blue-500/5 shadow-xl relative overflow-hidden group">
        <div className="absolute -top-10 -right-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
          <BrainCircuit size={160} className="text-blue-500" />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/20">
                <BrainCircuit size={20} />
              </div>
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-widest leading-none">{t('command.fusionScore')}</h3>
                <p className="text-[9px] font-bold text-blue-400/60 uppercase tracking-widest mt-1">{t('command.activeIA')}</p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className={`text-3xl font-black ${getScoreColor(fusionScore)} tracking-tighter`}>{fusionScore}%</span>
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{t('ast.confidence')}</span>
            </div>
          </div>

          <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden p-0.5 border border-white/5">
            <div 
              className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-500 rounded-full transition-all duration-1000 shadow-[0_0_12px_rgba(37,99,235,0.4)]" 
              style={{ width: `${fusionScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* 📋 TACTICAL RECOMMENDATIONS */}
      <div className="glass-panel p-6 rounded-[2rem] border border-white/10 bg-[#07101F]/90 shadow-xl flex-1">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
            <Info size={14} className="text-blue-500" />
            {t('ast.title')}
          </h3>
          <span className="px-2 py-0.5 rounded-md bg-white/5 text-[8px] font-black text-slate-500 border border-white/5">v4.2.1-SENTINEL</span>
        </div>

        <div className="space-y-4">
          {recommendations.map((rec) => (
            <div key={rec.id} className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all cursor-pointer group">
              <div className="flex gap-4">
                <div className="shrink-0 mt-1">{rec.icon}</div>
                <div className="flex-1">
                  <p className="text-[11px] text-slate-300 font-medium leading-relaxed italic">
                    <span className="text-white font-black uppercase tracking-widest text-[9px] mr-2 opacity-50">{rec.type}:</span>
                    {rec.text}
                  </p>
                  <div className="flex items-center gap-1 mt-2 text-blue-400 group-hover:translate-x-1 transition-transform">
                    <span className="text-[8px] font-black uppercase tracking-widest">{t('ast.details')}</span>
                    <ChevronRight size={10} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 📊 PROPAGATION SIMULATOR */}
      <div className="glass-panel p-6 rounded-[2rem] border border-white/10 bg-[#07101F]/90 shadow-xl">
        <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
          <MapIcon size={14} className="text-orange-500" />
          {t('simulator.title')}
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="text-lg font-black text-white">4.2 <span className="text-[10px] text-slate-500 uppercase ml-0.5">km/h</span></div>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none">{t('simulator.propagation')}</p>
          </div>
          <div className="space-y-1 text-right">
            <div className="text-lg font-black text-white">{t('simulator.direction')}</div>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none">{t('simulator.direction')}</p>
          </div>
        </div>

        <div className="mt-6 p-4 rounded-2xl bg-orange-500/5 border border-orange-500/10">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[9px] font-black text-orange-400 uppercase tracking-widest">{t('simulator.risk')}</span>
            <span className="text-[10px] font-black text-white">78%</span>
          </div>
          <div className="h-1 bg-slate-900 rounded-full overflow-hidden">
            <div className="h-full bg-orange-500 rounded-full" style={{ width: '78%' }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntelligencePanel;

