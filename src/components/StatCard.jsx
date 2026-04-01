import { Card } from '@heroui/react';

export default function StatCard({ title, value, icon: Icon, trend, trendLabel, color = 'primary', className = '' }) {
  const iconBgClasses = {
    primary: 'bg-indigo-500/15 text-indigo-400',
    success: 'bg-emerald-500/15 text-emerald-400',
    danger: 'bg-rose-500/15 text-rose-400',
    warning: 'bg-amber-500/15 text-amber-400',
    secondary: 'bg-cyan-500/15 text-cyan-400',
  };

  return (
    <Card className={`stat-card-hover border border-white/[0.06] bg-zinc-900/80 ${className}`}>
      <Card.Content className="p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">
              {title}
            </p>
            <p className="text-2xl font-bold text-zinc-100 tracking-tight">
              {value}
            </p>
          </div>
          {Icon && (
            <div className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center ${iconBgClasses[color] || iconBgClasses.primary}`}>
              <Icon size={20} strokeWidth={2} />
            </div>
          )}
        </div>
        {trend !== undefined && (
          <div className="flex items-center gap-1.5">
            <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-md ${
              trend >= 0 
                ? 'text-emerald-400 bg-emerald-500/10' 
                : 'text-rose-400 bg-rose-500/10'
            }`}>
              {trend >= 0 ? '+' : ''}{trend}%
            </span>
            {trendLabel && (
              <span className="text-[11px] text-zinc-500">{trendLabel}</span>
            )}
          </div>
        )}
      </Card.Content>
    </Card>
  );
}
