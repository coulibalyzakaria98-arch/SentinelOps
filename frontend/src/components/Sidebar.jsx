import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutGrid, 
  Map as MapIcon, 
  FileText, 
  BarChart3, 
  Settings, 
  X,
  Shield,
  Activity,
  LogOut
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../hooks/useTranslation';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const roleLabels = {
    field: t('nav.field'),
    command: t('nav.command'),
    analyst: t('nav.analytics'),
    admin: t('nav.admin')
  };

  const navItems = [
    { id: 'dashboard', path: '/dashboard', label: t('nav.dashboard'), icon: <LayoutGrid size={20} />, roles: ['admin', 'command', 'analyst', 'user'] },
    { id: 'map', path: '/map', label: t('nav.map'), icon: <MapIcon size={20} />, roles: ['admin', 'command', 'user'] },
    { id: 'intel', path: '/intel', label: t('nav.intelligence'), icon: <FileText size={20} />, roles: ['admin', 'command', 'analyst'] },
    { id: 'analytics', path: '/analytics', label: t('nav.analytics'), icon: <BarChart3 size={20} />, roles: ['admin', 'analyst'] },
    { id: 'settings', path: '/settings', label: t('nav.settings'), icon: <Settings size={20} />, roles: ['admin'] },
  ];

  const filteredNavItems = navItems.filter(item => 
    !item.roles || (user && item.roles.includes(user.role))
  );

  const handleNavigate = (path) => {
    navigate(path);
    if (window.innerWidth < 1024) setIsOpen(false); // Ferme sur mobile
  };

  return (
    <>
      <aside className={`
        fixed inset-y-0 left-0 z-[50] w-72 bg-[#0D1535] border-r border-white/5 transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0
        ${isOpen ? 'translate-x-0 shadow-[20px_0_50px_rgba(0,0,0,0.5)]' : '-translate-x-full'}
      `}>
        {/* Header/Logo Section */}
        <div className="h-20 flex items-center px-6 border-b border-white/5 bg-[#0A0F2A]/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Shield className="text-white w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-black uppercase tracking-widest text-white leading-tight">{t('app.name')}</h2>
              <p className="text-[10px] font-bold text-blue-400 uppercase tracking-tighter">{t('app.title')}</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="ml-auto p-2 text-slate-400 hover:text-white transition-colors lg:hidden">
            <X size={20} />
          </button>
        </div>

        {/* User Quick Info */}
        <div className="p-4 mx-4 my-6 rounded-2xl bg-white/5 border border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-sm uppercase">
              {user?.name?.[0] || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black text-white truncate uppercase">{user?.name || t('nav.admin')}</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{roleLabels[user?.role] || user?.role || t('nav.field')}</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="px-4 flex flex-col gap-1">
          <p className="px-4 mb-2 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">{t('nav.navigation')}</p>
          {filteredNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.path)}
                className={`
                  flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group
                  ${isActive 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-100'}
                `}
              >
                <div className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                  {item.icon}
                </div>
                <span className="text-[11px] font-black uppercase tracking-widest">{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_white]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* System Status Footer */}
        <div className="mt-auto p-6 border-t border-white/5 bg-[#0A0F2A]/30">
           <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              <div className="flex-1">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em]">{t('status.dataLink')}</p>
                <p className="text-[10px] font-black text-emerald-400 uppercase">{t('status.statusLabel')}: {t('status.nominal')}</p>
              </div>
              <Activity size={14} className="text-slate-600" />
           </div>

           <button 
             onClick={logout}
             className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-white/5 text-slate-400 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-all text-xs font-black uppercase tracking-widest"
           >
             <LogOut size={14} />
             {t('nav.logout')}
           </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
