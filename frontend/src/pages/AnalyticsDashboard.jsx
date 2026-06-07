import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Map, Brain, Settings, LogOut, 
  ChevronLeft, ChevronRight, Shield, User,
  TrendingUp, BarChart3, PieChart, Download,
  Calendar, Filter, Activity, Eye
} from 'lucide-react';

const AnalyticsDashboard = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [timeRange, setTimeRange] = useState('7d');

  const navItems = [
    { path: '/command', label: t('nav.dashboard'), icon: LayoutDashboard },
    { path: '/command/map', label: t('nav.map'), icon: Map },
    { path: '/command/intelligence', label: t('nav.intelligence'), icon: Brain },
    { path: '/command/analytics', label: t('nav.analytics'), icon: TrendingUp },
    { path: '/command/settings', label: t('nav.settings'), icon: Settings },
  ];

  const timeRanges = [
    { id: '24h', label: t('analytics.last24h') },
    { id: '7d', label: t('analytics.last7d') },
    { id: '30d', label: t('analytics.last30d') },
    { id: '90d', label: t('analytics.last90d') },
    { id: '1y', label: t('analytics.lastYear') },
  ];

  return (
    <div className="min-h-screen bg-[#0A0F2A]" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full bg-[#0F172A]/95 backdrop-blur border-r border-[#1F77D2]/20 transition-all duration-300 z-50 ${
        collapsed ? 'w-20' : 'w-64'
      }`}>
        <div className="flex items-center justify-between p-4 border-b border-[#1F77D2]/20">
          <div className={`flex items-center gap-2 ${collapsed && 'justify-center w-full'}`}>
            <Shield className="w-8 h-8 text-[#1F77D2]" />
            {!collapsed && (
              <span className="font-bold text-white text-sm">
                {t('app.name')}<span className="text-[#1F77D2]">Ops</span>
              </span>
            )}
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`text-slate-400 hover:text-white transition ${collapsed && 'hidden'}`}
          >
            <ChevronLeft size={18} />
          </button>
        </div>

        {!collapsed && (
          <div className="p-4 border-b border-slate-700/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#1F77D2]/20 flex items-center justify-center">
                <User size={16} className="text-[#1F77D2]" />
              </div>
              <div>
                <p className="text-xs font-medium text-white">{t('nav.admin')}</p>
                <p className="text-[10px] text-slate-400">{t('nav.analytics')}</p>
              </div>
            </div>
          </div>
        )}

        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-slate-400 hover:bg-slate-800/50 hover:text-white ${collapsed ? 'justify-center' : ''}`}
              >
                <Icon size={20} />
                {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {!collapsed && (
          <div className="absolute bottom-16 left-0 right-0 px-3">
            <div className="bg-slate-800/50 rounded-lg p-2">
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">{t('status.dataLink')}</p>
              <p className="text-xs font-semibold text-green-400">{t('status.nominal')}</p>
            </div>
          </div>
        )}

        <div className="absolute bottom-4 left-0 right-0 p-3 border-t border-[#1F77D2]/20">
          <button
            onClick={() => navigate('/')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-all ${collapsed ? 'justify-center' : ''}`}
          >
            <LogOut size={20} />
            {!collapsed && <span className="text-sm font-medium">{t('nav.logout')}</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${collapsed ? 'ml-20' : 'ml-64'}`}>
        {/* Header */}
        <header className="bg-[#0A0F2A]/90 backdrop-blur border-b border-[#1F77D2]/30 px-4 py-2 sticky top-0 z-40">
          <div className="flex justify-between items-center">
            <h1 className="text-lg font-bold text-white">
              {t('app.name')} <span className="text-[#1F77D2]">{t('analytics.title')}</span>
            </h1>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-xs text-slate-500">{t('status.officer')}</div>
                <div className="text-xs text-white">Analyste</div>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#1F77D2]/20 flex items-center justify-center">
                <Eye size={16} className="text-[#1F77D2]" />
              </div>
            </div>
          </div>
        </header>

        {/* Time Range Selector */}
        <div className="flex flex-wrap gap-2 p-4 border-b border-slate-800">
          {timeRanges.map((range) => (
            <button
              key={range.id}
              onClick={() => setTimeRange(range.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                timeRange === range.id
                  ? 'bg-[#1F77D2] text-white'
                  : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="p-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Trends Chart */}
            <div className="bg-slate-800/30 rounded-xl border border-slate-700 p-4">
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <TrendingUp size={16} className="text-blue-400" />
                {t('analytics.trends')}
              </h3>
              <div className="h-64 flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 size={48} className="mx-auto text-slate-600 mb-2" />
                  <p className="text-slate-400 text-sm">{t('analytics.trends')}</p>
                  <p className="text-xs text-slate-500 mt-1">{t('analytics.timeRange')}: {t(`analytics.${timeRange === '24h' ? 'last24h' : timeRange === '7d' ? 'last7d' : timeRange === '30d' ? 'last30d' : timeRange === '90d' ? 'last90d' : 'lastYear'}`)}</p>
                </div>
              </div>
            </div>

            {/* Heatmap */}
            <div className="bg-slate-800/30 rounded-xl border border-slate-700 p-4">
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <Activity size={16} className="text-orange-400" />
                {t('analytics.heatmap')}
              </h3>
              <div className="h-64 flex items-center justify-center">
                <div className="text-center">
                  <PieChart size={48} className="mx-auto text-slate-600 mb-2" />
                  <p className="text-slate-400 text-sm">{t('analytics.heatmap')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Export Section */}
          <div className="mt-4 bg-slate-800/30 rounded-xl border border-slate-700 p-4">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div>
                <h3 className="text-sm font-semibold text-white">{t('analytics.exportData')}</h3>
                <p className="text-xs text-slate-400 mt-1">{t('export.options')}</p>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-[#1F77D2]/20 text-[#1F77D2] rounded-lg text-sm font-medium hover:bg-[#1F77D2]/30 transition flex items-center gap-2">
                  <Download size={14} />
                  {t('export.pdf')}
                </button>
                <button className="px-4 py-2 bg-slate-700/50 text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-600 transition flex items-center gap-2">
                  <Download size={14} />
                  {t('export.csv')}
                </button>
                <button className="px-4 py-2 bg-slate-700/50 text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-600 transition flex items-center gap-2">
                  <Download size={14} />
                  {t('export.geojson')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
