# 🔧 API Documentation - FinTrack Mock API

Complete API reference for the FinTrack application's mock API service.

---

## Overview

The FinTrack API is a **mock/simulated REST API** that provides realistic network behavior with in-memory data storage. All API calls are async with configurable network delays (default: 500ms).

### Base Information

```javascript
// API Configuration
BASE_DELAY = 500ms (configurable)
STORAGE = In-memory (session-based)
FORMAT = JSON
SUCCESS_CODES = 200-299
ERROR_CODES = 400, 404, 500
```

### Response Format

All API responses follow this structure:

```javascript
{
  success: boolean,
  status: number,           // HTTP-like status code
  data: T | null,          // Response payload
  error: {
    code: string,
    message: string,
    details: any
  } | null,
  timestamp: string,       // ISO 8601 format
  duration: number         // Response time in ms
}
```

---

## 🔗 API Endpoints

### Transactions API

#### GET - Fetch All Transactions

```javascript
getTransactions(filters?)
```

**Purpose:** Retrieve transactions with optional filtering/sorting

**Parameters:**

```javascript
{
  type?: 'All' | 'Income' | 'Expense',  // Filter by type
  category?: string,                     // Filter by category
  status?: 'All' | 'Completed' | 'Pending', // Status filter
  search?: string,                       // Text search
  dateFrom?: string (YYYY-MM-DD),       // Date range start
  dateTo?: string (YYYY-MM-DD),         // Date range end
  minAmount?: number,                    // Min amount filter
  maxAmount?: number,                    // Max amount filter
  merchant?: string,                     // Merchant filter
  sortBy?: 'date' | 'amount' | 'description', // Sort field
  sortOrder?: 'asc' | 'desc',          // Sort direction
  skip?: number,                         // Pagination offset
  limit?: number                         // Items per page
}
```

**Response Example:**

```javascript
{
  success: true,
  status: 200,
  data: {
    transactions: [
      {
        id: 1,
        date: '2026-03-01',
        description: 'Monthly Salary',
        amount: 8500,
        category: 'Salary',
        type: 'Income',
        merchant: 'Acme Corp',
        status: 'Completed'
      },
      // ... more transactions
    ],
    total: 150,
    filtered: 42
  },
  timestamp: '2026-04-02T10:30:45.123Z',
  duration: 502
}
```

**Usage:**

```javascript
import { getTransactions } from '@/services/api';

// Get all transactions
const response = await getTransactions();
if (response.success) {
  console.log(response.data.transactions);
}

// With filters
const filtered = await getTransactions({
  type: 'Expense',
  category: 'Food & Dining',
  dateFrom: '2026-03-01',
  dateTo: '2026-03-31',
  sortBy: 'date',
  sortOrder: 'desc',
  limit: 10
});
```

---

#### POST - Create Transaction

```javascript
createTransaction(data)
```

**Purpose:** Create a new transaction

**Parameters:**

```javascript
{
  date: string (YYYY-MM-DD),    // Required
  description: string,           // Required
  amount: number,                // Required, > 0
  category: string,              // Required
  type: 'Income' | 'Expense',   // Required
  merchant: string,              // Optional
  status: 'Completed' | 'Pending' // Optional, default: 'Completed'
}
```

**Response Example:**

```javascript
{
  success: true,
  status: 201,
  data: {
    id: 151,
    date: '2026-04-02',
    description: 'Coffee',
    amount: 5.50,
    category: 'Food & Dining',
    type: 'Expense',
    merchant: 'Starbucks',
    status: 'Completed',
    createdAt: '2026-04-02T10:30:45.123Z'
  },
  timestamp: '2026-04-02T10:30:45.623Z',
  duration: 503
}
```

**Usage:**

```javascript
const newTx = await createTransaction({
  date: '2026-04-02',
  description: 'Lunch',
  amount: 15.50,
  category: 'Food & Dining',
  type: 'Expense',
  merchant: 'Chipotle',
  status: 'Completed'
});

if (newTx.success) {
  console.log('Created:', newTx.data.id);
}
```

---

#### PUT - Update Transaction

```javascript
updateTransaction(id, data)
```

**Purpose:** Update an existing transaction

**Parameters:**

```javascript
// id: Transaction ID (number)
// data: Partial transaction object (any fields can be updated)
{
  date?: string,
  description?: string,
  amount?: number,
  category?: string,
  type?: string,
  merchant?: string,
  status?: string
}
```

**Response Example:**

```javascript
{
  success: true,
  status: 200,
  data: {
    id: 151,
    date: '2026-04-02',
    description: 'Lunch - Updated',
    amount: 16.75,
    category: 'Food & Dining',
    type: 'Expense',
    merchant: 'Chipotle',
    status: 'Completed',
    updatedAt: '2026-04-02T10:35:22.456Z'
  },
  timestamp: '2026-04-02T10:35:22.956Z',
  duration: 501
}
```

**Usage:**

```javascript
const updated = await updateTransaction(151, {
  amount: 16.75,
  description: 'Lunch - Updated'
});

if (updated.success) {
  console.log('Updated transaction:', updated.data);
}
```

---

#### DELETE - Delete Transaction

```javascript
deleteTransaction(id)
```

**Purpose:** Delete a transaction

**Parameters:**

```javascript
// id: Transaction ID (number)
```

**Response Example:**

```javascript
{
  success: true,
  status: 200,
  data: {
    message: 'Transaction deleted successfully',
    deletedId: 151
  },
  timestamp: '2026-04-02T10:40:15.789Z',
  duration: 500
}
```

**Usage:**

```javascript
const deleted = await deleteTransaction(151);

if (deleted.success) {
  console.log('Deleted transaction ID:', deleted.data.deletedId);
}
```

