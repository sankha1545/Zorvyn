# 📖 Implementation Guide - FinTrack

Step-by-step guide to implement features and integrate FinTrack components.

---

## 🚀 Getting Started

### 1. Project Setup

```bash
# Clone repository
git clone <url>
cd webapp

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The app will be available at `http://localhost:3000/`

---

## 🏗️ Using Transactions

### Step 1: Access Store

```javascript
import useStore from '@/store/useStore';

export default function MyComponent() {
  const transactions = useStore((s) => s.transactions);
  const addTransaction = useStore((s) => s.addTransaction);
  
  return (
    <div>
      {/* Component code */}
    </div>
  );
}
```

### Step 2: Fetch Transactions

```javascript
import { useEffect } from 'react';
import useStore from '@/store/useStore';

export default function TransactionList() {
  const transactions = useStore((s) => s.transactions);
  const fetchTransactions = useStore((s) => s.fetchTransactions);

  useEffect(() => {
    fetchTransactions({
      type: 'All',
      limit: 20
    });
  }, [fetchTransactions]);

  return (
    <div>
      {transactions.map(tx => (
        <div key={tx.id}>{tx.description} - ${tx.amount}</div>
      ))}
    </div>
  );
}
```

### Step 3: Create Transaction

```javascript
const handleCreate = async (formData) => {
  const createTransaction = useStore((s) => s.addTransaction);
  
  try {
    createTransaction({
      date: formData.date,
      description: formData.description,
      amount: parseFloat(formData.amount),
      category: formData.category,
      type: formData.type,
      merchant: formData.merchant,
      status: 'Completed'
    });
    
    // Success feedback
    showNotification('✅ Transaction created');
  } catch (error) {
    showError('Failed to create transaction');
  }
};
```

### Step 4: Update Transaction

```javascript
const handleUpdate = (id, updates) => {
  const updateTransaction = useStore((s) => s.updateTransaction);
  
  updateTransaction(id, {
    description: updates.description,
    amount: updates.amount,
    // Only include fields that changed
  });
  
  showNotification('✅ Transaction updated');
};
```

### Step 5: Delete Transaction

```javascript
const handleDelete = (id) => {
  if (window.confirm('Delete this transaction?')) {
    const deleteTransaction = useStore((s) => s.deleteTransaction);
    deleteTransaction(id);
    showNotification('🗑️ Transaction deleted');
  }
};
```

---

## 🎨 Using Components

### TransactionSearch

```javascript
import { TransactionSearch } from '@/components/Transactions';

export default function MyPage() {
  const [search, setSearch] = useState('');

  return (
    <TransactionSearch
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  );
}
```

### TransactionFilter

```javascript
import { TransactionFilter } from '@/components/Transactions';

export default function MyPage() {
  const [typeFilter, setTypeFilter] = useState('All');
  
  return (
    <TransactionFilter
      typeFilter={typeFilter}
      typeOptions={['All', 'Income', 'Expense']}
      onTypeChange={setTypeFilter}
      // ... other props
    />
  );
}
```

### TransactionTable

```javascript
import { TransactionTable } from '@/components/Transactions';

export default function MyPage() {
  const handleSort = (field) => {
    setSortField(field);
  };

  return (
    <TransactionTable
      transactions={transactions}
      sortField={sortField}
      sortDirection={sortDirection}
      onSort={handleSort}
      onEdit={handleEdit}
      onDelete={handleDelete}
      formatCurrency={formatCurrency}
      formatDate={formatDate}
    />
  );
}
```

---

## 🎯 Using Modals

### Create Transaction Modal

```javascript
import { useState } from 'react';
import CreateModal from '@/components/Modal/CreateModal';

export default function MyPage() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Add Transaction</button>
      <CreateModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={handleSubmit}
      />
    </>
  );
}
```

### Edit Modal

```javascript
import EditModal from '@/components/Modal/EditModal';

<EditModal
  isOpen={isEditOpen}
  initialData={selectedTransaction}
  onClose={() => setIsEditOpen(false)}
  onSubmit={handleUpdate}
/>
```

### Delete Modal

```javascript
import DeleteModal from '@/components/Modal/DeleteModal';

<DeleteModal
  isOpen={isDeleteOpen}
  title="Delete Transaction"
  message="Are you sure you want to delete this transaction?"
  onConfirm={handleConfirmDelete}
  onCancel={() => setIsDeleteOpen(false)}
/>
```

---

## 🔐 Role-Based Access Control

### Using RoleGuard

```javascript
import RoleGuard from '@/components/RoleGuard';

export default function AdminPanel() {
  return (
    <RoleGuard requiredRole="admin">
      <button>Delete All</button>
      <button>Export Data</button>
    </RoleGuard>
  );
}
```

### Checking Role in Logic

