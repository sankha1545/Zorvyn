import { X, Check, Trash2 } from 'lucide-react';
import useStore from '../../store/useStore';

export default function NotificationsModal({ isOpen, onClose }) {
  const notifications = useStore((s) => s.notifications);
  const markNotificationRead = useStore((s) => s.markNotificationRead);
  const clearNotifications = useStore((s) => s.clearNotifications);

  const handleMarkRead = (id) => {
    markNotificationRead(id);
  };

  const handleClearAll = () => {
    if (window.confirm('Clear all notifications?')) {
      clearNotifications();
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'transaction':
        return '💳';
      case 'budget':
        return '📊';
      case 'security':
        return '🔒';
      default:
        return '📢';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'transaction':
        return '#6366f1';
      case 'budget':
        return '#f59e0b';
      case 'security':
        return '#10b981';
      default:
        return '#8b5cf6';
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return timestamp.toLocaleDateString();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={onClose}
    >
      <div 
        className="w-full max-w-sm rounded-2xl shadow-2xl flex flex-col"
        style={{ 
          backgroundColor: 'var(--bg-surface)',
          maxHeight: '90vh',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: 'var(--border-subtle)' }}
        >
          <div>
            <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              Notifications
            </h3>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-opacity-10 rounded-lg transition-colors"
            style={{ color: 'var(--text-muted)' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <div 
                className="text-4xl mb-3"
                style={{ color: 'var(--text-muted)' }}
              >
                📭
              </div>
              <p style={{ color: 'var(--text-muted)' }} className="text-sm">
                No notifications yet
              </p>
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="p-4 hover:bg-opacity-50 transition-colors flex gap-3"
                  style={{
                    backgroundColor: notification.read ? 'transparent' : 'var(--bg-input)',
                  }}
                >
                  {/* Icon */}
                  <div className="text-xl mt-0.5 shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 
                        className="text-sm font-medium"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {notification.title}
                      </h4>
                      {!notification.read && (
                        <div 
                          className="w-2 h-2 rounded-full mt-1 shrink-0"
                          style={{ backgroundColor: '#6366f1' }}
                        />
                      )}
                    </div>
                    <p 
                      className="text-xs mt-1 truncate"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {notification.message}
                    </p>
                    <p 
                      className="text-xs mt-2"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {formatTime(notification.timestamp)}
                    </p>
                  </div>

                  {/* Action */}
                  {!notification.read && (
                    <button
                      onClick={() => handleMarkRead(notification.id)}
                      className="p-1 hover:bg-opacity-10 rounded transition-colors shrink-0"
                      style={{ color: '#6366f1' }}
                      title="Mark as read"
                    >
                      <Check size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div 
            className="flex flex-col-reverse sm:flex-row items-center sm:justify-between gap-2 px-6 py-4 border-t shrink-0 w-full"
            style={{ borderColor: 'var(--border-subtle)' }}
          >
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 rounded-xl text-sm font-medium transition-colors"
              style={{
                backgroundColor: 'var(--bg-hover)',
                color: 'var(--text-primary)',
              }}
            >
              Close
            </button>
            <button
              onClick={handleClearAll}
              className="w-full sm:w-auto px-4 py-2 rounded-xl text-sm font-medium flex items-center justify-center sm:justify-start gap-2 transition-colors"
              style={{
                backgroundColor: 'var(--bg-hover)',
                color: '#ef4444',
              }}
            >
              <Trash2 size={14} />
              Clear All
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
