import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../ui/Button';

export default function TransactionPagination({
  currentPage,
  totalPages,
  onPageChange,
}) {
  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        variant="secondary"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft size={16} />
        Previous
      </Button>

      <div className="flex gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
            style={{
              backgroundColor: currentPage === page ? '#6366f1' : 'var(--bg-input)',
              color: currentPage === page ? 'white' : 'var(--text-secondary)',
              borderColor: 'var(--border-input)',
              borderWidth: '1px',
            }}
            onMouseEnter={(e) => {
              if (currentPage !== page) {
                e.currentTarget.style.backgroundColor = 'var(--bg-surface)';
                e.currentTarget.style.color = 'var(--text-primary)';
              }
            }}
            onMouseLeave={(e) => {
              if (currentPage !== page) {
                e.currentTarget.style.backgroundColor = 'var(--bg-input)';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }
            }}
          >
            {page}
          </button>
        ))}
      </div>

      <Button
        variant="secondary"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
        <ChevronRight size={16} />
      </Button>
    </div>
  );
}