```javascript
const role = useStore((s) => s.role);

if (role === 'viewer') {
  // Hide edit/delete buttons
  return <ViewOnlyComponent />;
}

return <FullAccessComponent />;
```

---

## 🎨 Theming

### Apply Theme

```javascript
import useStore from '@/store/useStore';

export default function App() {
  const theme = useStore((s) => s.theme);
  const toggleTheme = useStore((s) => s.toggleTheme);

  return (
    <button onClick={toggleTheme}>
      {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
    </button>
  );
}
```

### Using Theme Colors in CSS

```javascript
// Access theme variables in styled components
const styles = {
  backgroundColor: 'var(--bg-surface)',
  color: 'var(--text-primary)',
  borderColor: 'var(--border-subtle)',
};

return <div style={styles}>Themed content</div>;
```

---

## 📊 Analytics

### Fetch and Display

```javascript
import { useEffect, useState } from 'react';
import { getAnalytics } from '@/services/api';

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getAnalytics().then(result => {
      if (result.success) {
        setStats(result.data);
      }
    });
  }, []);

  return (
    <div>
      <p>Balance: ${stats?.totalBalance}</p>
      <p>Income: ${stats?.totalIncome}</p>
      <p>Expenses: ${stats?.totalExpenses}</p>
    </div>
  );
}
```

### Display Trend Chart

```javascript
import { getMonthlyTrend } from '@/services/api';
import { LineChart, Line, XAxis, YAxis } from 'recharts';

export default function TrendChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getMonthlyTrend().then(result => {
      if (result.success) {
        setData(result.data);
      }
    });
  }, []);

  return (
    <LineChart data={data}>
      <XAxis dataKey="month" />
      <YAxis />
      <Line type="monotone" dataKey="income" stroke="#10b981" />
      <Line type="monotone" dataKey="expense" stroke="#ef4444" />
    </LineChart>
  );
}
```

---

## 🔍 Search & Filter

### Implement Global Search

```javascript
export default function TransactionPage() {
  const [search, setSearch] = useState('');
  const setGlobalSearch = useStore((s) => s.setGlobalSearch);

  useEffect(() => {
    // Debounce search
    const timer = setTimeout(() => {
      setGlobalSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search, setGlobalSearch]);

  return (
    <input
      type="text"
      placeholder="Search..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  );
}
```

### Apply Multiple Filters

```javascript
const filtered = transactions.filter(tx => {
  if (typeFilter !== 'All' && tx.type !== typeFilter) return false;
  if (categoryFilter !== 'All' && tx.category !== categoryFilter) return false;
  if (dateFrom && tx.date < dateFrom) return false;
  if (dateTo && tx.date > dateTo) return false;
  if (minAmount && tx.amount < minAmount) return false;
  if (maxAmount && tx.amount > maxAmount) return false;
  return true;
});
```

---

## 📤 Export to CSV

### Using CSV Export Utility

```javascript
import { exportToCSV } from '@/utils/csvExport';

const handleExport = () => {
  const data = filteredTransactions.map(tx => ({
    Date: tx.date,
    Description: tx.description,
    Amount: tx.amount,
    Category: tx.category,
    Type: tx.type,
    Status: tx.status,
  }));

  const filename = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
  exportToCSV(data, filename);
};
```

---

## 📱 Responsive Design

### Mobile-First Classes

```javascript
// Tailwind responsive design
<div className="p-4 sm:p-6 lg:p-8">
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    {/* Cards */}
  </div>
</div>
```

### Conditional Rendering

```javascript
const isMobile = window.innerWidth < 640;

return isMobile ? <MobileLayout /> : <DesktopLayout />;
```

---

## 🔔 Notifications

### Show Toast Message

```javascript
import Toast from '@/components/Toast';

const [toast, setToast] = useState(null);

const showNotification = (message, type = 'info') => {
  setToast({ message, type });
  setTimeout(() => setToast(null), 3000);
};

return (
  <>
    {toast && <Toast message={toast.message} type={toast.type} />}
  </>
);
```

### Notification Types

```javascript
setToast({ message: 'Success!', type: 'success' }); // ✅
setToast({ message: 'Error!', type: 'error' });     // ❌
setToast({ message: 'Info', type: 'info' });        // ℹ️
setToast({ message: 'Deleted', type: 'delete' });   // 🗑️
```

---

## 🧪 Testing Patterns

### Testing Store Actions

```javascript
import { renderHook, act } from '@testing-library/react';
import useStore from '@/store/useStore';

test('should add transaction', () => {
  const { result } = renderHook(() => useStore());

  act(() => {
    result.current.addTransaction({
      date: '2026-04-02',
      description: 'Test',
      amount: 10,
      category: 'Food & Dining',
      type: 'Expense'
    });
  });

  expect(result.current.transactions).toHaveLength(151);
});
```

---

**Last Updated:** April 2, 2026 | **Version:** 1.0
