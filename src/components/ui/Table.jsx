import React from 'react';
import { Table as HeroUITable } from '@heroui/react';

const Table = React.forwardRef(
  ({ children, className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`w-full rounded-xl overflow-hidden border ${className}`}
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--border-subtle)',
          borderWidth: '1px',
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Table.displayName = 'Table';

const TableHeader = React.forwardRef(
  ({ children, className = '', ...props }, ref) => {
    return (
      <thead
        ref={ref}
        className={className}
        {...props}
      >
        {children}
      </thead>
    );
  }
);

TableHeader.displayName = 'TableHeader';

const TableRow = React.forwardRef(
  ({ children, className = '', ...props }, ref) => {
    return (
      <tr
        ref={ref}
        className={`border-b transition-colors cursor-pointer ${className}`}
        style={{
          borderColor: 'var(--border-subtle)',
          borderBottomWidth: '1px',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--bg-input)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
        {...props}
      >
        {children}
      </tr>
    );
  }
);

TableRow.displayName = 'TableRow';

const TableHead = React.forwardRef(
  ({ children, className = '', ...props }, ref) => {
    return (
      <th
        ref={ref}
        className={`px-4 py-3 text-left font-medium text-xs ${className}`}
        style={{ color: 'var(--text-muted)' }}
        {...props}
      >
        {children}
      </th>
    );
  }
);

TableHead.displayName = 'TableHead';

const TableBody = React.forwardRef(
  ({ children, className = '', ...props }, ref) => {
    return (
      <tbody ref={ref} className={className} {...props}>
        {children}
      </tbody>
    );
  }
);

TableBody.displayName = 'TableBody';

const TableCell = React.forwardRef(
  ({ children, className = '', ...props }, ref) => {
    return (
      <td
        ref={ref}
        className={`px-4 py-3 text-sm ${className}`}
        style={{ color: 'var(--text-secondary)' }}
        {...props}
      >
        {children}
      </td>
    );
  }
);

TableCell.displayName = 'TableCell';

export {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
};

export default Table;
