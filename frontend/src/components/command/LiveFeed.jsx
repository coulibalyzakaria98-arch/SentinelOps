import React, { useEffect, useState } from 'react';
import { reportApi } from '../../services/api';
import { Activity, Satellite, Camera, Shield, MessageSquare, Clock } from 'lucide-react';

import { useIntelligenceWS } from '../../hooks/useIntelligenceWS';
import { useCallback } from 'react';

const LiveFeed = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🛰️ REAL-TIME ADAPTATION: Prepend new reports to the feed
  const handleRealTimeUpdate = useCallback((packet) => {
    if (packet.type === 'NEW_REPORT') {
      const newReport = packet.data;
      setReports(prev => [newReport, ...prev.filter(r => r.id !== newReport.id)].slice(0, 15));
    }
  }, []);

  useIntelligenceWS(handleRealTimeUpdate);

  const fetchRecent = async () => {
    try {
      const data = await reportApi.getAll();
      setReports(Array.isArray(data) ? data.slice(0, 15) : []);
    } catch (e) {
      console.error("📡 Live Link Failed:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecent();
    const interval = setInterval(fetchRecent, 20000);
    return () => clearInterval(interval);
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'fire': return <Activity size={12} className="text-red-500" />;
      case 'flood': return <Activity size={12} className="text-blue-500" />;
      default: return <Camera size={12} className="text-emerald-500" />;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-white/5 bg-slate-900/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Satellite size={14} className="text-blue-500" />
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-100">Flux Tactique Temps Réel</h4>
        </div>
        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_#3b82f6]" />
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-3">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-16 rounded-xl bg-white/[0.02] animate-pulse" />
            ))}
          </div>
        ) : reports.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-20">
             <MessageSquare size={32} className="mb-4" />
             <p className="text-[10px] font-black uppercase tracking-widest">Lien Inactif</p>
          </div>
        ) : (
          <div className="space-y-3">
            {reports.map((report) => (
              <div key={report.id} className="group p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.07] transition-all duration-300 cursor-pointer active:scale-[0.98]">
                 <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                       <div className="p-1.5 rounded-lg bg-slate-950 shadow-inner">
                          {getIcon(report.crisis_type)}
                       </div>
                       <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter ${
                         report.damage_level === 'total' ? 'bg-red-500/10 text-red-500' : 'bg-slate-800 text-slate-500'
                       }`}>
                         {report.damage_level}
                       </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[9px] font-mono font-bold text-slate-600 group-hover:text-slate-400">
                       <Clock size={10} />
                       {new Date(report.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                 </div>
                 <p className="text-[10px] font-black text-slate-200 leading-tight mb-1 group-hover:text-blue-400 transition-colors uppercase tracking-tight line-clamp-1">{report.title}</p>
                 <div className="flex items-center justify-between">
                    <p className="text-[9px] text-slate-500 font-medium italic truncate max-w-[70%]">{report.description || 'Aucun résumé...'}</p>
                    <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">
                       <Shield size={8} className="text-blue-400" />
                       <span className="text-[8px] font-black text-blue-300">{Math.round((report.confidence_score || 0) * 100)}%</span>
                    </div>
                 </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveFeed;
