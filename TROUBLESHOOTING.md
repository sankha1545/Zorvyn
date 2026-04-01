# Mock API Troubleshooting Guide

## Common Issues & Solutions

---

## Issue: API Call Hangs or Seems Stuck

### Symptoms
- Component shows loading state indefinitely
- No response received from API call
- Application appears frozen

### Solutions

**1. Check Network Delay Simulation**
```javascript
// The API has a 500ms default network delay
// Wait a bit longer than normal for responses

// If needed, adjust in src/services/api.js:
const NETWORK_DELAY = 1000; // Increase if still hanging
```

**2. Verify Async/Await Usage**
```javascript
// ❌ Wrong - missing await
fetchTransactions();

// ✅ Correct
await fetchTransactions();

// ✅ Correct - using .then()
fetchTransactions().then(response => {
  if (response.success) { /* ... */ }
});
```

**3. Check useEffect Dependencies**
```javascript
// ❌ Wrong - missing dependency causes infinite loop
useEffect(() => {
  fetchTransactions();
}, []); // fetch not in dependency array

// ✅ Correct
const { fetchTransactions } = useTransactions();
useEffect(() => {
  fetchTransactions();
}, [fetchTransactions]); // Include dependency
```

---

## Issue: "response.success is undefined"

### Symptoms
- Error: Cannot read property 'success' of undefined
- API response is null or undefined
- Accessing null properties fails

### Causes & Solutions

**1. Missing Error Handling**
```javascript
// ❌ Wrong
const response = await create(data);
console.log(response.success); // Might be undefined!

// ✅ Correct
const response = await create(data);
if (response && response.success) {
  console.log('Success');
}
```

**2. Not Awaiting Promise**
```javascript
// ❌ Wrong
const response = create(data); // Not awaited!
console.log(response.success); // Promise, not response

// ✅ Correct
const response = await create(data);
console.log(response.success);
```

**3. Not Wrapping in Try-Catch**
```javascript
// ❌ Can crash if error occurs
const response = await create(data);

// ✅ Safe
try {
  const response = await create(data);
  if (response.success) { /* ... */ }
} catch (error) {
  console.error('Error:', error);
}
```

---

## Issue: Data Not Updating in Components

### Symptoms
- Create transaction but list doesn't show new item
- Update transaction but UI doesn't reflect changes
- Delete works but deleted item still shows

### Solutions

**1. Not Using Hook or Store Correctly**
```javascript
// ❌ Wrong - using imported functions directly
import { createTransaction } from '@/services/api';
const response = await createTransaction(data); // State not updated!

// ✅ Correct - use hook
const { create } = useTransactions();
const response = await create(data); // State automatically updated
```

**2. Not Refreshing Data After Create/Update/Delete**
```javascript
// ❌ Data doesn't update automatically for all operations
const response = await create(data);

// ✅ Better - refetch to ensure sync
const response = await create(data);
if (response.success) {
  await fetch(); // Refetch to update list
}
```

**3. Stale State Reference**
```javascript
// ❌ Old state captured in closure
const handleDelete = (id) => {
  deleteTransaction(id); // Uses old state
};

// ✅ Get fresh state
const handleDelete = (id) => {
  const store = useStore();
  store.deleteTransaction(id);
};
```

---

## Issue: "Cannot read property 'transactions' of undefined"

### Symptoms
- Error accessing transactions from store
- Store methods not available
- Components can't access state properties

### Solutions

**1. Import Hook Incorrectly**
```javascript
// ❌ Wrong
import useStore from '@/store';

// ✅ Correct
import useStore from '@/store/useStore';
```

**2. Not Calling Hook at Component Root**
```javascript
// ❌ Wrong - hook called in conditional
if (condition) {
  const { transactions } = useTransactions(); // Invalid!
}

// ✅ Correct - hook at component top
export default function Component() {
  const { transactions } = useTransactions();
  
  if (condition) {
    // Now you can use transactions
  }
}
```

**3. Using Outside Function Component**
```javascript
// ❌ Wrong - can't use hook in regular function
function regularFunction() {
  const { transactions } = useTransactions(); // Invalid!
}

// ✅ Correct - only in React components
export default function MyComponent() {
  const { transactions } = useTransactions();
}
```

---

## Issue: Transaction IDs Keep Changing or Are Invalid

