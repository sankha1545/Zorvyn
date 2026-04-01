# Implementation Guide: Using Mock API

## Quick Start

This guide shows you how to integrate the mock API into your components.

---

## Step 1: Initialize App

Update `src/App.jsx` to load initial data:

```javascript
import { useEffect } from 'react';
import useStore from './store/useStore';
import { Layout } from './components/Layout';

export default function App() {
  const { initializeTransactions } = useStore();

  // Load initial data on mount
  useEffect(() => {
    initializeTransactions();
  }, [initializeTransactions]);

  return <Layout />;
}
```

---

## Step 2: Using Transactions in Components

### Method 1: Using the Custom Hook (Recommended)

```javascript
import { useEffect } from 'react';
import { useTransactions } from '@/hooks';

export default function TransactionsList() {
  const { transactions, isLoading, error, fetch } = useTransactions();

  // Fetch on mount
  useEffect(() => {
    fetch({ type: 'All', limit: 10 });
  }, [fetch]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {transactions.map(tx => (
        <div key={tx.id}>{tx.description}</div>
      ))}
    </div>
  );
}
```

### Method 2: Direct Store Access

```javascript
import { useEffect } from 'react';
import useStore from '@/store/useStore';

export default function TransactionsList() {
  const {
    transactions,
    isTransactionLoading,
    transactionError,
    fetchTransactions,
  } = useStore();

  useEffect(() => {
    fetchTransactions({ type: 'All' });
  }, [fetchTransactions]);

  if (isTransactionLoading) return <div>Loading...</div>;
  if (transactionError) return <div>Error: {transactionError}</div>;

  return (
    <div>
      {transactions.map(tx => (
        <div key={tx.id}>{tx.description}</div>
      ))}
    </div>
  );
}
```

---

## Step 3: Handling CRUD Operations

### Create Transaction

```javascript
import { useTransactions } from '@/hooks';

export default function CreateTransactionForm() {
  const { create, isLoading } = useTransactions();

  const handleSubmit = async (formData) => {
    const response = await create({
      date: formData.date,
      type: 'Expense',
      description: formData.description,
      amount: parseFloat(formData.amount),
      category: formData.category,
      merchant: formData.merchant || '',
      status: 'Completed',
    });

    if (response.success) {
      console.log('Transaction created:', response.data.transaction);
      // Close modal, refresh list, show success message
    } else {
      console.error('Failed:', response.error);
      // Show error message
    }
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleSubmit(Object.fromEntries(new FormData(e.target)));
    }}>
      {/* form fields */}
      <button disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create'}
      </button>
    </form>
  );
}
```

### Update Transaction

```javascript
const handleUpdate = async (id, updates) => {
  const response = await update(id, updates);
  
  if (response.success) {
    console.log('Updated:', response.data.transaction);
  } else {
    console.error('Error:', response.error.message);
  }
};
```

### Delete Transaction

```javascript
const handleDelete = async (id) => {
  const response = await delete_(id);
  
  if (response.success) {
    console.log('Deleted successfully');
  } else {
    console.error('Error:', response.error.message);
  }
};
```

---

## Step 4: Using Analytics

```javascript
import { useEffect } from 'react';
import { useAnalytics } from '@/hooks';

export default function Dashboard() {
  const {
    analytics,
    monthlyTrend,
    analyticsLoading,
    analyticsError,
    loadAnalytics,
    loadTrend,
  } = useAnalytics();

  useEffect(() => {
    loadAnalytics();
    loadTrend();
  }, [loadAnalytics, loadTrend]);

  if (analyticsLoading) return <div>Loading analytics...</div>;
  if (analyticsError) return <div>Error: {analyticsError}</div>;

  return (
    <div>
      <div>Total Income: ${analytics?.totalIncome}</div>
      <div>Total Expense: ${analytics?.totalExpense}</div>
      <div>Balance: ${analytics?.balance}</div>
    </div>
  );
}
```

---

## Step 5: Filtering and Searching

```javascript
import { useState, useEffect } from 'react';
import { useTransactions } from '@/hooks';

export default function FilteredTransactions() {
  const { transactions, fetch, isLoading } = useTransactions();
  const [filters, setFilters] = useState({
    type: 'All',
    category: '',
    search: '',
    sortBy: 'date',
    sortOrder: 'desc',
  });

  // Fetch when filters change
  useEffect(() => {
    fetch(filters);
  }, [filters, fetch]);

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <input
        placeholder="Search..."
        onChange={(e) => handleFilterChange('search', e.target.value)}
      />
      <select onChange={(e) => handleFilterChange('type', e.target.value)}>
        <option value="All">All</option>
        <option value="Income">Income</option>
        <option value="Expense">Expense</option>
      </select>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div>
          {transactions.map(tx => (
            <div key={tx.id}>{tx.description}</div>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## Step 6: Pagination

```javascript
import { useState, useEffect } from 'react';
import { useTransactions } from '@/hooks';