---

### Analytics API

#### GET - Fetch Analytics Summary

```javascript
getAnalytics()
```

**Purpose:** Get summary statistics (totals, counts, balance)

**Parameters:** None

**Response Example:**

```javascript
{
  success: true,
  status: 200,
  data: {
    totalBalance: 45321.50,
    totalIncome: 12500.00,
    totalExpenses: 3250.75,
    totalTransactions: 150,
    incomeCount: 12,
    expenseCount: 138,
    balanceChange: 9249.25,
    lastUpdate: '2026-04-02T10:30:45.123Z'
  },
  timestamp: '2026-04-02T10:30:45.623Z',
  duration: 502
}
```

**Usage:**

```javascript
const analytics = await getAnalytics();

if (analytics.success) {
  console.log('Balance:', analytics.data.totalBalance);
  console.log('Income:', analytics.data.totalIncome);
  console.log('Expenses:', analytics.data.totalExpenses);
}
```

---

#### GET - Fetch Monthly Trend

```javascript
getMonthlyTrend()
```

**Purpose:** Get revenue/expense trend for charts

**Parameters:** None

**Response Example:**

```javascript
{
  success: true,
  status: 200,
  data: [
    { month: 'Jan', income: 8500, expense: 2100, balance: 6400 },
    { month: 'Feb', income: 10200, expense: 2850, balance: 7350 },
    { month: 'Mar', income: 12500, expense: 3250, balance: 9250 }
  ],
  timestamp: '2026-04-02T10:30:45.623Z',
  duration: 501
}
```

**Usage:**

```javascript
const trend = await getMonthlyTrend();

if (trend.success) {
  // Use for chart rendering
  trend.data.forEach(item => {
    console.log(`${item.month}: +${item.income} -${item.expense}`);
  });
}
```

---

## 🔗 Error Handling

### Error Response Format

```javascript
{
  success: false,
  status: 400,
  data: null,
  error: {
    code: 'VALIDATION_ERROR',
    message: 'Invalid amount: must be greater than 0',
    details: {
      field: 'amount',
      value: -50,
      reason: 'negative_amount'
    }
  },
  timestamp: '2026-04-02T10:30:45.623Z',
  duration: 501
}
```

### Common Error Codes

| Code | Status | Meaning | Example |
|------|--------|---------|---------|
| VALIDATION_ERROR | 400 | Invalid input | Missing required field |
| NOT_FOUND | 404 | Resource not found | Transaction ID doesn't exist |
| CONFLICT | 409 | Duplicate/conflict | Duplicate entry |
| SERVER_ERROR | 500 | Server error | Unexpected failure |

### Error Handling in Code

```javascript
try {
  const result = await createTransaction({
    amount: -50  // Invalid!
  });
  
  if (!result.success) {
    console.error('Error:', result.error.message);
    // Handle error
  }
} catch (error) {
  console.error('Network error:', error);
}
```

---

## 📊 Data Types

### Transaction

```typescript
interface Transaction {
  id: number;
  date: string;                 // YYYY-MM-DD
  description: string;
  amount: number;
  category: string;
  type: 'Income' | 'Expense';
  merchant: string;
  status: 'Completed' | 'Pending';
  createdAt?: timestamp;
  updatedAt?: timestamp;
}
```

### Analytics

```typescript
interface Analytics {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  totalTransactions: number;
  incomeCount: number;
  expenseCount: number;
  balanceChange: number;
  lastUpdate: string;
}
```

### MonthlyTrend

```typescript
interface MonthlyTrend {
  month: string;
  income: number;
  expense: number;
  balance: number;
}
```

---

## ⏱️ Network Simulation

All API calls include simulated network delay:

```javascript
// Default delay: 500ms
// Response time: 500-510ms (with random jitter)

// View actual duration in response:
const response = await getTransactions();
console.log(`Request took ${response.duration}ms`);
```

---

## 🎯 Real-world Usage Examples

### Fetch and Display Transactions

```javascript
const fetchAndDisplay = async () => {
  const response = await getTransactions({
    type: 'Expense',
    limit: 10,
    sortBy: 'date',
    sortOrder: 'desc'
  });
  
  if (response.success) {
    displayTransactionTable(response.data.transactions);
  } else {
    showErrorMessage(response.error.message);
  }
};
```

### Create with Validation

```javascript
const handleAddTransaction = async (formData) => {
  // Client validation
  if (formData.amount <= 0) {
    showError('Amount must be positive');
    return;
  }
  
  // API call
  const response = await createTransaction(formData);
  
  if (response.success) {
    addNotification('✅ Transaction created');
    refreshTransactionList();
  } else {
    showError(`Error: ${response.error.message}`);
  }
};
```

### Filter with Multiple Criteria

```javascript
const advancedFilter = async () => {
  const response = await getTransactions({
    dateFrom: '2026-03-01',
    dateTo: '2026-03-31',
    category: 'Food & Dining',
    minAmount: 5,
    maxAmount: 100,
    sortBy: 'amount',
    sortOrder: 'desc'
  });
  
  return response.data.transactions;
};
```

---

## 📝 Pagination Example

```javascript
// Get page 2 with 20 items per page
const response = await getTransactions({
  skip: 20,      // Offset
  limit: 20      // Items per page
});

const pageSize = 20;
const totalPages = Math.ceil(response.data.total / pageSize);
const currentPage = (response.data.skip / pageSize) + 1;
```

---

## 🔄 Rate Limiting (Conceptual)

In production, you'd implement:
- 100 requests per minute per user
- Exponential backoff on failure
- Request queuing

Current mock implementation has no limits.

---

**Last Updated:** April 2, 2026 | **Version:** 1.0