### Symptoms
- Transaction ID format is inconsistent
- Can't find transaction by ID after creating
- Transaction ID is "undefined"

### Solutions

**1. Check ID Generation**
```javascript
// Correct ID format: TXN-{timestamp}-{random}
// Example: TXN-1712086439382-abc123

// ✅ IDs are auto-generated in API, don't pass custom IDs
const response = await create({
  // Don't include 'id' - it's auto-generated
  description: 'Coffee',
  amount: 5.50,
  // ...
});
```

**2. Accessing ID from Response**
```javascript
// ✅ Correct way to get created transaction ID
const response = await create(data);
if (response.success) {
  const newId = response.data.transaction.id;
  console.log('Created:', newId);
}
```

**3. Transaction Not in State After Create**
```javascript
// ✅ If transaction not immediately visible:
const response = await create(data);
if (response.success) {
  // Transaction should be automatically added to state
  // If not, manually refresh:
  await fetch();
}
```

---

## Issue: Filters Not Working

### Symptoms
- Filter results don't match filter criteria
- Search doesn't narrow results
- Sort order not applied

### Solutions

**1. Incorrect Filter Format**
```javascript
// ❌ Wrong - passing invalid filter values
await fetch({
  type: 'expense' // Should be capitalized
});

// ✅ Correct - proper case and values
await fetch({
  type: 'Expense', // or 'Income' or 'All'
  category: 'Food',
  status: 'Completed',
  search: 'coffee',
  sortBy: 'date',
  sortOrder: 'desc'
});
```

**2. Not Debouncing Search**
```javascript
// ❌ Inefficient - API called on every character
const handleSearchChange = (e) => {
  fetch({ search: e.target.value });
};

// ✅ Debounced - API called after user stops typing
const handleSearchChange = useCallback(
  debounce((value) => {
    fetch({ search: value });
  }, 300),
  [fetch]
);
```

**3. Pagination Parameters Wrong**
```javascript
// ❌ Wrong - negative values or missing setup
await fetch({
  skip: -1,
  limit: 0
});

// ✅ Correct - proper pagination values
await fetch({
  skip: (currentPage - 1) * pageSize, // Start from 0
  limit: pageSize // 10, 20, 50 etc
});
```

---

## Issue: Analytics/Dashboard Data Missing

### Symptoms
- Dashboard shows empty/null values
- Charts don't render
- Statistics are "undefined"

### Solutions

**1. Not Fetching Analytics on Mount**
```javascript
// ❌ Missing initialization
export default function Dashboard() {
  const { analytics } = useAnalytics();
  // analytics is null!
}

// ✅ Correct - fetch on mount
export default function Dashboard() {
  const { analytics, loadAnalytics } = useAnalytics();
  
  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);
}
```

**2. Accessing Properties Before Data Loaded**
```javascript
// ❌ Wrong - data might not be loaded yet
const { analytics } = useAnalytics();
const income = analytics.totalIncome; // Might be undefined!

// ✅ Correct - check state first
const { analytics, analyticsLoading } = useAnalytics();
if (analyticsLoading) return <div>Loading...</div>;
const income = analytics?.totalIncome || 0;
```

**3. Not Handling Error States**
```javascript
// ❌ Doesn't show errors
const { analytics } = useAnalytics();

// ✅ Complete error handling
const { analytics, analyticsError, analyticsLoading } = useAnalytics();

if (analyticsLoading) return <div>Loading...</div>;
if (analyticsError) return <div>Error: {analyticsError}</div>;
if (!analytics) return <div>No data</div>;

return <div>${analytics.totalIncome}</div>;
```

---

## Issue: Store Not Persisting Data

### Symptoms
- Data loads but disappears on refresh
- Transactions lost when navigating
- State resets unexpectedly

### Solutions

**1. Store Data Resets on Navigation**
```javascript
// This is EXPECTED behavior for mock API
// Store only persists in memory during session
// On page refresh, reinitialize with mock data

// To persist across sessions, use localStorage:
// (Not implemented in current mock API)
```

**2. Verify Data After Operations**
```javascript
// ✅ Check Zustand store directly
import useStore from '@/store/useStore';

const { transactions } = useStore();
console.log('Current transactions:', transactions);
```

