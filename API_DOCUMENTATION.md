# Mock API Documentation

## Overview
This mock API service provides realistic API-like functionality with simulated network delays. It's perfect for development and testing without requiring a backend server.

## Features
- ✅ Realistic network delay simulation (500ms default)
- ✅ Proper async/await patterns
- ✅ Comprehensive error handling
- ✅ In-memory data persistence
- ✅ Response wrapping with success/error status
- ✅ Full CRUD operations
- ✅ Analytics and filtering capabilities

## Base Configuration
```javascript
// Default network delay
NETWORK_DELAY = 500ms

// Response format
{
  success: boolean,
  data: object | null,
  error: object | null,
  timestamp: string (ISO format)
}
```

---

## Transactions API

### GET - Fetch All Transactions
```javascript
import { getTransactions } from '@/services/api';

// Basic usage
const response = await getTransactions();

// With filters
const response = await getTransactions({
  type: 'Expense',           // Filter by type ('Income', 'Expense', 'All')
  category: 'Food',          // Filter by category
  status: 'Completed',       // Filter by status
  search: 'coffee',          // Search in description/merchant
  sortBy: 'date',            // Sort field
  sortOrder: 'desc',         // Sort order ('asc', 'desc')
  skip: 0,                   // Pagination offset
  limit: 10,                 // Pagination limit
});

// Response
{
  success: true,
  data: {
    transactions: [...],
    total: 50,
    count: 10
  },
  timestamp: "2026-04-02T..."
}
```

### GET - Fetch Transaction by ID
```javascript
const response = await getTransactionById('TXN-123456');

// Response
{
  success: true,
  data: {
    id: 'TXN-123456',
    description: 'Grocery shopping',
    amount: 45.99,
    ...
  }
}
```

### POST - Create Transaction
```javascript
const response = await createTransaction({
  date: '2026-04-02',
  type: 'Expense',
  description: 'Coffee',
  amount: 5.50,
  category: 'Food',
  merchant: 'Starbucks',
  status: 'Completed'
});

// Response
{
  success: true,
  data: {
    message: 'Transaction created successfully',
    transaction: {
      id: 'TXN-1712086439382-abc123',
      date: '2026-04-02',
      ...
    }
  }
}
```

### PUT - Update Transaction
```javascript
const response = await updateTransaction('TXN-123456', {
  description: 'Updated description',
  amount: 50.00,
  status: 'Pending'
});

// Response
{
  success: true,
  data: {
    message: 'Transaction updated successfully',
    transaction: { /* updated transaction */ }
  }
}
```

### DELETE - Delete Transaction
```javascript
const response = await deleteTransaction('TXN-123456');

// Response
{
  success: true,
  data: {
    message: 'Transaction deleted successfully',
    transaction: { /* deleted transaction */ }
  }
}
```

### DELETE - Delete Multiple Transactions
```javascript
const response = await deleteTransactions([
  'TXN-123456',
  'TXN-789012',
  'TXN-345678'
]);

// Response
{
  success: true,
  data: {
    message: '3 transaction(s) deleted successfully',
    count: 3,
    transactions: [...]
  }
}
```

---

## Analytics API

### GET - Fetch Analytics Dashboard Data
```javascript
import { getAnalytics } from '@/services/api';

const response = await getAnalytics();

// Response
{
  success: true,
  data: {
    totalIncome: 5000,
    totalExpense: 2500,
    balance: 2500,
    transactionCount: 50,
    savingsRate: "50.0",
    categoryBreakdown: {
      'Food': 800,
      'Transport': 600,
      'Entertainment': 1100,
      ...
    }
  }
}
```

### GET - Fetch Monthly Trend
```javascript
import { getMonthlyTrend } from '@/services/api';

const response = await getMonthlyTrend();

// Response
{
  success: true,
  data: [
    {
      month: 'Jan 2026',
      income: 5000,
      expense: 2000,
      balance: 3000
    },
    {
      month: 'Feb 2026',
      income: 5200,
      expense: 2300,
      balance: 2900
    },
    ...
  ]
}
```

### GET - Get Transactions by Category
```javascript
import { getTransactionsByCategory } from '@/services/api';

const response = await getTransactionsByCategory();

// Response
{
  success: true,
  data: {
    'Food': {
      count: 15,
      total: 800,
      income: 0,
      expense: 800
    },
    'Transport': {
      count: 8,
      total: 600,
      income: 0,
      expense: 600
    },
    ...
  }
}
```

