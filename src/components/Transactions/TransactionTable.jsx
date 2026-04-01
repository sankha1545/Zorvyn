import { Pencil, Trash2, ArrowUpDown, ArrowUp, ArrowDown, FileText } from 'lucide-react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell, Badge } from '../ui';
import { Tooltip } from '@heroui/react';

export default function TransactionTable({
  transactions,
  sortField,
  sortDirection,
  onSort,
  onEdit,
  onDelete,
  formatCurrency,
  formatDate,
  showEmptyState = false,
}) {
  const renderSortIcon = (field) => {
    if (sortField !== field) {
      return <ArrowUpDown size={14} style={{ color: 'var(--text-muted)' }} />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp size={14} style={{ color: 'var(--text-primary)' }} />
    ) : (
      <ArrowDown size={14} style={{ color: 'var(--text-primary)' }} />
    );
  };

  const getStatusColor = (status) => {
    return status === 'Completed' ? 'success' : 'warning';
  };

  const getTypeColor = (type) => {
    return type === 'Income' ? 'success' : 'default';
  };

  if (showEmptyState || transactions.length === 0) {
    return (
      <div
        className="rounded-xl border p-8 flex flex-col items-center justify-center min-h-64"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--border-subtle)',
        }}
      >
        <FileText size={48} style={{ color: 'var(--text-muted)' }} className="mb-3" />
        <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
          No transactions found
        </p>
        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
          Try adjusting your filters or add a new transaction to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full">
        <TableHeader>
          <TableRow style={{ backgroundColor: 'var(--bg-input)' }}>
            <TableHead
              onClick={() => onSort('date')}
              className="cursor-pointer hover:opacity-75 transition-opacity flex items-center gap-1.5"
            >
              Date
              {renderSortIcon('date')}
            </TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead
              onClick={() => onSort('amount')}
              className="cursor-pointer hover:opacity-75 transition-opacity flex items-center gap-1.5"
            >
              Amount
              {renderSortIcon('amount')}
            </TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((tx) => (
            <TableRow key={tx.id}>
              <TableCell>
                <span style={{ color: 'var(--text-muted)' }}>{formatDate(tx.date)}</span>
              </TableCell>
              <TableCell>
                <div>
                  <p style={{ color: 'var(--text-primary)' }}>{tx.description}</p>
                  {tx.merchant && (
                    <p style={{ color: 'var(--text-dimmed)', fontSize: '0.75rem' }}>
                      {tx.merchant}
                    </p>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="default" className="text-xs">
                  {tx.category}
                </Badge>
              </TableCell>
              <TableCell
                style={{
                  color: tx.type === 'Income' ? '#22c55e' : '#ef4444',
                  fontWeight: '500',
                }}
              >
                {tx.type === 'Income' ? '+' : '-'}
                {formatCurrency(tx.amount)}
              </TableCell>
              <TableCell>
                <Badge variant={getTypeColor(tx.type)} className="text-xs">
                  {tx.type}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={getStatusColor(tx.status)} className="text-xs">
                  {tx.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Tooltip content="Edit" color="foreground">
                    <button
                      onClick={() => onEdit(tx)}
                      className="p-1.5 rounded-lg transition-all"
                      style={{ color: 'var(--text-secondary)' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#6366f1';
                        e.currentTarget.style.backgroundColor = 'rgba(99, 102, 241, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'var(--text-secondary)';
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <Pencil size={16} />
                    </button>
                  </Tooltip>
                  <Tooltip content="Delete" color="foreground">
                    <button
                      onClick={() => onDelete(tx.id)}
                      className="p-1.5 rounded-lg transition-all"
                      style={{ color: 'var(--text-secondary)' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#f43f5e';
                        e.currentTarget.style.backgroundColor = 'rgba(244, 63, 94, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'var(--text-secondary)';
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </Tooltip>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </table>
    </div>
  );
}
