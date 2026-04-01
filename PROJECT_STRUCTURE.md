# Project Structure & Documentation Guide

## 📁 Complete File Hierarchy

```
webapp/
├── 📄 API_DOCUMENTATION.md          ← Full API reference
├── 📄 API_QUICK_REFERENCE.md        ← Quick lookup table
├── 📄 IMPLEMENTATION_GUIDE.md        ← How to use API in components
├── 📄 TROUBLESHOOTING.md            ← Common issues & solutions
├── 📄 README.md                      ← Project overview
│
├── src/
│   ├── 📁 services/                  ← API layer
│   │   ├── api.js                    ← Mock API implementation (400+ lines)
│   │   └── index.js                  ← Service exports & configuration
│   │
│   ├── 📁 hooks/                     ← Custom hooks (NEW)
│   │   ├── useApi.js                 ← useTransactions, useAnalytics hooks
│   │   └── index.js                  ← Hook exports
│   │
│   ├── 📁 store/
│   │   └── useStore.js               ← Zustand store with API integration
│   │
│   ├── 📁 components/
│   │   ├── 📁 ui/                    ← Reusable UI components
│   │   ├── 📁 Layout/                ← Layout components
│   │   ├── 📁 Dashboard/             ← Dashboard components
│   │   ├── 📁 Transactions/          ← Transaction components
│   │   ├── 📁 Modal/                 ← Modal components
│   │   ├── App.jsx                   ← Main app component
│   │   └── index.js                  ← Component exports
│   │
│   ├── 📁 pages/
│   │   ├── Dashboard.jsx             ← Dashboard page
│   │   ├── Transactions.jsx          ← Transactions page
│   │   └── Settings.jsx              ← Settings page
│   │
│   ├── 📁 data/
│   │   └── mockData.js               ← Initial mock data
│   │
│   ├── 📁 utils/
│   │   ├── csvExport.js              ← CSV export utility
│   │   └── theme.js                  ← Theme utilities
│   │
│   ├── 📁 assets/                    ← Images, icons
│   ├── index.css                     ← Global CSS with variables
│   └── main.jsx                      ← React entry point
│
├── package.json                      ← Dependencies
├── vite.config.js                    ← Vite configuration
└── index.html                        ← HTML entry point
```

---

## 📚 Documentation Files

### 1. **API_DOCUMENTATION.md**
Comprehensive API reference with full endpoint details.

**Sections:**
- Overview & Features
- Base Configuration
- All Transaction API endpoints
- Analytics API endpoints
- Utility API endpoints
- Integration examples
- Error handling patterns
- Best practices

**Use When:** You need detailed information about specific endpoints

---

### 2. **API_QUICK_REFERENCE.md**
Quick lookup table and summary reference.

**Sections:**
- Service locations
- API overview table
- Store methods
- Custom hooks summary
- Common patterns
- Filter options
- Response formats
- Example complete flow
- Debugging shortcuts

**Use When:** You need a quick lookup or reminder about API structure

---

### 3. **IMPLEMENTATION_GUIDE.md**
Step-by-step guide for implementing API in components.

**Sections:**
- Quick start (5 steps)
- Using transactions in components (2 methods)
- CRUD operation examples
- Using analytics
- Filtering and searching
- Pagination implementation
- Complete example (Transactions page)
- Error handling best practices
- Debugging tips

**Use When:** You're implementing features and need practical examples

---

### 4. **TROUBLESHOOTING.md**
Solutions for common problems and issues.

**Sections:**
- API call hangs
- response.success undefined
- Data not updating
- Transaction IDs invalid
- Filters not working
- Analytics/Dashboard issues
- Performance problems
- Batch delete issues
- Export not working
- Debugging checklist
- How to enable logging

**Use When:** Something is broken or not working as expected

---

## 🔧 Key Files

### src/services/api.js
**Purpose:** Mock API service implementation

**Key Functions (13 total):**
- `getTransactions(filters)` - Fetch with filtering/pagination/sorting
- `getTransactionById(id)` - Fetch single transaction
- `createTransaction(data)` - Create with validation
- `updateTransaction(id, data)` - Update existing
- `deleteTransaction(id)` - Delete single
- `deleteTransactions(ids)` - Batch delete
- `getAnalytics()` - Dashboard stats
- `getMonthlyTrend()` - Monthly data for charts
- `getTransactionsByCategory()` - Category breakdown
- `getDatabaseStats()` - Database info
- `resetDatabase()` - Reset to initial data
- `exportTransactionsJSON(filters)` - Export functionality

