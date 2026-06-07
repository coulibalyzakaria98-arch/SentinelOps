import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Map, Brain, Settings, LogOut, 
  ChevronLeft, ChevronRight, Shield, User, Search,
  Eye, Satellite, Radio, AlertTriangle, Activity,
  Thermometer, Droplets, Flame, Building, TrendingUp,
  Clock, Wifi, WifiOff, Download, Filter, Layers
} from 'lucide-react';

const CommandDashboard = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [time, setTime] = useState(new Date());

  // Données mockées
  const mockData = {
    groundIntel: 47,
    activeUnits: 14,
    fusionScore: 88,
    systemUptime: "99.98%",
    criticalIncidents: 3,
    realtimeEvents: 24,
    propagation: {
      speed: 4.2,
      direction: t('simulator.direction'),
      risk: 78
    }
  };

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      clearInterval(timer);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const formatUTCTime = () => time.toISOString().substr(11, 8);
  const formatDate = () => time.toISOString().substr(0, 10);

  const navItems = [
    { path: '/command', label: t('nav.dashboard'), icon: LayoutDashboard },
    { path: '/command/map', label: t('nav.map'), icon: Map },
    { path: '/command/intelligence', label: t('nav.intelligence'), icon: Brain },
    { path: '/command/analytics', label: t('nav.analytics'), icon: TrendingUp },
    { path: '/command/settings', label: t('nav.settings'), icon: Settings },
  ];

  const filters = [
    { id: 'all', label: t('filters.global'), icon: Layers },
    { id: 'fires', label: t('filters.fires'), icon: Flame },
    { id: 'floods', label: t('filters.floods'), icon: Droplets },
    { id: 'infrastructure', label: t('filters.infrastructure'), icon: Building },
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
                <p className="text-[10px] text-slate-400">{t('nav.command')}</p>
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
            <div>
              <h1 className="text-lg font-bold text-white">
                {t('app.name')} <span className="text-[#1F77D2]">{t('app.title')}</span>
              </h1>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[10px] text-green-400 font-mono">{t('status.nominal')}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-xs text-slate-500">{t('status.officer')}</div>
                <div className="text-xs font-mono text-white">{formatUTCTime()}</div>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#1F77D2]/20 flex items-center justify-center">
                <Shield size={16} className="text-[#1F77D2]" />
              </div>
            </div>
          </div>
        </header>

        {/* KPI Cards - TOUTES LES VALEURS SONT TRADUITES */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
          {/* Renseignements au sol */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl p-4 border border-slate-700">
            <p className="text-xs text-slate-400 uppercase tracking-wider">{t('command.intel')}</p>
            <p className="text-2xl font-bold text-white mt-1">{mockData.groundIntel}</p>
            <p className="text-[10px] text-slate-500 mt-1">{t('command.signals')}</p>
          </div>
          
          {/* Unités actives */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl p-4 border border-slate-700">
            <p className="text-xs text-slate-400 uppercase tracking-wider">{t('command.activeUnits')}</p>
            <p className="text-2xl font-bold text-white mt-1">{mockData.activeUnits}</p>
            <p className="text-[10px] text-slate-500 mt-1">{t('field.online')}</p>
          </div>
          
          {/* Incidents critiques */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl p-4 border border-slate-700">
            <p className="text-xs text-slate-400 uppercase tracking-wider">{t('alerts.critical')}</p>
            <p className="text-2xl font-bold text-red-400 mt-1">{mockData.criticalIncidents}</p>
            <p className="text-[10px] text-slate-500 mt-1">{t('status.active')}</p>
          </div>
          
          {/* Score de fusion */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl p-4 border border-slate-700">
            <p className="text-xs text-slate-400 uppercase tracking-wider">{t('command.fusionScore')}</p>
            <p className="text-2xl font-bold text-blue-400 mt-1">{mockData.fusionScore}%</p>
            <p className="text-[10px] text-slate-500 mt-1">{t('command.globalScore')}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="px-4 mb-4">
          <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">{t('filters.title') || 'Filtres'}</p>
          <div className="flex flex-wrap gap-2">
            {filters.map(filter => {
              const Icon = filter.icon;
              return (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1 ${
                    activeFilter === filter.id
                      ? 'bg-[#1F77D2] text-white'
                      : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  <Icon size={12} />
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content Area - Map and Alerts */}
        <div className="flex flex-col lg:flex-row gap-4 p-4 pt-0">
          {/* Map Section */}
          <div className="flex-1 bg-slate-800/30 rounded-xl border border-slate-700 overflow-hidden">
            <div className="p-3 border-b border-slate-700">
              <h3 className="text-sm font-semibold text-white">{t('map.title')}</h3>
            </div>
            <div className="h-96 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
              <div className="text-center">
                <Layers size={48} className="mx-auto text-slate-600 mb-2" />
                <p className="text-slate-400 text-sm">{t('map.title')}</p>
                <p className="text-xs text-slate-500 mt-1">{t('map.legend')}</p>
              </div>
            </div>
          </div>

          {/* Alerts Section */}
          <div className="w-full lg:w-80 bg-slate-800/30 rounded-xl border border-slate-700">
            <div className="p-3 border-b border-slate-700">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <AlertTriangle size={16} className="text-orange-400" />
                {t('alerts.title')}
              </h3>
            </div>
            <div className="p-3 space-y-3 max-h-96 overflow-y-auto">
              <div className="p-2 rounded-lg bg-red-950/20 border-l-2 border-red-500">
                <p className="text-xs font-medium text-red-400">{t('alerts.critical')}</p>
                <p className="text-xs text-slate-300 mt-1">Zone Alpha - {t('alerts.deployment')}</p>
              </div>
              <div className="p-2 rounded-lg bg-orange-950/20 border-l-2 border-orange-500">
                <p className="text-xs font-medium text-orange-400">{t('alerts.urgent')}</p>
                <p className="text-xs text-slate-300 mt-1">Nord-Est - {t('alerts.propagationWarning')}</p>
              </div>
              <div className="p-2 rounded-lg bg-yellow-950/20 border-l-2 border-yellow-500">
                <p className="text-xs font-medium text-yellow-400">{t('alerts.moderate')}</p>
                <p className="text-xs text-slate-300 mt-1">Abidjan Sud - {t('alerts.action')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Strategic Simulator */}
        <div className="m-4 p-4 bg-gradient-to-r from-blue-950/30 to-slate-800/30 rounded-xl border border-blue-800/30">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xs font-semibold text-blue-400 uppercase tracking-wider">{t('simulator.title')}</h3>
            <span className="text-xs text-orange-400">{t('simulator.risk')}: {mockData.propagation.risk}%</span>
          </div>
          <p className="text-sm text-white">
            {t('simulator.propagation')}: <strong>{mockData.propagation.speed} km/h</strong> → {mockData.propagation.direction}
          </p>
          <div className="mt-2 h-1.5 bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full" style={{ width: `${mockData.propagation.risk}%` }} />
          </div>
        </div>

        {/* AST Section */}
        <div className="m-4 p-3 bg-slate-800/50 rounded-xl border border-slate-700">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
              <Brain size={14} className="text-blue-400" />
            </div>
            <span className="text-xs font-semibold text-blue-400">{t('ast.title')}</span>
          </div>
          <p className="text-xs text-slate-300 mt-2">{t('ast.analysis')} — {t('ast.recommendation')}</p>
        </div>
      </div>
    </div>
  );
};

export default CommandDashboard;
