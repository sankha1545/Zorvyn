import { create } from 'zustand';
import { transactions as initialTransactions } from '../data/mockData';

const useStore = create((set, get) => ({
  // Role state
  role: 'admin', // 'admin' | 'viewer'
  setRole: (role) => set({ role }),
  toggleRole: () => set((state) => ({ role: state.role === 'admin' ? 'viewer' : 'admin' })),

  // Theme state
  theme: 'dark', // 'dark' | 'light'
  setTheme: (theme) => set({ theme }),
  toggleTheme: () => set((state) => {
    const newTheme = state.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    document.documentElement.classList.toggle('light', newTheme === 'light');
    return { theme: newTheme };
  }),

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
