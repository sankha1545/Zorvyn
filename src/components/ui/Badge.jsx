import React from 'react';

const Badge = React.forwardRef(
  (
    {
      children,
      variant = 'default',
      className = '',
      ...props
    },
    ref
  ) => {
    const variants = {
      default: {
        backgroundColor: 'var(--bg-input)',
        borderColor: 'var(--border-input)',
        color: 'var(--text-secondary)',
      },
      success: {
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderColor: 'rgba(34, 197, 94, 0.3)',
        color: '#22c55e',
      },
      warning: {
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        borderColor: 'rgba(245, 158, 11, 0.3)',
        color: '#f59e0b',
      },
      danger: {
        backgroundColor: 'rgba(244, 63, 94, 0.1)',
        borderColor: 'rgba(244, 63, 94, 0.3)',
        color: '#f43f5e',
      },
    };

    const style = variants[variant] || variants.default;

    return (
      <span
        ref={ref}
        className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${className}`}
        style={{
          ...style,
          borderWidth: '1px',
        }}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export default Badge;
