import React, { useState } from 'react';
import KPICard from '../components/common/KPICard.jsx';
import OfflineBanner from '../components/offline/OfflineBanner';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import {
  BarChart3,
  TrendingUp,
  PieChart,
  LineChart,
  Download,
  Calendar,
  Globe,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';

const Analyst = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('incidents');
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for analytics
  const analyticsData = {
    incidents: {
      total: 247,
      trend: '+12%',
      breakdown: [
        { category: t('filters.floods'), count: 89, percentage: 36 },
        { category: t('filters.fires'), count: 67, percentage: 27 },
        { category: 'Médical', count: 45, percentage: 18 },
        { category: t('filters.infrastructure'), count: 34, percentage: 14 },
        { category: 'Autre', count: 12, percentage: 5 }
      ]
    },
    response: {
      avgTime: '4.2m',
      trend: '-0.8m',
      zones: [
        { name: 'Centre-Ville', time: '3.1m', status: 'good' },
        { name: 'District Nord', time: '4.8m', status: 'average' },
        { name: 'Zone Est', time: '5.2m', status: 'poor' },
        { name: 'Secteur Ouest', time: '3.8m', status: 'good' }
      ]
    },
    resources: {
      deployed: 23,
      available: 12,
      utilization: 78,
      teams: [
        { name: 'Alpha', status: 'active', utilization: 95 },
        { name: 'Bravo', status: 'standby', utilization: 45 },
        { name: 'Charlie', status: 'maintenance', utilization: 0 },
        { name: 'Delta', status: 'active', utilization: 88 }
      ]
    }
  };

  const timeRanges = [
    { id: '24h', label: t('time.last24h') },
    { id: '7d', label: t('time.last7d') },
    { id: '30d', label: t('time.last30d') },
    { id: '90d', label: t('time.last90d') }
  ];

  const metrics = [
    { id: 'incidents', label: 'Incidents', icon: AlertCircle },
    { id: 'response', label: t('analytics.response_time'), icon: Clock },
    { id: 'resources', label: 'Ressources', icon: Activity }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'good': return 'emerald';
      case 'average': return 'amber';
      case 'poor': return 'red';
      case 'active': return 'emerald';
      case 'standby': return 'blue';
      case 'maintenance': return 'slate';
      default: return 'slate';
    }
  };

  const handleExport = async (format) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert(`${t('buttons.export')} ${selectedMetric} -> ${format.toUpperCase()}`);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* 🛠 CONTROLS & FILTERS */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#0D1535]/40 p-4 rounded-2xl border border-white/5">
        <div className="flex items-center gap-4">
          <div className="flex gap-1 p-1 bg-slate-900/50 rounded-xl border border-white/5">
            {timeRanges.map((range) => (
              <button
                key={range.id}
                onClick={() => setTimeRange(range.id)}
                className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${
                  timeRange === range.id
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-1 p-1 bg-slate-900/50 rounded-xl border border-white/5">
          {metrics.map((metric) => (
            <button
              key={metric.id}
              onClick={() => setSelectedMetric(metric.id)}
              className={`flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${
                selectedMetric === metric.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <metric.icon size={14} />
              <span className="hidden sm:inline">{metric.label}</span>
            </button>
          ))}
        </div>
      </div>

      <OfflineBanner />

      {/* 📊 KPI CARDS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title={t('analytics.total_incidents')}
          value={analyticsData.incidents.total.toString()}
          subtitle={`${t('time.now')} ${timeRange}`}
          icon={<AlertCircle size={20} />}
          trend={analyticsData.incidents.trend}
          color="red"
        />
        <KPICard
          title={t('analytics.response_time')}
          value={analyticsData.response.avgTime}
          subtitle={t('analytics.global_avg')}
          icon={<Clock size={20} />}
          trend={analyticsData.response.trend}
          color="emerald"
        />
        <KPICard
          title={t('analytics.resource_utilization')}
          value={`${analyticsData.resources.utilization}%`}
          subtitle={t('analytics.current_cap')}
          icon={<Activity size={20} />}
          color="accent"
        />
        <KPICard
          title={t('analytics.units_deployed')}
          value={analyticsData.resources.deployed.toString()}
          subtitle={t('analytics.field_teams')}
          icon={<CheckCircle size={20} />}
          color="blue"
        />
      </div>

      {/* 📉 MAIN ANALYTICS CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Primary Chart Area */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-white/10 bg-[#07101F]/80 shadow-xl flex flex-col min-h-[450px]">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="p-3.5 rounded-2xl bg-blue-600/10 text-blue-500 border border-blue-500/20">
                <LineChart size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black text-white uppercase tracking-tighter">
                  {selectedMetric === 'incidents' && t('analytics.trends_incidents')}
                  {selectedMetric === 'response' && t('analytics.trends_delays')}
                  {selectedMetric === 'resources' && t('analytics.trends_resources')}
                </h3>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">{t('analytics.real_time_viz')}</p>
              </div>
            </div>
            <button
              onClick={() => handleExport('pdf')}
              disabled={isLoading}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl border border-white/5 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              <Download size={14} />
              {t('buttons.export')}
            </button>
          </div>
          
          <div className="flex-1 bg-slate-900/40 rounded-2xl border border-white/5 flex flex-col items-center justify-center border-dashed">
            <LineChart size={48} className="text-slate-700 mb-4 opacity-20" />
            <p className="text-slate-500 font-black text-[10px] uppercase tracking-[0.2em]">{t('analytics.loading_data')}</p>
            <p className="text-[9px] text-slate-600 mt-2 uppercase">{t('analytics.last_update')}: {new Date().toLocaleTimeString()}</p>
          </div>
        </div>

        {/* Side Panel: Breakdown & Insights */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-white/10 bg-[#07101F]/80 shadow-xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-2xl bg-indigo-600/10 text-indigo-500 border border-indigo-500/20">
                <PieChart size={20} />
              </div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest">{t('analytics.breakdown')}</h3>
            </div>
            <div className="space-y-4">
              {selectedMetric === 'incidents' && analyticsData.incidents.breakdown.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.category}</span>
                    <span className="text-xs font-black text-white">{item.percentage}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden p-0.5">
                    <div
                      className="h-full bg-blue-600 rounded-full shadow-[0_0_8px_rgba(37,99,235,0.4)]"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
              {/* Other breakdown states omitted for brevity but following same pattern */}
              {selectedMetric !== 'incidents' && (
                <p className="text-xs text-slate-500 italic text-center py-4">{t('ast.analysis')}</p>
              )}
            </div>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-white/10 bg-[#07101F]/80 shadow-xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-2xl bg-emerald-600/10 text-emerald-500 border border-emerald-500/20">
                <TrendingUp size={20} />
              </div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest">{t('analytics.ia_insight')}</h3>
            </div>
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle size={14} className="text-emerald-500" />
                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{t('analytics.optimization')}</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-medium">Les délais de réponse se sont améliorés de 15% cette semaine grâce à la nouvelle sectorisation.</p>
              </div>
              <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle size={14} className="text-amber-500" />
                  <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">{t('analytics.attention')}</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-medium">Le District Nord montre une augmentation inhabituelle des signaux d'incendie (Secteur Delta).</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analyst;

