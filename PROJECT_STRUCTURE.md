# 📁 Project Structure - FinTrack

Complete directory structure and file organization for the FinTrack financial management application.

---

## 📊 Root Directory

```
webapp/
├── src/                          # Source code directory
├── public/                       # Static assets
├── dist/                         # Production build output
├── node_modules/                 # Dependencies
├── package.json                  # Project metadata & scripts
├── vite.config.js               # Vite configuration
├── eslint.config.js             # ESLint rules
├── ecosystem.config.cjs          # PM2 deployment config
├── index.html                   # HTML entry point
│
├── 📚 Documentation:
├── README.md                    # Main documentation
├── PROJECT_STRUCTURE.md         # This file
├── API_DOCUMENTATION.md         # API reference
├── API_QUICK_REFERENCE.md       # Quick API lookup
├── IMPLEMENTATION_GUIDE.md      # Integration & setup guide
├── IMPLEMENTATION_SUMMARY.md    # Technical overview
├── INTEGRATION_CHECKLIST.md     # Feature status
└── TROUBLESHOOTING.md          # Common issues & solutions
```

---

## 📂 Source Code Structure

### `src/` - Application Code

```
src/
├── App.jsx                      # Root component
├── main.jsx                     # Entry point
├── index.css                    # Global styles
├── appRouter.jsx                # Route configuration
│
├── pages/                       # Page components
│   ├── Dashboard.jsx            # Analytics dashboard
│   ├── Transactions.jsx         # Transaction management
│   └── Settings.jsx             # User settings & profile
│
├── components/                  # Reusable components
│   ├── Layout/
│   │   ├── index.js            # Exports
│   │   ├── Layout.jsx          # Main wrapper
│   │   ├── Topbar.jsx          # Header with notifications
│   │   └── Sidebar.jsx         # Navigation sidebar
│   │
│   ├── Dashboard/              # Analytics components
│   │   ├── index.js            # Exports
│   │   ├── ChartContainer.jsx  # Chart wrapper
│   │   ├── StatCard.jsx        # Stats display
│   │   └── SkeletonLoader.jsx  # Loading skeleton
│   │
│   ├── Transactions/           # Transaction UI components
│   │   ├── index.js            # Exports
│   │   ├── TransactionSearch.jsx   # Search input
│   │   ├── TransactionFilter.jsx   # Filter controls
│   │   ├── TransactionTable.jsx    # Data table
│   │   └── TransactionPagination.jsx # Pagination
│   │
│   ├── Modal/                  # Dialog components
│   │   ├── CreateModal.jsx     # Create transaction
│   │   ├── EditModal.jsx       # Edit transaction
│   │   ├── DeleteModal.jsx     # Delete confirmation
│   │   ├── EditProfileModal.jsx # Profile editing
│   │   └── NotificationsModal.jsx # Notifications
│   │
│   ├── ui/                     # Base UI components
│   │   ├── index.js            # Exports
│   │   ├── Button.jsx          # Button component
│   │   ├── Input.jsx           # Text input
│   │   ├── Select.jsx          # Dropdown selector
│   │   ├── Table.jsx           # Table structure
│   │   └── Badge.jsx           # Status badge
│   │
│   ├── RoleGuard.jsx           # RBAC wrapper
│   └── Toast.jsx               # Notifications
│
├── store/                      # State management
│   └── useStore.js            # Zustand store
│
├── hooks/                      # Custom React hooks
│   ├── index.js               # Exports
│   └── useApi.js              # API integration hook
│
├── services/                  # API services
│   ├── index.js              # Exports
│   └── api.js                # Mock API implementation
│
├── utils/                     # Utility functions
│   ├── theme.js              # Theme management
│   ├── csvExport.js          # CSV export utilities
│   └── countriesAPI.js       # Countries data
│
├── data/                      # Mock data
│   └── mockData.js           # Transactions & categories
│
└── assets/                    # Resource files
```

---

## 🔄 Data Flow Architecture

