import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const KPICard = ({ title, value, icon, trend, color = 'accent', subtitle }) => {
  const colorMap = {
    accent: {
      bg: 'bg-accent/10',
      text: 'text-accent',
      border: 'border-accent/20'
    },
    red: {
      bg: 'bg-red-500/10',
      text: 'text-red-500',
      border: 'border-red-500/20'
    },
    emerald: {
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-500',
      border: 'border-emerald-500/20'
    },
    amber: {
      bg: 'bg-amber-500/10',
      text: 'text-amber-500',
      border: 'border-amber-500/20'
    }
  };

  const colors = colorMap[color] || colorMap.accent;

  const renderIcon = () => {
    if (!icon) return null;
    if (React.isValidElement(icon)) return icon;
    if (typeof icon === 'function') {
      const IconComponent = icon;
      return <IconComponent className="h-6 w-6 text-accent" />;
    }
    return icon;
  };

  const trendValue = typeof trend === 'string' ? trend : trend?.value;
  const trendPositive = typeof trend === 'object' ? trend?.positive : typeof trend === 'string' ? !trend.trim().startsWith('-') : true;
  const trendLabel = typeof trend === 'object' ? trend?.label : '';

  return (
    <div className="glass-panel p-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300 relative overflow-hidden group">
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className={`p-2.5 rounded-xl ${colors.bg} ${colors.text}`}>
          <div className="text-xl">{renderIcon()}</div>
        </div>
        {trend && (
          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black ${
            trendPositive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
          }`}>
            {trendPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
            {trendValue}
          </div>
        )}
      </div>

      <div className="relative z-10">
        <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-1">{title}</p>
        <div className="flex items-baseline gap-2">
          <h2 className="text-3xl font-black text-white tracking-tighter">{value}</h2>
          {subtitle && <span className="text-[10px] font-bold text-slate-400 uppercase">{subtitle}</span>}
        </div>
      </div>

      {/* Subtle decorative background icon */}
      <div className="absolute -right-4 -bottom-4 text-white opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-700 pointer-events-none">
         <div className="text-8xl">{renderIcon()}</div>
      </div>
    </div>
  );
};

export default KPICard;
