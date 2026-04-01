# API Quick Reference

## Service Location
- **Main Service**: `src/services/api.js`
- **Service Index**: `src/services/index.js`
- **Store Integration**: `src/store/useStore.js`
- **Custom Hooks**: `src/hooks/useApi.js`

---

## Quick API Overview

| Endpoint | Method | Purpose | Usage |
|----------|--------|---------|-------|
| `getTransactions(filters)` | GET | Fetch transactions with filters/pagination | Fetch lists with filtering |
| `getTransactionById(id)` | GET | Fetch single transaction | Get transaction details |
| `createTransaction(data)` | POST | Create new transaction | Add transaction |
| `updateTransaction(id, data)` | PUT | Update transaction | Edit transaction |
| `deleteTransaction(id)` | DELETE | Delete transaction | Remove transaction |
| `deleteTransactions(ids)` | DELETE | Batch delete | Remove multiple |
| `getAnalytics()` | GET | Dashboard analytics | Income/expense stats |
| `getMonthlyTrend()` | GET | Monthly trend data | Chart data |
| `getTransactionsByCategory()` | GET | Category breakdown | Category stats |
| `getDatabaseStats()` | GET | Database info | DB size/count |
| `resetDatabase()` | POST | Reset to initial data | Reset all data |
| `exportTransactionsJSON(filters)` | GET | Export JSON | Backup/export |

---

## Store Methods (Zustand)

### Transaction Methods
```javascript
// Fetch
await fetchTransactions(filters?)
await initializeTransactions()

// CRUD
await addTransaction(data)
await updateTransaction(id, updates)
await deleteTransaction(id)

// Error handling
setTransactionError(error)
```

### Analytics Methods
```javascript
await fetchAnalytics()
await fetchMonthlyTrend()

setAnalyticsError(error)
setTrendError(error)
```

### States
```javascript
// Transactions
transactions         // Array of transactions
isTransactionLoading // Boolean
transactionError    // Error message or null

// Analytics
analytics           // Object with stats
analyticsLoading    // Boolean
analyticsError      // Error message or null

// Trend
monthlyTrend        // Array of monthly data
trendLoading        // Boolean
trendError          // Error message or null
```

---

## Custom Hooks (Recommended)

### useTransactions()
```javascript
const {
  transactions,
  isLoading,
  error,
  fetch,
  create,
  update,
  delete: delete_,
  clearError
} = useTransactions();
```

### useAnalytics()
```javascript
const {
  analytics,
  monthlyTrend,
  analyticsLoading,
  analyticsError,
  trendLoading,
  trendError,
  loadAnalytics,
  loadTrend
} = useAnalytics();
```

### useApiNotification()
```javascript
const {
  showError,
  showSuccess
} = useApiNotification();
```

---

## Common Patterns

### Fetch with Filters
```javascript
await fetchTransactions({
  type: 'Expense',
  category: 'Food',
  search: 'coffee',
  sortBy: 'date',
  sortOrder: 'desc',
  limit: 10,
  skip: 0
});
```

### Create and Refresh
```javascript
const response = await create(data);
if (response.success) {
  await fetch(); // Refresh list
}
```

### Update and Refresh
```javascript
const response = await update(id, data);
if (response.success) {
  // List updates automatically
}
```

### Error Handling
```javascript
try {
  const response = await create(data);
  if (response.success) {
    // Success
  } else {
    console.error(response.error.message);
  }
} catch (err) {
  console.error('Network error:', err);
}
```

---

## Filter Options

### Type Filter
- `'All'` - All transactions
- `'Income'` - Income only
- `'Expense'` - Expense only

### Sort Options
- `sortBy`: `'date'`, `'amount'`, `'description'`
- `sortOrder`: `'asc'`, `'desc'`

### Pagination
- `skip`: Offset (default: 0)
- `limit`: Number of results (default: 50)

### Search
- `search`: Text to search in description/merchant

### Category Filter
- `category`: Category name

### Status Filter
- `status`: `'Completed'`, `'Pending'`, `'Cancelled'`

---

## Response Format

### Success Response
```javascript
{
  success: true,
  data: { /* response data */ },
  error: null,
  timestamp: "2026-04-02T10:30:00Z"
}
```

### Error Response
```javascript
{
  success: false,
  data: null,
  error: {
    message: "Descriptive error message",
    details: "Additional details if available"
  },
  timestamp: "2026-04-02T10:30:00Z"
}
```

---

## Example: Complete Flow

```javascript
import { useEffect } from 'react';
import { useTransactions, useAnalytics } from '@/hooks';

export default function Dashboard() {
  const { 
    transactions, 
    isLoading, 
    error, 
    fetch, 
    create, 
    update, 
    delete: delete_ 
  } = useTransactions();
  
  const { 
    analytics, 
    loadAnalytics 
  } = useAnalytics();

  // Initialize on mount
  useEffect(() => {
    fetch();
    loadAnalytics();
  }, []);

  // Handlers
  const handleCreate = async () => {
    const response = await create({
      date: new Date().toISOString().split('T')[0],
      type: 'Expense',
      description: 'Test',
      amount: 100,
      category: 'Food',
      status: 'Completed'
    });
    
    if (response.success) {
      console.log('Created:', response.data.transaction);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Balance: ${analytics?.balance}</p>
      <button onClick={handleCreate}>Create</button>
      <ul>
        {transactions.map(tx => (
          <li key={tx.id}>{tx.description} - ${tx.amount}</li>
        ))}
      </ul>
    </div>
  );
}
```

---

## Debugging

### Check API Simulation
Opens browser DevTools console - you'll see:
```
Network delay simulation: 500ms completed
```

### Verify Data
```javascript
import useStore from '@/store/useStore';

const { transactions, analytics } = useStore();
console.log('Transactions:', transactions);
console.log('Analytics:', analytics);
```

### Test Direct API Call
```javascript
import { getTransactions } from '@/services/api';

const response = await getTransactions();
console.log(response);
```

---

## Future: Real Backend Integration

To switch to real API:

1. Update `src/services/api.js` to use fetch/axios
2. Replace `NETWORK_DELAY` with real HTTP calls
3. Update base URL in `src/services/index.js`
4. Keep response format the same
5. No changes needed in components!

Example:
```javascript
export const getTransactions = async (filters) => {
  try {
    const response = await fetch(`${BASE_URL}/transactions`, {
      params: filters
    });
    return response.json();
  } catch (error) {
    return { success: false, error: { message: error.message } };
  }
};
```
