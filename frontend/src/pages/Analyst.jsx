import React, { useState, useEffect } from 'react';
import KPICard from '../components/common/KPICard.jsx';
import OfflineBanner from '../components/offline/OfflineBanner';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { api } from '../services/api';
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Filler,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  RotateCw
} from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Analyst = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('7d');
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState(null);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      // Direct call to our new enhanced stats endpoint
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'}/stats/?range=${timeRange}`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("❌ Failed to fetch stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [timeRange]);

  const timeRanges = [
    { id: '24h', label: t('time.last24h') },
    { id: '7d', label: t('time.last7d') },
    { id: '30d', label: t('time.last30d') },
    { id: '90d', label: t('time.last90d') }
  ];

  // Chart configurations
  const barChartData = {
    labels: stats?.by_crisis_type ? Object.keys(stats.by_crisis_type).map(key => t(`field.types.${key}`) || key) : [],
    datasets: [
      {
        label: t('analytics.total_incidents'),
        data: stats?.by_crisis_type ? Object.values(stats.by_crisis_type) : [],
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        borderColor: '#3b82f6',
        borderWidth: 1,
        borderRadius: 8,
      },
    ],
  };

  const lineChartData = {
    labels: stats?.recent_trend?.map(item => item.label) || [],
    datasets: [
      {
        label: t('analytics.trends_incidents'),
        data: stats?.recent_trend?.map(item => item.value) || [],
        fill: true,
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        borderColor: '#6366f1',
        tension: 0.4,
        pointBackgroundColor: '#6366f1',
        pointRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0F172A',
        titleColor: '#fff',
        bodyColor: '#94A3B8',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        padding: 12,
        boxPadding: 4
      }
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#64748b', font: { size: 10 } } },
      y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#64748b', font: { size: 10 } } }
    }
  };

  const handleExport = (format) => {
    alert(`${t('buttons.export')} -> ${format.toUpperCase()}`);
  };

  return (
    <div className="space-y-6">
      {/* 🛠 CONTROLS & FILTERS */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#0D1535]/40 p-4 rounded-2xl border border-white/5 backdrop-blur-sm">
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
          <button 
            onClick={fetchStats}
            className="p-2 text-slate-400 hover:text-white transition-colors"
          >
            <RotateCw size={18} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>

        <div className="flex gap-2">
           <button
              onClick={() => handleExport('pdf')}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl border border-white/5 transition-all flex items-center gap-2"
            >
              <Download size={14} />
              {t('buttons.export')}
            </button>
        </div>
      </div>

      <OfflineBanner />

      {/* 📊 KPI CARDS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title={t('analytics.total_incidents')}
          value={stats?.total_reports?.toString() || '0'}
          subtitle={t('status.active')}
          icon={<AlertCircle size={20} />}
          color="blue"
        />
        <KPICard
          title={t('analytics.response_time')}
          value="4.2m"
          subtitle={t('analytics.global_avg')}
          icon={<Clock size={20} />}
          color="emerald"
        />
        <KPICard
          title={t('command.activeUnits')}
          value="14"
          subtitle={t('status.active')}
          icon={<Activity size={20} />}
          color="blue"
        />
        <KPICard
          title={t('command.fusionScore')}
          value="88%"
          subtitle={t('command.globalScore')}
          icon={<CheckCircle size={20} />}
          color="indigo"
        />
      </div>

      {/* 📉 MAIN ANALYTICS CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Incident Distribution (Bar) */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 bg-[#07101F]/80 shadow-xl flex flex-col min-h-[400px]">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 rounded-2xl bg-blue-600/10 text-blue-500 border border-blue-500/20">
              <BarChart3 size={24} />
            </div>
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest">{t('analytics.breakdown')}</h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase">{t('field.classification')}</p>
            </div>
          </div>
          
          <div className="flex-1 min-h-[250px]">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <RotateCw className="text-blue-500 animate-spin" size={32} />
              </div>
            ) : (
              <Bar data={barChartData} options={chartOptions} />
            )}
          </div>
        </div>

        {/* Temporal Trends (Line) */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 bg-[#07101F]/80 shadow-xl flex flex-col min-h-[400px]">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 rounded-2xl bg-indigo-600/10 text-indigo-500 border border-indigo-500/20">
              <TrendingUp size={24} />
            </div>
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest">{t('analytics.history')}</h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase">{t('analytics.trends_incidents')}</p>
            </div>
          </div>
          
          <div className="flex-1 min-h-[250px]">
             {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <RotateCw className="text-indigo-500 animate-spin" size={32} />
              </div>
            ) : (
              <Line data={lineChartData} options={chartOptions} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analyst;