**Features:**
- 500ms network delay simulation
- In-memory database
- Comprehensive error handling
- Validation on create operations
- Response standardization: `{ success, data, error, timestamp }`

---

### src/services/index.js
**Purpose:** Service configuration and exports

**Exports:** All api.js functions

**Configuration:**
```javascript
const apiClient = {
  baseURL: 'http://localhost:3000/api',
  timeout: 30000,
  retryAttempts: 3
}
```

---

### src/store/useStore.js
**Purpose:** Zustand state management with API integration

**State Properties:**
- `transactions` - Array of transactions
- `isTransactionLoading` - Loading state
- `transactionError` - Error message
- `analytics` - Dashboard analytics object
- `monthlyTrend` - Monthly trend data
- Many more theme/UI states

**Methods:**
- `initializeTransactions()` - Load initial data
- `fetchTransactions(filters)` - Fetch with filters
- `addTransaction(data)` - Create and update state
- `updateTransaction(id, data)` - Update and refresh state
- `deleteTransaction(id)` - Delete and refresh state
- `fetchAnalytics()` - Load dashboard data
- `fetchMonthlyTrend()` - Load trend data
- Error management: `setTransactionError()`, `setAnalyticsError()`, etc.

---

### src/hooks/useApi.js
**Purpose:** Custom hooks for simplified component usage

**Hooks Provided:**
1. **useTransactions()** - Transaction management
   - Returns: transactions, isLoading, error, CRUD methods
   
2. **useAnalytics()** - Analytics data management
   - Returns: analytics, monthlyTrend, loading states, fetch methods
   
3. **useApiNotification()** - Notification system
   - Returns: showError, showSuccess (TODO: integrate with toast)

---

## 🚀 Quick Start Routes

### I want to...

#### Create a new page that shows transactions
1. Read: `IMPLEMENTATION_GUIDE.md` → "Complete Example: Transactions Page"
2. Copy the example code
3. Adapt the components to your design
4. Use `useTransactions()` hook from `src/hooks/useApi.js`

#### Fix a bug or error
1. Read: `TROUBLESHOOTING.md` → Find matching issue
2. Apply the solution
3. Test using debugging checklist

#### Understand how filtering works
1. Read: `API_QUICK_REFERENCE.md` → "Filter Options"
2. Read: `IMPLEMENTATION_GUIDE.md` → "Filtering and Searching"
3. See `API_DOCUMENTATION.md` → "GET - Fetch All Transactions"

#### Add pagination to a page
1. Read: `IMPLEMENTATION_GUIDE.md` → "Step 6: Pagination"
2. Copy the pagination component example
3. Update your fetch calls with `skip` and `limit`

#### Debug why API calls aren't working
1. Read: `TROUBLESHOOTING.md` → "Debugging Checklist"
2. Use console logging from that section
3. Check browser DevTools and store state

#### Learn about analytics/dashboard
1. Read: `IMPLEMENTATION_GUIDE.md` → "Step 4: Using Analytics"
2. See `API_QUICK_REFERENCE.md` → "Analytics Methods"
3. View `IMPLEMENTATION_GUIDE.md` → "Complete Example"

#### Switch to real backend later
1. Read: `API_QUICK_REFERENCE.md` → "Future: Real Backend Integration"
2. Follow the pattern to update `src/services/api.js`
3. Keep response format identical for drop-in compatibility

---

## 📋 Integration Checklist

- [ ] Read `API_QUICK_REFERENCE.md` for overview
- [ ] Read `IMPLEMENTATION_GUIDE.md` steps 1-2
- [ ] Update `App.jsx` with `initializeTransactions()`
- [ ] Update `Dashboard.jsx` to use `loadAnalytics()` and `loadTrend()`
- [ ] Update `Transactions.jsx` to use `useTransactions()` hook
- [ ] Add loading states when `isLoading` is true
- [ ] Add error displays when `error` is not null
- [ ] Test each CRUD operation (Create, Read, Update, Delete)
- [ ] Test filters and search
- [ ] Test pagination if needed
- [ ] Review `TROUBLESHOOTING.md` for common issues
- [ ] Add toast notifications for user feedback

---

## 🔍 Finding Things

### "How do I..."

