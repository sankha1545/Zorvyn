# ⚡ API Quick Reference - FinTrack

Fast lookup for common API operations.

---

## 🚀 Quick API Reference

### Import

```javascript
import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getAnalytics,
  getMonthlyTrend,
} from '@/services/api';
```

---

## 📋 Transactions

### Get All

```javascript
const result = await getTransactions();
// or with filters
const result = await getTransactions({
  type: 'Expense',
  category: 'Food & Dining',
  search: 'coffee',
  limit: 10
});
```

### Create

```javascript
const result = await createTransaction({
  date: '2026-04-02',
  description: 'Coffee',
  amount: 5.50,
  category: 'Food & Dining',
  type: 'Expense',
  merchant: 'Starbucks',
  status: 'Completed'
});
```

### Update

```javascript
const result = await updateTransaction(151, {
  amount: 6.00,
  description: 'Coffee - Updated'
});
```

### Delete

```javascript
const result = await deleteTransaction(151);
```

---

## 📊 Analytics

### Get Summary

```javascript
const result = await getAnalytics();
// data: { totalBalance, totalIncome, totalExpenses, ... }
```

### Get Trend

```javascript
const result = await getMonthlyTrend();
// data: [ { month, income, expense, balance }, ... ]
```

---

## 🔍 Common Filters

| Filter | Type | Example |
|--------|------|---------|
| `type` | string | `'Expense'`, `'Income'` |
| `category` | string | `'Food & Dining'` |
| `status` | string | `'Completed'`, `'Pending'` |
| `search` | string | `'coffee'` |
| `dateFrom` | string | `'2026-03-01'` |
| `dateTo` | string | `'2026-03-31'` |
| `minAmount` | number | `5` |
| `maxAmount` | number | `100` |
| `merchant` | string | `'Starbucks'` |
| `sortBy` | string | `'date'`, `'amount'` |
| `sortOrder` | string | `'asc'`, `'desc'` |
| `limit` | number | `10` |
| `skip` | number | `0` |

---

## ✅ Response Structure

```javascript
{
  success: true/false,
  status: 200,
  data: { ... },
  error: null or { code, message, details },
  timestamp: '2026-04-02T10:30:45.123Z',
  duration: 502
}
```

---

## 🎯 Categories

```
- Food & Dining
- Rent & Housing
- Entertainment
- Transportation
- Shopping
- Utilities
- Healthcare
- Education
- Travel
- Salary
- Freelance
- Investment
```

---

## 📱 Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Validation error |
| 404 | Not found |
| 500 | Server error |

---

## 🔄 Common Patterns

### Fetch with Error Handling

```javascript
try {
  const result = await getTransactions({ limit: 10 });
  if (!result.success) {
    console.error('Error:', result.error.message);
    return;
  }
  console.log(result.data.transactions);
} catch (error) {
  console.error('Network error:', error);
}
```

### Create with Validation

```javascript
const handleCreate = async (formData) => {
  if (formData.amount <= 0) {
    alert('Amount must be positive');
    return;
  }
  
  const result = await createTransaction(formData);
  if (result.success) {
    console.log('Created:', result.data.id);
    refreshList();
  }
};
```

### Update with Partial Data

```javascript
const result = await updateTransaction(id, {
  status: 'Completed'
  // Only send changed fields
});
```

---

## 🎓 Zustand Integration

```javascript
import useStore from '@/store/useStore';

// In component
const transactions = useStore((s) => s.transactions);
const addTransaction = useStore((s) => s.addTransaction);

// Dispatch action
const handleAdd = () => {
  addTransaction({ ...formData });
};
```

---

**Last Updated:** April 2, 2026
