import { create } from 'zustand';
import { transactions as initialTransactions } from '../data/mockData';
import {
  getTransactions,
  createTransaction as apiCreateTransaction,
  updateTransaction as apiUpdateTransaction,
  deleteTransaction as apiDeleteTransaction,
  getAnalytics,
  getMonthlyTrend,
} from '../services/api';

// Detect system theme preference
const getSystemTheme = () => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'dark'; // Default to dark
};

// Get initial theme from localStorage or system preference
const getInitialTheme = () => {
  if (typeof localStorage !== 'undefined') {
    const saved = localStorage.getItem('fintrack-theme');
    if (saved) return saved;
  }
  return getSystemTheme();
};

// Apply theme to document
const applyTheme = (theme) => {
  const html = document.documentElement;
  if (theme === 'light') {
    html.classList.add('light');
    html.classList.remove('dark');
  } else {
    html.classList.remove('light');
    html.classList.add('dark');
  }
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('fintrack-theme', theme);
  }
};

const useStore = create((set, get) => ({
  // Role state
  role: 'admin', // 'admin' | 'viewer'
  setRole: (role) => set({ role }),
  toggleRole: () => set((state) => ({ role: state.role === 'admin' ? 'viewer' : 'admin' })),

  // Theme state - system-based
  theme: getInitialTheme(),
  setTheme: (theme) => {
    applyTheme(theme);
    set({ theme });
  },
  toggleTheme: () => set((state) => {
    const newTheme = state.theme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    return { theme: newTheme };
  }),
  initTheme: () => {
    // Initialize theme on app start
    const initialTheme = getInitialTheme();
    applyTheme(initialTheme);
    set({ theme: initialTheme });
  },

  // Transaction state
  transactions: initialTransactions,
  isTransactionLoading: false,
  transactionError: null,
  
  // Initialize transactions on app start
  initializeTransactions: async () => {
    set({ isTransactionLoading: true });
    try {
      const response = await getTransactions();
      if (response.success) {
        set({ 
          transactions: response.data.transactions,
          transactionError: null,
        });
      } else {
        set({ transactionError: response.error.message });
      }
    } catch (error) {
      set({ transactionError: error.message });
    } finally {
      set({ isTransactionLoading: false });
    }
  },

  fetchTransactions: async (filters = {}) => {
    set({ isTransactionLoading: true });
    try {
      const response = await getTransactions(filters);
      if (response.success) {
        set({ 
          transactions: response.data.transactions,
          transactionError: null,
        });
        return response;
      } else {
        set({ transactionError: response.error.message });
        return response;
      }
    } catch (error) {
      set({ transactionError: error.message });
      return { success: false, error: { message: error.message } };
    } finally {
      set({ isTransactionLoading: false });
    }
  },

  addTransaction: async (transaction) => {
    set({ isTransactionLoading: true });
    try {
      const response = await apiCreateTransaction(transaction);
      if (response.success) {
        // Update local state with new transaction
        set((state) => ({
          transactions: [response.data.transaction, ...state.transactions],
          transactionError: null,
        }));
        // Refresh analytics
        const state = get();
        await state.fetchAnalytics();
        return response;
      } else {
        set({ transactionError: response.error.message });
        return response;
      }
    } catch (error) {
      set({ transactionError: error.message });
      return { success: false, error: { message: error.message } };
    } finally {
      set({ isTransactionLoading: false });
    }
  },

  updateTransaction: async (id, updates) => {
    set({ isTransactionLoading: true });
    try {
      const response = await apiUpdateTransaction(id, updates);
      if (response.success) {
        // Update local state
        set((state) => ({
          transactions: state.transactions.map(t =>
            t.id === id ? response.data.transaction : t
          ),
          transactionError: null,
        }));
        // Refresh analytics
        const state = get();
        await state.fetchAnalytics();
        return response;
      } else {
        set({ transactionError: response.error.message });
        return response;
      }
    } catch (error) {
      set({ transactionError: error.message });
      return { success: false, error: { message: error.message } };
    } finally {
      set({ isTransactionLoading: false });
    }
  },

  deleteTransaction: async (id) => {
    set({ isTransactionLoading: true });
    try {
      const response = await apiDeleteTransaction(id);
      if (response.success) {
        // Update local state
        set((state) => ({
          transactions: state.transactions.filter(t => t.id !== id),
          transactionError: null,
        }));
        // Refresh analytics
        const state = get();
        await state.fetchAnalytics();
        return response;
      } else {
        set({ transactionError: response.error.message });
        return response;
      }
    } catch (error) {
      set({ transactionError: error.message });
      return { success: false, error: { message: error.message } };
    } finally {
      set({ isTransactionLoading: false });
    }
  },

  // Navigation state - persisted to localStorage
  activePage: typeof localStorage !== 'undefined' 
    ? localStorage.getItem('fintrack-activePage') || 'dashboard'
    : 'dashboard',
  setActivePage: (page) => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('fintrack-activePage', page);
    }
    set({ activePage: page });
  },

  // Analytics state
  analytics: null,
  analyticsLoading: false,
  analyticsError: null,

  fetchAnalytics: async () => {
    set({ analyticsLoading: true });
    try {
      const response = await getAnalytics();
      console.log('fetchAnalytics response:', response);
      
      if (response && response.success) {
        // response.data contains { currentMonth, balanceTrend, spendingBreakdown, insights }
        // We store it directly as analytics
        console.log('Analytics fetched successfully:', response.data);
        set({
          analytics: response.data, // Store the data payload directly
          analyticsError: null,
        });
        return response.data;
      } else {
        console.error('Analytics fetch failed:', response);
        set({ analyticsError: response?.error?.message || 'Failed to fetch analytics' });
      }
    } catch (error) {
      console.error('Analytics error:', error);
      set({ analyticsError: error.message || 'Unknown error' });
    } finally {
      set({ analyticsLoading: false });
    }
  },

  monthlyTrend: null,
  trendLoading: false,
  trendError: null,

  fetchMonthlyTrend: async () => {
    set({ trendLoading: true });
    try {
      const response = await getMonthlyTrend();
      if (response.success) {
        set({
          monthlyTrend: response.data,
          trendError: null,
        });
      } else {
        set({ trendError: response.error.message });
      }
    } catch (error) {
      set({ trendError: error.message });
    } finally {
      set({ trendLoading: false });
    }
  },

  // Sidebar state
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  // Mobile sidebar
  mobileSidebarOpen: false,
  setMobileSidebarOpen: (open) => set({ mobileSidebarOpen: open }),

  // Search state
  globalSearch: '',
  setGlobalSearch: (search) => set({ globalSearch: search }),

  // Error management
  setTransactionError: (error) => set({ transactionError: error }),
  setAnalyticsError: (error) => set({ analyticsError: error }),
  setTrendError: (error) => set({ trendError: error }),

  // Profile state
  profile: {
    fullName: 'Alex Morgan',
    email: 'alex@fintrack.io',
    phone: '+1 (555) 123-4567',
    country: 'United States',
    countryCode: 'US',
    state: 'California',
    dialCode: '+1',
    currency: 'USD',
  },
  setProfile: (profile) => {
    // Persist to localStorage
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('fintrack-profile', JSON.stringify(profile));
    }
    set({ profile });
  },
  initProfile: () => {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem('fintrack-profile');
      if (saved) {
        try {
          set({ profile: JSON.parse(saved) });
        } catch (e) {
          console.error('Failed to load profile:', e);
        }
      }
    }
  },

  // Notifications state
  notifications: [
    { id: 1, type: 'transaction', title: 'Transaction Created', message: 'New expense recorded for $50.00', timestamp: new Date(Date.now() - 3600000), read: false },
    { id: 2, type: 'budget', title: 'Budget Alert', message: 'You\'ve spent 75% of your monthly budget', timestamp: new Date(Date.now() - 7200000), read: false },
    { id: 3, type: 'security', title: 'Security Update', message: 'Login from new device detected', timestamp: new Date(Date.now() - 86400000), read: true },
  ],
  addNotification: (notification) => set((state) => ({
    notifications: [notification, ...state.notifications],
  })),
  markNotificationRead: (id) => set((state) => ({
    notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n),
  })),
  clearNotifications: () => set({ notifications: [] }),

  // Loading simulation
  isLoading: true,
  setIsLoading: (loading) => set({ isLoading: loading }),

  // App initialization
  initializeApp: async () => {
    const state = get();
    // Initialize theme
    state.initTheme();
    // Initialize profile
    state.initProfile();
    // Load transactions from backend
    await state.initializeTransactions();
    // Load analytics
    await state.fetchAnalytics();
    // Load monthly trend
    await state.fetchMonthlyTrend();
  },
}));

export default useStore;
