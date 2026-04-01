/**
 * Mock API Service
 * Simulates REST API calls with realistic delays and error handling
 * WITH PERSISTENT STORAGE using localStorage
 */

import { transactions as mockTransactions } from '../data/mockData';

// localStorage key for persistent storage
const STORAGE_KEY = 'fintrack_transactions_db';

// Initialize database from localStorage or mock data
const initializeDb = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load from localStorage:', e);
  }
  return JSON.parse(JSON.stringify(mockTransactions));
};

// Save database to localStorage
const saveDb = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
};

// Simulated database storage (persistent via localStorage)
let transactionsDb = initializeDb();

// Simulate network delay (ms)
const NETWORK_DELAY = 500;

// API Response wrapper
const createResponse = (success, data = null, error = null) => ({
  success,
  data,
  error,
  timestamp: new Date().toISOString(),
});

// Simulate network latency
const delay = (ms = NETWORK_DELAY) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * TRANSACTION APIs
 */

// GET: Fetch all transactions
export const getTransactions = async (options = {}) => {
  try {
    await delay();
    
    let result = [...transactionsDb];

    // Filter by type if provided
    if (options.type && options.type !== 'All') {
      result = result.filter((t) => t.type === options.type);
    }

    // Filter by category if provided
    if (options.category && options.category !== 'All') {
      result = result.filter((t) => t.category === options.category);
    }

    // Filter by status if provided
    if (options.status && options.status !== 'All') {
      result = result.filter((t) => t.status === options.status);
    }

    // Search if provided
    if (options.search) {
      const searchLower = options.search.toLowerCase();
      result = result.filter(
        (t) =>
          t.description.toLowerCase().includes(searchLower) ||
          t.merchant.toLowerCase().includes(searchLower)
      );
    }

    // Sort if provided
    if (options.sortBy) {
      result.sort((a, b) => {
        const order = options.sortOrder === 'desc' ? -1 : 1;
        if (a[options.sortBy] < b[options.sortBy]) return -1 * order;
        if (a[options.sortBy] > b[options.sortBy]) return 1 * order;
        return 0;
      });
    }

    // Pagination if provided
    if (options.skip && options.limit) {
      result = result.slice(options.skip, options.skip + options.limit);
    }

    return createResponse(true, {
      transactions: result,
      total: transactionsDb.length,
      count: result.length,
    });
  } catch (error) {
    return createResponse(false, null, {
      message: 'Failed to fetch transactions',
      details: error.message,
    });
  }
};

// GET: Fetch transaction by ID
export const getTransactionById = async (id) => {
  try {
    await delay();
    const transaction = transactionsDb.find((t) => t.id === id);

    if (!transaction) {
      return createResponse(false, null, {
        message: `Transaction with id ${id} not found`,
      });
    }

    return createResponse(true, transaction);
  } catch (error) {
    return createResponse(false, null, {
      message: 'Failed to fetch transaction',
      details: error.message,
    });
  }
};

