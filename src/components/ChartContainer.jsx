import { Card } from '@heroui/react';
import { ResponsiveContainer } from 'recharts';

export default function ChartContainer({ title, subtitle, children, action, className = '' }) {
  return (
    <Card className={`border border-white/[0.06] bg-zinc-900/80 ${className}`}>
      <Card.Header className="flex flex-row items-center justify-between px-5 pt-5 pb-0">
        <div>
          <Card.Title className="text-sm font-semibold text-zinc-100">{title}</Card.Title>
          {subtitle && (
            <Card.Description className="text-xs text-zinc-500 mt-0.5">{subtitle}</Card.Description>
          )}
        </div>
        {action && <div>{action}</div>}
      </Card.Header>
      <Card.Content className="px-2 pb-4 pt-2">
        <div className="w-full h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            {children}
          </ResponsiveContainer>
        </div>
      </Card.Content>
    </Card>
  );
}
