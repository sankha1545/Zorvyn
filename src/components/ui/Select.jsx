import React from 'react';

const Select = React.forwardRef(
  (
    {
      value = '',
      onChange = () => {},
      options = [],
      placeholder = 'Select an option...',
      disabled = false,
      className = '',
      ...props
    },
    ref
  ) => {
    return (
      <select
        ref={ref}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full rounded-xl px-3 py-2 text-sm outline-none transition-all appearance-none cursor-pointer ${className}`}
        style={{
          backgroundColor: 'var(--bg-input)',
          borderColor: 'var(--border-input)',
          borderWidth: '1px',
          color: 'var(--text-primary)',
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236366f1' d='M6 9L1 4h10z'/%3E%3C/svg%3E\")",
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 10px center',
          paddingRight: '32px',
        }}
        onFocus={(e) => (e.target.style.borderColor = '#6366f1')}
        onBlur={(e) => (e.target.style.borderColor = 'var(--border-input)')}
        {...props}
      >
        {placeholder && !value && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }
);

Select.displayName = 'Select';

export default Select;
