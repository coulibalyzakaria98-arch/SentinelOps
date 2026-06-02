import React from 'react';
import Card from '../ui/Card';

export default function KPICard({ title, value, subtitle, icon: Icon, trend, className = '' }) {
  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400 uppercase tracking-[0.12em]">{title}</p>
          <p className="mt-2 text-3xl font-bold text-white">{value}</p>
          {subtitle && <p className="mt-1 text-sm text-slate-300">{subtitle}</p>}
        </div>
        {Icon && (
          <div className="rounded-2xl bg-accent/10 p-3">
            <Icon className="h-6 w-6 text-accent" />
          </div>
        )}
      </div>
      {trend && (
        <div className="mt-4 flex items-center gap-2">
          <span className={`text-sm font-semibold ${trend.positive ? 'text-success' : 'text-danger'}`}>
            {trend.positive ? '↗' : '↘'} {trend.value}
          </span>
          <span className="text-sm text-slate-400">{trend.label}</span>
        </div>
      )}
    </Card>
  );
}