| Task | Document | Section |
|------|----------|---------|
| Get started quickly | API_QUICK_REFERENCE.md | Quick API Overview |
| Create a transaction | IMPLEMENTATION_GUIDE.md | "Create Transaction" |
| Fetch with filters | IMPLEMENTATION_GUIDE.md | "Step 5: Filtering and Searching" |
| Show loading state | IMPLEMENTATION_GUIDE.md | "Complete Example" |
| Handle errors | IMPLEMENTATION_GUIDE.md | "Error Handling Best Practices" |
| Debug an issue | TROUBLESHOOTING.md | Find matching symptom |
| Use analytics | IMPLEMENTATION_GUIDE.md | "Step 4: Using Analytics" |
| Do pagination | IMPLEMENTATION_GUIDE.md | "Step 6: Pagination" |
| Export data | IMPLEMENTATION_GUIDE.md | See CSV export notes |
| Understand hooks | API_QUICK_REFERENCE.md | "Custom Hooks (Recommended)" |
| See all API endpoints | API_DOCUMENTATION.md | Full endpoint list |
| Reset database | IMPLEMENTATION_GUIDE.md | See database reset notes |
| Switch to real API | API_QUICK_REFERENCE.md | "Future: Real Backend Integration" |

---

## 📊 Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│              React Components                        │
│     (Dashboard, Transactions, Settings)             │
└────────────────────┬────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────┐
│           Custom Hooks (useApi.js)                  │
│  (useTransactions, useAnalytics)                    │
└────────────────────┬────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────┐
│         Zustand Store (useStore.js)                 │
│  State Management + Async Methods                   │
└────────────────────┬────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────┐
│      Mock API Service (services/api.js)             │
│  CRUD, Analytics, Utilities                         │
│  (500ms delay simulation)                           │
└────────────────────┬────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────┐
│      In-Memory Database (transactionsDb)            │
│      Mock Data (transactions)                       │
└─────────────────────────────────────────────────────┘
```

---

## 💡 Best Practices

1. **Always use custom hooks** - Prefer `useTransactions()` over direct store access
2. **Check response.success first** - Always validate before accessing data
3. **Handle loading states** - Show spinners when `isLoading` is true
4. **Display errors** - Show error messages to users when API fails
5. **Debounce search** - Prevent too many API calls during typing
6. **Paginate large datasets** - Don't load thousands of items at once
7. **Try-catch for safety** - Wrap API calls in error handling
8. **Use filters efficiently** - Reduce data fetched with appropriate filters
9. **Test components** - Verify CRUD operations work correctly
10. **Future-proof design** - Response format works with real backend too

---

## 📖 Documentation Reading Order

**For New Users:**
1. API_QUICK_REFERENCE.md (overview)
2. IMPLEMENTATION_GUIDE.md Steps 1-3 (basics)
3. Complete one task using the guide

**For Implementing Features:**
1. IMPLEMENTATION_GUIDE.md (find matching section)
2. Copy example code
3. Reference API_DOCUMENTATION.md if needed

**For Fixing Issues:**
1. TROUBLESHOOTING.md (find matching symptom)
2. Apply solution
3. Use debugging checklist to verify fix

---

## ✅ Success Indicators

Your implementation is successful when:

- [ ] ✅ App loads without errors
- [ ] ✅ Transactions display on load
- [ ] ✅ Can create new transactions
- [ ] ✅ Can edit transactions
- [ ] ✅ Can delete transactions
- [ ] ✅ Filters work correctly
- [ ] ✅ Search narrows results
- [ ] ✅ Dashboard shows analytics
- [ ] ✅ Charts display trend data
- [ ] ✅ Loading states show during API calls
- [ ] ✅ Error messages display when API fails
- [ ] ✅ No console errors
- [ ] ✅ Responsive design works

---

## 🔗 File Relationships

```
IMPLEMENTATION_GUIDE.md
    ↓
    └─→ IMPLEMENTATION_GUIDE Step 3
        ↓
        └─→ Import { useTransactions } from '@/hooks'
            ↓
            └─→ src/hooks/useApi.js
                ↓
                └─→ Import from '@/store/useStore'
                    ↓
                    └─→ src/store/useStore.js
                        ↓
                        └─→ Import from '@/services/api'
                            ↓
                            └─→ src/services/api.js (where the magic happens!)
```

---

**Last Updated:** 2026-04-02  
**API Version:** 1.0 (Mock)  
**Status:** Ready for integration into components