```
┌─────────────────────────────────────────────────────┐
│               User Interaction                       │
│           (Click, Scroll, Type, etc)                │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│            React Components                         │
│    (Pages, Modal, Tables, Inputs)                  │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│          useStore (Zustand)                        │
│      Central State Management                      │
├─────────────────────────────────────────────────────┤
│ • Transactions                                      │
│ • Theme, Role, Notifications                       │
│ • UI State (modals, pages)                         │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│          API Services (services/api.js)            │
│       Mock API with Network Simulation             │
├─────────────────────────────────────────────────────┤
│ • getTransactions()                                 │
│ • createTransaction()                               │
│ • updateTransaction()                               │
│ • deleteTransaction()                               │
│ • getAnalytics()                                    │
│ • getMonthlyTrend()                                │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│          Mock Data (in-memory storage)             │
│    Transactions, Categories, Merchants              │
└─────────────────────────────────────────────────────┘
```

---

## 📋 Component Hierarchy

```
App
└── Layout
    ├── Topbar
    │   ├── Role Switcher (Dropdown)
    │   ├── Theme Toggle
    │   ├── Notifications Button → NotificationsModal
    │   └── Profile Menu → EditProfileModal
    │
    ├── Sidebar
    │   ├── Navigation Links
    │   └── User Card
    │
    └── Content Area (AppContent)
        ├── Dashboard Page
        │   ├── StatCard (×4)
        │   └── ChartContainer (×2)
        │
        ├── Transactions Page
        │   ├── Header (with export & add buttons)
        │   ├── TransactionSearch
        │   ├── TransactionFilter
        │   ├── Advanced Filters
        │   ├── Active Filters Display
        │   ├── TransactionTable
        │   │   └── Modal: CreateModal, EditModal, DeleteModal
        │   └── TransactionPagination
        │
        └── Settings Page
            ├── Profile Information Card
            ├── Appearance Card
            ├── Notifications Card
            └── Security & Access Card
```

---

## 🗂️ File Purposes

### Pages

| File | Purpose |
|------|---------|
| `Dashboard.jsx` | Analytics dashboard with stats and charts |
| `Transactions.jsx` | Main transaction management interface |
| `Settings.jsx` | User profile and preference settings |

### Layout Components

| File | Purpose |
|------|---------|
| `Layout.jsx` | Main layout wrapper with sidebar & topbar |
| `Topbar.jsx` | Header with controls and notifications |
| `Sidebar.jsx` | Navigation menu and user info |

### Transaction Components

| File | Purpose |
|------|---------|
| `TransactionSearch.jsx` | Search input field |
| `TransactionFilter.jsx` | Dropdown filters |
| `TransactionTable.jsx` | Data table display |
| `TransactionPagination.jsx` | Pagination controls |

### Modal Components

| File | Purpose |
|------|---------|
| `CreateModal.jsx` | Add new transaction form |
| `EditModal.jsx` | Edit transaction form |
| `DeleteModal.jsx` | Delete confirmation dialog |
| `EditProfileModal.jsx` | Profile editing form |
| `NotificationsModal.jsx` | Notifications and alerts |

### UI Components

| File | Purpose |
|------|---------|
| `Button.jsx` | Reusable button component |
| `Input.jsx` | Form input fields |
| `Select.jsx` | Dropdown selector |
| `Table.jsx` | Table structure elements |
| `Badge.jsx` | Status/category badges |

### Store & State

| File | Purpose |
|------|---------|
| `useStore.js` | Zustand store with all app state |

### Services & API

| File | Purpose |
|------|---------|
| `api.js` | Mock API endpoints |

### Utilities

| File | Purpose |
|------|---------|
| `theme.js` | Theme color management |
| `csvExport.js` | CSV export utilities |
| `countriesAPI.js` | Country/currency data |

### Data

| File | Purpose |
|------|---------|
| `mockData.js` | Transaction & category mock data |

---

## 🎯 State Management Structure

### Store Properties

```javascript
{
  // Role-based access
  role: 'admin' | 'viewer',
  setRole: (role) => void,
  toggleRole: () => void,

  // Theme management
  theme: 'light' | 'dark',
  setTheme: (theme) => void,
  toggleTheme: () => void,
  initTheme: () => void,

  // Transaction data
  transactions: Array<Transaction>,
  isTransactionLoading: boolean,
  transactionError: string | null,

  // Transaction operations
  initializeTransactions: async () => void,
  fetchTransactions: async (filters) => void,
  addTransaction: (data) => void,
  updateTransaction: (id, data) => void,
  deleteTransaction: (id) => void,

  // UI state
  isLoading: boolean,
  setIsLoading: (loading) => void,
  activePage: 'dashboard' | 'transactions' | 'settings',
  setActivePage: (page) => void,

  // Search
  globalSearch: string,
  setGlobalSearch: (term) => void,

  // Notifications
  notifications: Array<Notification>,
  addNotification: (notification) => void,
  markNotificationRead: (id) => void,
  clearNotifications: () => void,

  // Profile
  profile: UserProfile,
  updateProfile: (data) => void,

  // Analytics
  analytics: Analytics,
  fetchAnalytics: async () => void,
  monthlyTrend: Array<TrendData>,
  fetchMonthlyTrend: async () => void,
}
```

