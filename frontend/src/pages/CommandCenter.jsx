import React, { useState, useEffect } from 'react';
import KPICard from '../components/common/KPICard.jsx';
import { useTranslation } from 'react-i18next';
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
  Zap,
} from 'lucide-react';

const CommandCenter = () => {
  const { t } = useTranslation();
  const { isOnline } = useOffline();
  const [filters, setFilters] = useState({ type: 'all' });
  const [activeIncidents, setActiveIncidents] = useState(14);
  const [deployedUnits, setDeployedUnits] = useState(14);
  const [groundIntel, setGroundIntel] = useState(47);
  const [fusionScore] = useState(88);

  const statusBadge = isOnline ? t('command.live') : t('status.offline');

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
          title={t('command.intel')}
          value={groundIntel.toString()}
          subtitle={t('command.signals')}
          icon={<Activity size={20} />}
          color="blue"
        />
        <KPICard
          title={t('command.activeUnits')}
          value={deployedUnits.toString()}
          subtitle={t('field.online')}
          icon={<Users size={20} />}
          color="emerald"
        />
        <KPICard
          title={t('alerts.critical')}
          value={activeIncidents.toString()}
          subtitle={t('status.active')}
          icon={<AlertTriangle size={20} />}
          color="red"
        />
        <KPICard
          title={t('command.fusionScore')}
          value={`${fusionScore}%`}
          subtitle={t('command.globalScore')}
          icon={<BarChart3 size={20} />}
          color="indigo"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* CENTER: CRISIS MAP */}
        <div className="lg:col-span-8 flex flex-col gap-6">
           <div className="glass-panel rounded-3xl overflow-hidden border-[#1F77D2]/20 min-h-[500px] flex flex-col">
              <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <h3 className="text-xs font-black uppercase tracking-widest">{t('map.title')}</h3>
                </div>
                <div className="flex gap-2">
                   <span className="text-[10px] font-bold px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{statusBadge}</span>
                </div>
              </div>
              <div className="flex-1 relative bg-slate-900/50">
                 <CrisisMap />
              </div>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AlertPanel />
              <IntelligencePanel />
           </div>
        </div>

        {/* RIGHT: LIVE FEED & ANALYSIS */}
        <div className="lg:col-span-4 flex flex-col gap-6">
           <LiveFeed />
           
           {/* AST: AI Strategic Advisor */}
           <div className="glass-panel-dark rounded-3xl p-6 border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 to-transparent">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <BrainCircuit size={24} />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-tighter text-indigo-400">{t('ast.title')}</h3>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">v4.2.1-SENTINEL</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">{t('ast.analysis')}</p>
                  <p className="text-xs text-slate-200 leading-relaxed italic">
                    "{t('ast.analysis_demo')}"
                  </p>
                </div>
                
                <div className="p-3 rounded-xl bg-indigo-500/20 border border-indigo-500/30">
                  <p className="text-[10px] text-indigo-400 font-bold uppercase mb-1">{t('ast.recommendation')}</p>
                  <p className="text-xs text-white font-bold">
                    {t('ast.deployUnit')}
                  </p>
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CommandCenter;
