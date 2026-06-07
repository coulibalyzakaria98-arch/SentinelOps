import React, { useEffect, useState } from 'react';
import { reportApi } from '../../services/api';
import { AlertCircle, ShieldAlert, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const AlertPanel = () => {
  const { t } = useTranslation();
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const data = await reportApi.getAll();
        const critical = data.filter(r => (r.confidence_score || 0) > 0.8 || r.damage_level === 'total');
        setAlerts(critical.slice(0, 3));
      } catch (err) {
        console.error("Alert Fetch Failed:", err);
      }
    };
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 15000);
    return () => clearInterval(interval);
  }, []);

  if (alerts.length === 0) return (
    <div className="flex items-center gap-3 py-2 px-1">
      <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500">
         <AlertCircle size={16} />
      </div>
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">{t('alerts.noAlerts')}</p>
    </div>
  );

  return (
    <div className="space-y-3">
      {alerts.map((alert) => (
        <div key={alert.id} className="flex items-center gap-3 group animate-in slide-in-from-right duration-300">
           <div className="w-10 h-10 rounded-xl bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.1)] group-hover:bg-red-600 group-hover:text-white transition-all duration-500">
              <ShieldAlert size={20} className="animate-pulse" />
           </div>
           <div className="flex-1 min-w-0">
              <p className="text-[10px] font-black text-white uppercase tracking-tight truncate group-hover:text-red-400 transition-colors">{alert.title}</p>
              <div className="flex items-center gap-2 mt-0.5">
                 <span className="text-[8px] font-black bg-red-600 px-1 rounded text-white tracking-widest">{t('alerts.critical')}</span>
                 <span className="text-[8px] font-bold text-slate-500 uppercase">{t(`filters.infrastructure`)}</span>
              </div>
           </div>
           <ChevronRight size={14} className="text-slate-700 group-hover:text-white transition-colors" />
        </div>
      ))}
    </div>
  );
};

export default AlertPanel;
