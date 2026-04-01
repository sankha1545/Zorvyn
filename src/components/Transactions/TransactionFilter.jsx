import { X } from 'lucide-react';
import Button from '../ui/Button';

export default function TransactionFilter({
  typeFilter,
  categoryFilter,
  statusFilter,
  onTypeChange,
  onCategoryChange,
  onStatusChange,
  onClearFilters,
  typeOptions,
  categoryOptions,
  statusOptions,
  hasActiveFilters,
}) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {/* Type Filter */}
        <div>
          <select
            value={typeFilter}
            onChange={(e) => onTypeChange(e.target.value)}
            style={{
              backgroundColor: 'var(--bg-input)',
              borderColor: 'var(--border-input)',
              borderWidth: '1px',
              color: 'var(--text-primary)',
              fontWeight: '500',
              padding: '6px 12px',
            }}
            className="rounded-xl text-xs cursor-pointer outline-none transition-all"
            onFocus={(e) => {
              e.target.style.borderColor = '#6366f1';
              e.target.style.backgroundColor = 'var(--bg-surface-hover)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--border-input)';
              e.target.style.backgroundColor = 'var(--bg-input)';
            }}
          >
            {typeOptions.map((opt) => (
              <option 
                key={opt} 
                value={opt}
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  color: 'var(--text-primary)',
                  padding: '8px',
                  lineHeight: '1.5',
                }}
              >
                {opt === 'All' ? 'All Types' : opt}
              </option>
            ))}
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <select
            value={categoryFilter}
            onChange={(e) => onCategoryChange(e.target.value)}
            style={{
              backgroundColor: 'var(--bg-input)',
              borderColor: 'var(--border-input)',
              borderWidth: '1px',
              color: 'var(--text-primary)',
              fontWeight: '500',
              padding: '6px 12px',
            }}
            className="rounded-xl text-xs cursor-pointer outline-none transition-all"
            onFocus={(e) => {
              e.target.style.borderColor = '#6366f1';
              e.target.style.backgroundColor = 'var(--bg-surface-hover)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--border-input)';
              e.target.style.backgroundColor = 'var(--bg-input)';
            }}
          >
            {categoryOptions.map((opt) => (
              <option 
                key={opt} 
                value={opt}
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  color: 'var(--text-primary)',
                  padding: '8px',
                  lineHeight: '1.5',
                }}
              >
                {opt === 'All' ? 'All Categories' : opt}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            style={{
              backgroundColor: 'var(--bg-input)',
              borderColor: 'var(--border-input)',
              borderWidth: '1px',
              color: 'var(--text-primary)',
              fontWeight: '500',
              padding: '6px 12px',
            }}
            className="rounded-xl text-xs cursor-pointer outline-none transition-all"
            onFocus={(e) => {
              e.target.style.borderColor = '#6366f1';
              e.target.style.backgroundColor = 'var(--bg-surface-hover)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--border-input)';
              e.target.style.backgroundColor = 'var(--bg-input)';
            }}
          >
            {statusOptions.map((opt) => (
              <option 
                key={opt} 
                value={opt}
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  color: 'var(--text-primary)',
                  padding: '8px',
                  lineHeight: '1.5',
                }}
              >
                {opt === 'All' ? 'All Status' : opt}
              </option>
            ))}
          </select>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <Button
            variant="secondary"
            size="sm"
            onClick={onClearFilters}
            className="gap-1"
          >
            <X size={14} />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}