export default function PaginatedTransactions() {
  const { fetch, isLoading } = useTransactions();
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    fetch({
      skip: (page - 1) * pageSize,
      limit: pageSize,
    });
  }, [page, fetch]);

  return (
    <div>
      {isLoading && <div>Loading...</div>}
      
      <div>
        <button onClick={() => setPage(p => Math.max(1, p - 1))}>
          Previous
        </button>
        <span>Page {page}</span>
        <button onClick={() => setPage(p => p + 1)}>Next</button>
      </div>
    </div>
  );
}
```

---

## Complete Example: Transactions Page

```javascript
import { useEffect, useState } from 'react';
import { useTransactions } from '@/hooks';
import { Button } from '@/components/ui';

export default function TransactionsPage() {
  const {
    transactions,
    isLoading,
    error,
    fetch,
    create,
    update,
    delete: deleteTransaction,
  } = useTransactions();

  const [filters, setFilters] = useState({
    type: 'All',
    search: '',
  });

  const [showCreateModal, setShowCreateModal] = useState(false);

  // Fetch on mount and when filters change
  useEffect(() => {
    fetch({ ...filters, limit: 50 });
  }, [filters, fetch]);

  const handleCreate = async (formData) => {
    const response = await create(formData);
    if (response.success) {
      setShowCreateModal(false);
      // Show success toast
    }
  };

  const handleUpdate = async (id, updates) => {
    const response = await update(id, updates);
    if (response.success) {
      // Show success toast
    }
  };

  const handleDelete = async (id) => {
    const response = await deleteTransaction(id);
    if (response.success) {
      // Show success toast
    }
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1>Transactions</h1>
        <Button onClick={() => setShowCreateModal(true)}>
          Add Transaction
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <input
          placeholder="Search..."
          value={filters.search}
          onChange={(e) =>
            setFilters(prev => ({ ...prev, search: e.target.value }))
          }
        />
        <select
          value={filters.type}
          onChange={(e) =>
            setFilters(prev => ({ ...prev, type: e.target.value }))
          }
        >
          <option value="All">All Types</option>
          <option value="Income">Income</option>
          <option value="Expense">Expense</option>
        </select>
      </div>

      {/* Status */}
      {isLoading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}

      {/* Results */}
      <div className="space-y-2">
        {transactions.map(tx => (
          <div key={tx.id} className="flex justify-between p-4 border rounded">
            <div>
              <div>{tx.description}</div>
              <div className="text-sm text-gray-500">{tx.category}</div>
            </div>
            <div className="flex gap-2 items-center">
              <span>${tx.amount}</span>
              <Button variant="secondary" onClick={() => handleUpdate(tx.id, {})}>
                Edit
              </Button>
              <Button variant="danger" onClick={() => handleDelete(tx.id)}>
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <CreateTransactionModal
          onCreate={handleCreate}
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </div>
  );
}
```

---

## Error Handling Best Practices

```javascript
// Always check response.success
const handleAction = async () => {
  try {
    const response = await create(data);
    
    if (response.success) {
      // Success case
      toast.success('Created successfully');
    } else {
      // API error case
      toast.error(response.error?.message || 'Unknown error');
    }
  } catch (error) {
    // Network or unexpected error
    toast.error('An unexpected error occurred');
    console.error(error);
  }
};
```

---

## Debugging Tips

### Check Loading States
```javascript
console.log('isLoading:', isLoading);
console.log('transactions:', transactions);
console.log('error:', error);
```

### Monitor API Calls
Open browser DevTools console to see API simulation logs:
```
Network delay simulation: 500ms
```

### Check Store State
```javascript
import useStore from '@/store/useStore';

const state = useStore();
console.log('Full store:', state);
```

---

## Next Steps

1. **Example Components**: See updated Transactions.jsx and Dashboard.jsx for complete implementations
2. **Toast Notifications**: Integrate your toast library into useApiNotification hook
3. **Error Boundaries**: Add React error boundaries for better error handling
4. **Loading UI**: Add spinners, skeletons, and loading states to improve UX
5. **Real Backend**: When ready, replace API functions with real HTTP calls keeping the same response format