// POST: Create new transaction
export const createTransaction = async (transactionData) => {
  try {
    // Validation
    if (
      !transactionData.description ||
      !transactionData.amount ||
      !transactionData.category
    ) {
      return createResponse(false, null, {
        message: 'Missing required fields: description, amount, category',
      });
    }

    await delay();

    const newTransaction = {
      id: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...transactionData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    transactionsDb.push(newTransaction);
    saveDb(transactionsDb); // Persist to localStorage

    return createResponse(true, {
      message: 'Transaction created successfully',
      transaction: newTransaction,
    });
  } catch (error) {
    return createResponse(false, null, {
      message: 'Failed to create transaction',
      details: error.message,
    });
  }
};

// PUT: Update transaction
export const updateTransaction = async (id, updateData) => {
  try {
    await delay();

    const transactionIndex = transactionsDb.findIndex((t) => t.id === id);

    if (transactionIndex === -1) {
      return createResponse(false, null, {
        message: `Transaction with id ${id} not found`,
      });
    }

    const updatedTransaction = {
      ...transactionsDb[transactionIndex],
      ...updateData,
      id: transactionsDb[transactionIndex].id, // Preserve original ID
      createdAt: transactionsDb[transactionIndex].createdAt, // Preserve created date
      updatedAt: new Date().toISOString(),
    };

    transactionsDb[transactionIndex] = updatedTransaction;
    saveDb(transactionsDb); // Persist to localStorage

    return createResponse(true, {
      message: 'Transaction updated successfully',
      transaction: updatedTransaction,
    });
  } catch (error) {
    return createResponse(false, null, {
      message: 'Failed to update transaction',
      details: error.message,
    });
  }
};

// DELETE: Delete transaction
export const deleteTransaction = async (id) => {
  try {
    await delay();

    const transactionIndex = transactionsDb.findIndex((t) => t.id === id);

    if (transactionIndex === -1) {
      return createResponse(false, null, {
        message: `Transaction with id ${id} not found`,
      });
    }

    const deletedTransaction = transactionsDb.splice(transactionIndex, 1)[0];
    saveDb(transactionsDb); // Persist to localStorage

    return createResponse(true, {
      message: 'Transaction deleted successfully',
      transaction: deletedTransaction,
    });
  } catch (error) {
    return createResponse(false, null, {
      message: 'Failed to delete transaction',
      details: error.message,
    });
  }
};

// BATCH: Delete multiple transactions
export const deleteTransactions = async (ids) => {
  try {
    await delay();

    const deletedTransactions = [];
    ids.forEach((id) => {
      const index = transactionsDb.findIndex((t) => t.id === id);
      if (index !== -1) {
        deletedTransactions.push(transactionsDb.splice(index, 1)[0]);
      }
    });
    saveDb(transactionsDb); // Persist to localStorage

    return createResponse(true, {
      message: `${deletedTransactions.length} transaction(s) deleted successfully`,
      count: deletedTransactions.length,
      transactions: deletedTransactions,
    });
  } catch (error) {
    return createResponse(false, null, {
      message: 'Failed to delete transactions',
      details: error.message,
    });
  }
};

/**
 * ANALYTICS APIs
 */

// GET: Analytics dashboard data
export const getAnalytics = async () => {
  try {
    await delay();

    const incomeTransactions = transactionsDb.filter(
      (t) => t.type === 'Income'
    );
    const expenseTransactions = transactionsDb.filter(
      (t) => t.type === 'Expense'
    );

    const totalIncome = incomeTransactions.reduce(
      (sum, t) => sum + parseFloat(t.amount),
      0
    );
    const totalExpense = expenseTransactions.reduce(
      (sum, t) => sum + parseFloat(t.amount),
      0
    );

    const balance = totalIncome - totalExpense;

    // Category breakdown
    const categoryBreakdown = {};
    expenseTransactions.forEach((t) => {
      categoryBreakdown[t.category] =
        (categoryBreakdown[t.category] || 0) + parseFloat(t.amount);
    });

    return createResponse(true, {
      totalIncome,
      totalExpense,
      balance,
      transactionCount: transactionsDb.length,
      categoryBreakdown,
      savingsRate: totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : 0,
    });
  } catch (error) {
    return createResponse(false, null, {
      message: 'Failed to fetch analytics',
      details: error.message,
    });
  }
};

// GET: Monthly trend data
export const getMonthlyTrend = async () => {
  try {
    await delay();

    const monthlyData = {};

    transactionsDb.forEach((t) => {
      const date = new Date(t.date + 'T00:00:00');
      const monthKey = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
      });

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { income: 0, expense: 0 };
      }

      if (t.type === 'Income') {
        monthlyData[monthKey].income += parseFloat(t.amount);
      } else {
        monthlyData[monthKey].expense += parseFloat(t.amount);
      }
    });

    const trend = Object.entries(monthlyData).map(([month, data]) => ({
      month,
      ...data,
      balance: data.income - data.expense,
    }));

    return createResponse(true, trend);
  } catch (error) {
    return createResponse(false, null, {
      message: 'Failed to fetch monthly trend',
      details: error.message,
    });
  }
};

/**
 * UTILITY APIs
 */

// GET: Database statistics
export const getDatabaseStats = async () => {
  try {
    await delay();

    return createResponse(true, {
      totalTransactions: transactionsDb.length,
      databaseSize: JSON.stringify(transactionsDb).length + ' bytes',
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    return createResponse(false, null, {
      message: 'Failed to fetch database stats',
      details: error.message,
    });
  }
};

// POST: Reset database to mock data
export const resetDatabase = async () => {
  try {
    await delay();

    transactionsDb = JSON.parse(JSON.stringify(mockTransactions));
    saveDb(transactionsDb); // Persist to localStorage

    return createResponse(true, {
      message: 'Database reset to mock data successfully',
      count: transactionsDb.length,
    });
  } catch (error) {
    return createResponse(false, null, {
      message: 'Failed to reset database',
      details: error.message,
    });
  }
};

/**
 * EXPORT APIs
 */

// GET: Export transactions as JSON
export const exportTransactionsJSON = async (filters = {}) => {
  try {
    await delay();

    const response = await getTransactions(filters);
    if (!response.success) {
      throw new Error(response.error.message);
    }

    const exportData = {
      exportDate: new Date().toISOString(),
      totalCount: response.data.total,
      transactions: response.data.transactions,
    };

    return createResponse(true, exportData);
  } catch (error) {
    return createResponse(false, null, {
      message: 'Failed to export transactions',
      details: error.message,
    });
  }
};

// GET: Get transaction stats by category
export const getTransactionsByCategory = async () => {
  try {
    await delay();

    const categoryData = {};

    transactionsDb.forEach((t) => {
      if (!categoryData[t.category]) {
        categoryData[t.category] = {
          count: 0,
          total: 0,
          income: 0,
          expense: 0,
        };
      }

      categoryData[t.category].count += 1;
      categoryData[t.category].total += parseFloat(t.amount);

      if (t.type === 'Income') {
        categoryData[t.category].income += parseFloat(t.amount);
      } else {
        categoryData[t.category].expense += parseFloat(t.amount);
      }
    });

    return createResponse(true, categoryData);
  } catch (error) {
    return createResponse(false, null, {
      message: 'Failed to fetch category stats',
      details: error.message,
    });
  }
};
