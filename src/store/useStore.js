import { create } from 'zustand';
import { transactions as initialTransactions } from '../data/mockData';

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
  
  addTransaction: (transaction) => set((state) => ({
    transactions: [
      {
        ...transaction,
        id: Math.max(0, ...state.transactions.map(t => t.id)) + 1,
      },
      ...state.transactions,
    ],
  })),

  updateTransaction: (id, updates) => set((state) => ({
    transactions: state.transactions.map(t =>
      t.id === id ? { ...t, ...updates } : t
    ),
  })),

  deleteTransaction: (id) => set((state) => ({
    transactions: state.transactions.filter(t => t.id !== id),
  })),

  // Navigation state
  activePage: 'dashboard', // 'dashboard' | 'transactions' | 'settings'
  setActivePage: (page) => set({ activePage: page }),

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

  // Loading simulation
  isLoading: true,
  setIsLoading: (loading) => set({ isLoading: loading }),
}));

export default useStore;