**3. Reset Database If Corrupted**
```javascript
// If data seems corrupted, reset:
import { resetDatabase } from '@/services/api';

const response = await resetDatabase();
if (response.success) {
  // Then reinitialize
  const store = useStore();
  await store.initializeTransactions();
}
```

---

## Issue: Performance Issues - Slow Loading

### Symptoms
- Page loads slowly
- API calls take too long
- UI is laggy

### Solutions

**1. Network Delay Too Long**
```javascript
// Current: 500ms (simulates real backend)
// If too slow for development, reduce in src/services/api.js:

const NETWORK_DELAY = 200; // Faster for testing
```

**2. Loading Too Much Data**
```javascript
// ❌ Fetching all 1000 transactions
await fetch({ limit: 1000 });

// ✅ Limit results
await fetch({ limit: 50 });

// ✅ Or use pagination
await fetch({ skip: 0, limit: 20 });
```

**3. Re-rendering Too Often**
```javascript
// ❌ Causes re-render on every keystroke
const handleChange = (e) => {
  fetch({ search: e.target.value });
};

// ✅ Debounce to reduce API calls
const debouncedFetch = useCallback(
  debounce(fetch, 300),
  [fetch]
);

const handleChange = (e) => {
  debouncedFetch({ search: e.target.value });
};
```

---

## Issue: Batch Delete Not Working

### Symptoms
- Deleting multiple transactions fails
- Batch delete returns error
- Only single delete works

### Solutions

**1. Correct Batch Delete Syntax**
```javascript
// ❌ Wrong - passing single ID
await deleteTransaction('TXN-123'); // Single delete

// ✅ Correct - use deleteTransactions (plural) for batch
import { deleteTransactions } from '@/services/api';

await deleteTransactions([
  'TXN-123',
  'TXN-456',
  'TXN-789'
]);
```

**2. Verify IDs Before Delete**
```javascript
// ✅ Check IDs are valid
const ids = selectedTransactions.map(t => t.id);
console.log('Deleting IDs:', ids);

if (ids.length === 0) {
  console.error('No transactions selected');
  return;
}

const response = await deleteTransactions(ids);
```

---

## Issue: Export/Backup Not Working

### Symptoms
- Export returns empty
- Exported JSON is invalid
- Export doesn't respect filters

### Solutions

**1. Use Correct Export Function**
```javascript
// ❌ Wrong - no export in hook
const { download } = useTransactions(); // Doesn't exist

// ✅ Correct - use direct API
import { exportTransactionsJSON } from '@/services/api';

const response = await exportTransactionsJSON({
  type: 'Expense',
  category: 'Food'
});

// Download the exported data
const data = JSON.stringify(response.data, null, 2);
```

**2. Save Exported JSON**
```javascript
// ✅ Complete export flow
const response = await exportTransactionsJSON();
if (response.success) {
  // Create blob and download
  const blob = new Blob(
    [JSON.stringify(response.data, null, 2)],
    { type: 'application/json' }
  );
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `transactions-${Date.now()}.json`;
  link.click();
}
```

---

## Debugging Checklist

- [ ] Check browser console for errors
- [ ] Verify all function calls are awaited
- [ ] Confirm response has `success` property
- [ ] Check loading states are correct
- [ ] Verify IDs are valid format
- [ ] Ensure hooks are called at component root
- [ ] Check filter values match expected format
- [ ] Verify data refreshes after operations
- [ ] Test with DevTools Network tab
- [ ] Check Zustand store state directly

---

## Getting Help

### Enable Logging
```javascript
// Add logging to track API calls
const response = await fetch({ type: 'Expense' });
console.log('API Response:', response);
console.log('Success:', response.success);
console.log('Data:', response.data);
console.log('Error:', response.error);
```

### Check Store State
```javascript
import useStore from '@/store/useStore';

// In any component
const state = useStore();
console.log('Store State:', state);
console.table(state.transactions); // Pretty print transactions
```

### Test API Directly
```javascript
import { getTransactions } from '@/services/api';

// In browser console
getTransactions().then(res => console.log(res));
```

### Create Test Data
```javascript
// Add test transaction to verify API
const response = await create({
  date: '2026-04-02',
  type: 'Expense',
  description: 'TEST - Delete me',
  amount: 9.99,
  category: 'Testing',
  status: 'Completed'
});
console.log('Test transaction:', response.data);
```
