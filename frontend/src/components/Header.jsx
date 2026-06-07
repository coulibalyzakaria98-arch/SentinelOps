import React, { useState, useEffect } from 'react';
import { Shield, Satellite, Radio, Clock, Menu, Wifi, WifiOff, Globe } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import LanguageSwitcher from '../i18n/components/LanguageSwitcher';

const Header = ({ isCrisisAlert, onToggleSidebar }) => {
  const [time, setTime] = useState(new Date());
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const { t } = useTranslation();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const formatUTCTime = () => time.toISOString().substr(11, 8);
  const formatDate = () => time.toISOString().substr(0, 10);

  return (
    <header className="sticky top-0 z-[100] h-20 w-full border-b border-[#1F77D2]/30 bg-[#0A0F2A]/90 backdrop-blur-2xl px-4 sm:px-8 flex items-center justify-between">
      <div className="flex items-center gap-4 lg:gap-6">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/80 text-slate-200 transition hover:bg-slate-900"
          aria-label={t('buttons.menu') || 'Ouvrir le menu'}
        >
          <Menu size={20} />
        </button>

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <div className="w-2 h-6 bg-[#1F77D2] rounded-full" />
            <h1 className="text-xl font-black uppercase tracking-tighter text-white">
              {t('app.name')} <span className="text-[#1F77D2]">{t('app.title')}</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-2 mt-1">
            <div className={`w-2 h-2 rounded-full ${
              isCrisisAlert 
                ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' 
                : isOnline 
                  ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' 
                  : 'bg-yellow-500 shadow-[0_0_8px_#eab308]'
            } animate-pulse`} />
            <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${
              isCrisisAlert ? 'text-red-500' : isOnline ? 'text-green-500' : 'text-yellow-500'
            }`}>
              {t('status.system') || 'État du système'}: {isCrisisAlert 
                ? t('status.critical') || 'CRITIQUE'
                : isOnline 
                  ? t('status.nominal') || 'NOMINAL'
                  : t('status.offline') || 'HORS LIGNE'}
            </span>
          </div>
        </div>

        <div className="h-10 w-px bg-white/10 hidden md:block" />
        
        <div className="hidden lg:flex items-center gap-4">
          <div className="px-3 py-1.5 rounded-lg bg-[#1F77D2]/10 border border-[#1F77D2]/30 flex items-center gap-2">
            <Satellite size={14} className="text-[#1F77D2] animate-spin-slow" />
            <span className="text-[9px] font-black text-[#1F77D2] uppercase tracking-widest">
              Sentinel Fusion
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-500">
            {isOnline ? (
              <Wifi size={14} className="text-green-500 animate-pulse" />
            ) : (
              <WifiOff size={14} className="text-yellow-500" />
            )}
            <span className="text-[9px] font-bold uppercase tracking-widest">
              {isOnline ? t('status.online') || 'EN LIGNE' : t('status.offline') || 'HORS LIGNE'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <LanguageSwitcher variant="minimal" />

        <div className="flex flex-col items-end font-mono">
          <div className="flex items-center gap-2 text-white">
            <Clock size={14} className="text-[#1F77D2]" />
            <span className="text-sm font-black tracking-widest">{formatUTCTime()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Globe size={8} className="text-slate-600" />
            <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">
              {formatDate()} UTC
            </span>
          </div>
        </div>

        <div className="h-8 w-px bg-white/10" />

        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end hidden sm:flex">
            <span className="text-[10px] font-black text-white leading-none">
              {t('status.officer') || 'Officier de Garde'}
            </span>
            <span className="text-[8px] font-bold text-[#F4C430] uppercase mt-1 tracking-tighter">
              {t('status.sector') || 'Secteur Alpha • SentinelOps'}
            </span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#1F77D2] hover:bg-[#1F77D2]/10 transition-all cursor-pointer group">
            <Shield size={20} className="group-hover:scale-110 transition-transform" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
