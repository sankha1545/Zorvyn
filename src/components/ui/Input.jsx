import React from 'react';

const Input = React.forwardRef(
  (
    {
      type = 'text',
      placeholder = '',
      value = '',
      onChange = () => {},
      onFocus = () => {},
      onBlur = () => {},
      disabled = false,
      className = '',
      icon: Icon = null,
      ...props
    },
    ref
  ) => {
    return (
      <div className="relative">
        {Icon && (
          <Icon
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: 'var(--text-muted)' }}
          />
        )}
        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={(e) => {
            e.target.style.borderColor = '#6366f1';
            onFocus(e);
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'var(--border-input)';
            onBlur(e);
          }}
          disabled={disabled}
          className={`w-full rounded-xl px-3 py-2 text-sm outline-none transition-all ${Icon ? 'pl-9' : ''} ${className}`}
          style={{
            backgroundColor: 'var(--bg-input)',
            borderColor: 'var(--border-input)',
            borderWidth: '1px',
            color: 'var(--text-primary)',
          }}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
