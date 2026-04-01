import { useEffect } from 'react';
import { X, Check, Info, Trash2, Download } from 'lucide-react';

export default function Toast({ message, type = 'info', onClose, duration = 3000 }) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <Check size={18} />;
      case 'error':
        return <X size={18} />;
      case 'delete':
        return <Trash2 size={18} />;
      case 'export':
        return <Download size={18} />;
      case 'info':
      default:
        return <Info size={18} />;
    }
  };

  const getColors = () => {
    switch (type) {
      case 'success':
        return { bg: '#dcfce7', border: '#86efac', text: '#166534', icon: '#22c55e' };
      case 'error':
        return { bg: '#fee2e2', border: '#fca5a5', text: '#991b1b', icon: '#ef4444' };
      case 'delete':
        return { bg: '#fee2e2', border: '#fca5a5', text: '#991b1b', icon: '#ef4444' };
      case 'export':
        return { bg: '#dbeafe', border: '#93c5fd', text: '#0c2340', icon: '#3b82f6' };
      case 'info':
      default:
        return { bg: '#e0e7ff', border: '#a5b4fc', text: '#312e81', icon: '#6366f1' };
    }
  };

  const colors = getColors();

  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg animate-slide-in"
      style={{
        backgroundColor: colors.bg,
        borderColor: colors.border,
        color: colors.text,
      }}
    >
      <div style={{ color: colors.icon }}>
        {getIcon()}
      </div>
      <span className="text-sm font-medium flex-1">{message}</span>
      <button
        onClick={onClose}
        className="p-1 hover:opacity-70 transition-opacity"
        style={{ color: colors.text }}
      >
        <X size={16} />
      </button>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slide-in {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
