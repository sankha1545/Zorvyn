import { Card, Skeleton } from '@heroui/react';

export function StatCardSkeleton() {
  return (
    <Card 
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderColor: 'var(--border-subtle)',
        borderWidth: '1px',
      }}
    >
      <Card.Content className="p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex-1 space-y-2">
            <Skeleton className="w-24 h-3 rounded-lg" />
            <Skeleton className="w-32 h-7 rounded-lg" />
          </div>
          <Skeleton className="w-11 h-11 rounded-xl" />
        </div>
        <Skeleton className="w-20 h-4 rounded-md" />
      </Card.Content>
    </Card>
  );
}

export function ChartSkeleton() {
  return (
    <Card 
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderColor: 'var(--border-subtle)',
        borderWidth: '1px',
      }}
    >
      <Card.Content className="p-5">
        <Skeleton className="w-40 h-5 rounded-lg mb-1" />
        <Skeleton className="w-28 h-3 rounded-lg mb-4" />
        <Skeleton className="w-full h-[260px] rounded-xl" />
      </Card.Content>
    </Card>
  );
}

export function TableSkeleton() {
  return (
    <Card 
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderColor: 'var(--border-subtle)',
        borderWidth: '1px',
      }}
    >
      <Card.Content className="p-5 space-y-3">
        <div className="flex gap-3 mb-4">
          <Skeleton className="flex-1 h-10 rounded-lg" />
          <Skeleton className="w-32 h-10 rounded-lg" />
          <Skeleton className="w-32 h-10 rounded-lg" />
        </div>
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="w-full h-12 rounded-lg" />
        ))}
      </Card.Content>
    </Card>
  );
}