---

## 🔌 API Integration Points

All API calls are in `services/api.js` and use Zustand store for state:

```javascript
// Transactions
- getTransactions(filters)     // Fetch with filters/sorting
- createTransaction(data)      // Add new
- updateTransaction(id, data)  // Edit
- deleteTransaction(id)        // Delete

// Analytics
- getAnalytics()               // Summary stats
- getMonthlyTrend()            // Trend data
```

---

## 🎨 Component Relationships

### Transactions Page

```
TransactionSearch ─┐
TransactionFilter ─┼─→ Zustand Store
Advanced Filters ──┤
                   └─→ TransactionTable
                       ├─→ CreateModal
                       ├─→ EditModal
                       └─→ DeleteModal
                   ├─→ TransactionPagination
                   └─→ Export CSV
```

### Settings Page

```
EditProfileModal ──→ Zustand (Profile)
Appearance Card ────→ Zustand (Theme)
Notifications Card──→ Zustand (Notifications)
Security Card ──────→ Zustand (Role)
```

---

## 📦 Dependencies & Versions

| Package | Version | Purpose |
|---------|---------|---------|
| React | 19.2.4 | UI framework |
| Vite | 8.0.1 | Build tool |
| Zustand | 5.0.12 | State management |
| Tailwind CSS | 4.2.2 | Styling |
| HeroUI | 3.0.1 | Component library |
| Lucide Icons | 1.7.0 | Icons |
| Recharts | 3.8.1 | Charts |
| Framer Motion | 12.38.0 | Animations |

---

## 🚀 Build Output

```
dist/
├── index.html              # Main HTML file
├── assets/
│   ├── index-[hash].js     # Bundled JavaScript
│   ├── index-[hash].css    # Compiled CSS
│   └── [other static files]
└── [other assets]
```

---

## 🔄 File Import/Export Examples

### Importing Store

```javascript
import useStore from '@/store/useStore';

// Usage
const transactions = useStore((s) => s.transactions);
const setRole = useStore((s) => s.setRole);
```

### Importing Components

```javascript
import { Button, Input, Select, Badge } from '@/components/ui';
import { TransactionTable, TransactionFilter } from '@/components/Transactions';
```

### Importing Utils

```javascript
import { exportToCSV } from '@/utils/csvExport';
import { categories } from '@/data/mockData';
```

---

## 📊 Database-like Structure

### Transactions Collection

```javascript
{
  id: number,
  date: string (YYYY-MM-DD),
  description: string,
  amount: number,
  category: string,
  type: 'Income' | 'Expense',
  merchant: string,
  status: 'Completed' | 'Pending',
  createdAt: timestamp,
  updatedAt: timestamp,
}
```

### User Profile Collection

```javascript
{
  fullName: string,
  email: string,
  phone: string,
  country: string,
  state: string (optional),
  currency: string,
  dialCode: string,
  avatarUrl: string (optional),
}
```

### Analytics Collection

```javascript
{
  totalBalance: number,
  totalIncome: number,
  totalExpenses: number,
  incomeCount: number,
  expenseCount: number,
  balanceChange: number,
}
```

---

## 🔐 File Permissions (Conceptual)

```
Public Access (no auth):
├── styles (CSS)
├── UI components
└── Static assets

Role-Protected:
├── Create Transaction (Admin)
├── Edit Transaction (Admin)
├── Delete Transaction (Admin)
├── View All (Everyone)
└── Export (Everyone)

Private (Authenticated):
└── All user-specific data
```

---

## 📱 Asset Files

```
public/
├── favicon.ico              # Site icon
└── [custom assets if any]
```

---

**Last Updated:** April 2, 2026 | **Version:** 1.0
