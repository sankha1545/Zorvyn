import { Card } from '@heroui/react';
import { ResponsiveContainer } from 'recharts';

export default function ChartContainer({ title, subtitle, children, action, className = '' }) {
  return (
    <Card 
      className={className}
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderColor: 'var(--border-subtle)',
        borderWidth: '1px',
      }}
    >
      <Card.Header className="flex flex-row items-center justify-between px-5 pt-5 pb-0">
        <div>
          <Card.Title 
            className="text-sm font-semibold"
            style={{ color: 'var(--text-primary)' }}
          >
            {title}
          </Card.Title>
          {subtitle && (
            <Card.Description 
              className="text-xs mt-0.5"
              style={{ color: 'var(--text-muted)' }}
            >
              {subtitle}
            </Card.Description>
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
