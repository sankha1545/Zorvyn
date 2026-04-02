import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../ui/Button';

export default function TransactionPagination({
  currentPage,
  totalPages,
  onPageChange,
}) {
  return (
    <div className="flex items-center justify-center gap-2 py-4 flex-wrap">
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-4px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .pagination-btn {
          transition: all 0.2s ease-in-out;
        }
        .pagination-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .pagination-btn:active:not(:disabled) {
          transform: translateY(0);
        }
        .page-number {
          animation: slideIn 0.2s ease-out;
        }
      `}</style>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="pagination-btn"
      >
        <ChevronLeft size={16} />
        Previous
      </Button>

      <div className="flex gap-1 flex-wrap justify-center">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all page-number"
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
        className="pagination-btn"
      >
        Next
        <ChevronRight size={16} />
      </Button>
    </div>
  );
}