---

## Utility APIs

### GET - Database Statistics
```javascript
import { getDatabaseStats } from '@/services/api';

const response = await getDatabaseStats();

// Response
{
  success: true,
  data: {
    totalTransactions: 50,
    databaseSize: '12345 bytes',
    lastUpdated: '2026-04-02T...'
  }
}
```

### POST - Reset Database
```javascript
import { resetDatabase } from '@/services/api';

const response = await resetDatabase();

// Response
{
  success: true,
  data: {
    message: 'Database reset to mock data successfully',
    count: 50
  }
}
```

### GET - Export Transactions as JSON
```javascript
import { exportTransactionsJSON } from '@/services/api';

const response = await exportTransactionsJSON({
  type: 'Expense',
  sortBy: 'date',
  sortOrder: 'desc'
});

// Response
{
  success: true,
  data: {
    exportDate: '2026-04-02T...',
    totalCount: 50,
    transactions: [...]
  }
}
```

---

## Integration with Zustand Store

### Using the Store with API
```javascript
import useStore from '@/store/useStore';

export default function TransactionsPage() {
  const {
    transactions,
    isTransactionLoading,
    transactionError,
    fetchTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  } = useStore();

  // Fetch on mount
  useEffect(() => {
    fetchTransactions({ type: 'All' });
  }, []);

  // Create
  const handleCreate = async (data) => {
    const response = await addTransaction(data);
    if (response.success) {
      console.log('Created:', response.data.transaction);
    } else {
      console.error('Error:', response.error);
    }
  };

  // Update
  const handleUpdate = async (id, data) => {
    const response = await updateTransaction(id, data);
    if (response.success) {
      console.log('Updated:', response.data.transaction);
    }
  };

  // Delete
  const handleDelete = async (id) => {
    const response = await deleteTransaction(id);
    if (response.success) {
      console.log('Deleted');
    }
  };

  return (
    <>
      {isTransactionLoading && <div>Loading...</div>}
      {transactionError && <div>Error: {transactionError}</div>}
      {transactions.map(tx => (
        <div key={tx.id}>{tx.description}</div>
      ))}
    </>
  );
}
```

---

## Error Handling

### Response Error Format
```javascript
{
  success: false,
  data: null,
  error: {
    message: "Transaction with id XYZ not found",
    details: "..."
  },
  timestamp: "2026-04-02T..."
}
```

### Try-Catch Pattern
```javascript
try {
  const response = await createTransaction(data);
  
  if (response.success) {
    // Handle success
    console.log(response.data);
  } else {
    // Handle API error
    console.error(response.error.message);
  }
} catch (error) {
  // Handle network or unexpected errors
  console.error(error.message);
}
```

---

## Best Practices

1. **Always check response.success** before accessing response.data
2. **Use try-catch** for unexpected errors
3. **Handle loading states** with isTransactionLoading, analyticsLoading, etc.
4. **Handle error states** with transactionError, analyticsError, etc.
5. **Use filters** to optimize data fetching
6. **Pagination** for large datasets using skip/limit
7. **Debounce** search requests for better UX

---

## Configuration

### Adjusting Network Delay
Edit `src/services/api.js`:
```javascript
const NETWORK_DELAY = 1000; // Increase to 1 second for slower simulation
```

### Future Backend Integration
When switching to a real backend:
1. Replace API functions with actual HTTP calls (axios, fetch)
2. Update base URL in `src/services/index.js`
3. Keep the same response format for drop-in compatibility
4. Update error handling as needed

---

## Example: Complete CRUD Flow

```javascript
// Create
const createRes = await addTransaction({
  date: '2026-04-02',
  type: 'Expense',
  description: 'New expense',
  amount: 100,
  category: 'Food',
  merchant: 'Restaurant',
});
const txId = createRes.data.transaction.id;

// Read
const readRes = await getTransactionById(txId);
console.log(readRes.data);

// Update
const updateRes = await updateTransaction(txId, {
  amount: 150,
  description: 'Updated expense',
});

// Delete
const deleteRes = await deleteTransaction(txId);
```
