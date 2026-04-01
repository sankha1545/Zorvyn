import React from 'react';

const buttonVariants = {
  primary: {
    default: {
      bg: 'bg-gradient-to-r from-indigo-500 to-violet-600',
      hover: 'hover:from-indigo-600 hover:to-violet-700',
      text: 'text-white',
      shadow: 'shadow-lg shadow-indigo-500/25',
    },
    disabled: {
      bg: 'bg-gradient-to-r from-indigo-500/50 to-violet-600/50',
      hover: '',
      text: 'text-white/50',
      shadow: 'shadow-none',
    },
  },
  secondary: {
    base: {
      backgroundColor: 'var(--bg-input)',
      borderColor: 'var(--border-input)',
      color: 'var(--text-secondary)',
    },
    hover: {
      backgroundColor: 'var(--bg-surface)',
      color: 'var(--text-primary)',
    },
  },
  danger: {
    base: {
      backgroundColor: 'rgba(244, 63, 94, 0.1)',
      color: '#f43f5e',
      borderColor: 'rgba(244, 63, 94, 0.2)',
    },
    hover: {
      backgroundColor: 'rgba(244, 63, 94, 0.2)',
    },
  },
};

const Button = React.forwardRef(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      disabled = false,
      className = '',
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    };

    if (variant === 'primary') {
      const styles = disabled
        ? buttonVariants.primary.disabled
        : buttonVariants.primary.default;

      return (
        <button
          ref={ref}
          disabled={disabled}
          className={`inline-flex items-center gap-2 rounded-xl font-medium transition-all cursor-pointer ${sizeClasses[size]} ${styles.bg} ${styles.hover} ${styles.text} ${styles.shadow} ${disabled ? 'disabled:cursor-not-allowed' : ''} ${className}`}
          {...props}
        >
          {children}
        </button>
      );
    }

    if (variant === 'secondary') {
      return (
        <button
          ref={ref}
          disabled={disabled}
          className={`inline-flex items-center gap-2 rounded-xl font-medium transition-all cursor-pointer border ${sizeClasses[size]} ${className}`}
          style={{
            ...buttonVariants.secondary.base,
            borderWidth: '1px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor =
              buttonVariants.secondary.hover.backgroundColor;
            e.currentTarget.style.color =
              buttonVariants.secondary.hover.color;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor =
              buttonVariants.secondary.base.backgroundColor;
            e.currentTarget.style.color =
              buttonVariants.secondary.base.color;
          }}
          {...props}
        >
          {children}
        </button>
      );
    }

    if (variant === 'danger') {
      return (
        <button
          ref={ref}
          disabled={disabled}
          className={`inline-flex items-center gap-2 rounded-xl font-medium transition-all cursor-pointer border ${sizeClasses[size]} ${className}`}
          style={{
            ...buttonVariants.danger.base,
            borderWidth: '1px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor =
              buttonVariants.danger.hover.backgroundColor;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor =
              buttonVariants.danger.base.backgroundColor;
          }}
          {...props}
        >
          {children}
        </button>
      );
    }

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={`inline-flex items-center gap-2 rounded-xl font-medium transition-all cursor-pointer ${sizeClasses[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
