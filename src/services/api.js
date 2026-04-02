/**
 * FinTrack API Service
 * Uses the real backend when available and falls back to a localStorage-backed mock API.
 */

import { transactions as seedTransactions } from '../data/mockData';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';
const LOCAL_DB_KEY = 'fintrack-db';
const CURRENT_MONTH_PREFIX = '2026-03';
const PREVIOUS_MONTH_PREFIX = '2026-02';
let apiMode = 'auto';

const createResponse = (success, data = null, error = null) => ({
  success,
  data,
  error,
  timestamp: new Date().toISOString(),
});

const handleError = (error) => {
  console.error('API Error:', error);
  return createResponse(false, null, {
    message: error.message || 'API request failed',
    details: error.message,
  });
};

const isBrowser = typeof window !== 'undefined';

const cloneTransactions = (transactions) =>
  transactions.map((transaction) => ({ ...transaction }));

const getSeedData = () => ({
  transactions: cloneTransactions(seedTransactions),
});

const readLocalDb = () => {
  if (!isBrowser) {
    return getSeedData();
  }

  const saved = window.localStorage.getItem(LOCAL_DB_KEY);
  if (!saved) {
    const initialData = getSeedData();
    window.localStorage.setItem(LOCAL_DB_KEY, JSON.stringify(initialData));
    return initialData;
  }

  try {
    const parsed = JSON.parse(saved);
    return {
      transactions: Array.isArray(parsed?.transactions)
        ? parsed.transactions
        : cloneTransactions(seedTransactions),
    };
  } catch (error) {
    console.error('Failed to parse local transaction database:', error);
    const initialData = getSeedData();
    window.localStorage.setItem(LOCAL_DB_KEY, JSON.stringify(initialData));
    return initialData;
  }
};

const writeLocalDb = (data) => {
  if (!isBrowser) return;
  window.localStorage.setItem(LOCAL_DB_KEY, JSON.stringify(data));
};

const formatChartDate = (date) =>
  new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

const buildAnalyticsFromTransactions = (transactions) => {
  const allTransactions = [...transactions].sort((a, b) => a.date.localeCompare(b.date));
  const currentMonth = allTransactions.filter((transaction) =>
    transaction.date.startsWith(CURRENT_MONTH_PREFIX)
  );
  const previousMonth = allTransactions.filter((transaction) =>
    transaction.date.startsWith(PREVIOUS_MONTH_PREFIX)
  );

  const currentIncome = currentMonth
    .filter((transaction) => transaction.type === 'Income')
    .reduce((sum, transaction) => sum + Number(transaction.amount || 0), 0);
  const currentExpenses = currentMonth
    .filter((transaction) => transaction.type === 'Expense')
    .reduce((sum, transaction) => sum + Number(transaction.amount || 0), 0);
  const previousExpenses = previousMonth
    .filter((transaction) => transaction.type === 'Expense')
    .reduce((sum, transaction) => sum + Number(transaction.amount || 0), 0);

  const dailyBalance = {};
  allTransactions.forEach((transaction) => {
    const amount = Number(transaction.amount || 0);
    if (!dailyBalance[transaction.date]) {
      dailyBalance[transaction.date] = 0;
    }
    dailyBalance[transaction.date] += transaction.type === 'Income' ? amount : -amount;
  });

  let cumulativeBalance = 0;
  const balanceTrend = Object.entries(dailyBalance)
    .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
    .map(([date, dailyChange]) => {
      cumulativeBalance += dailyChange;
      return {
        date: formatChartDate(date),
        balance: Number(cumulativeBalance.toFixed(2)),
        fullDate: date,
      };
    });

  const spendingByCategory = {};
  currentMonth
    .filter((transaction) => transaction.type === 'Expense')
    .forEach((transaction) => {
      const category = transaction.category || 'Other';
      spendingByCategory[category] = (spendingByCategory[category] || 0) + Number(transaction.amount || 0);
    });

  const spendingBreakdown = Object.entries(spendingByCategory)
    .map(([name, value]) => ({
      name,
      value: Number(value.toFixed(2)),
    }))
    .sort((a, b) => b.value - a.value);

  const merchantSpending = {};
  currentMonth.forEach((transaction) => {
    const merchant = transaction.merchant || 'Unknown';
    merchantSpending[merchant] = (merchantSpending[merchant] || 0) + Number(transaction.amount || 0);
  });

  const topCategory = spendingBreakdown[0] || { name: 'N/A', value: 0 };
  const topMerchant = Object.entries(merchantSpending)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => ({ name, value: Number(value.toFixed(2)) }))[0] || { name: 'N/A', value: 0 };

  const expenseChange = previousExpenses > 0
    ? Number((((currentExpenses - previousExpenses) / previousExpenses) * 100).toFixed(1))
    : 0;

  return createResponse(true, {
    currentMonth: {
      income: Number(currentIncome.toFixed(2)),
      expenses: Number(currentExpenses.toFixed(2)),
      balance: Number((currentIncome - currentExpenses).toFixed(2)),
    },
    previousMonth: {
      expenses: Number(previousExpenses.toFixed(2)),
    },
    balanceTrend,
    spendingBreakdown,
    insights: {
      topCategory: topCategory.name,
      topCategoryAmount: topCategory.value,
      topMerchant: topMerchant.name,
      topMerchantAmount: topMerchant.value,
      expenseChange,
      savingsRate: currentIncome > 0
        ? Math.round(((currentIncome - currentExpenses) / currentIncome) * 100)
        : 0,
    },
    transactionCount: allTransactions.length,
    currentMonthCount: currentMonth.length,
  });
};

const buildMonthlyTrendFromTransactions = (transactions) => {
  const monthlyData = {};

  transactions.forEach((transaction) => {
    const date = new Date(`${transaction.date}T00:00:00`);
    const monthKey = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
    });

    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { income: 0, expense: 0 };
    }

    if (transaction.type === 'Income') {
      monthlyData[monthKey].income += Number(transaction.amount || 0);
    } else {
      monthlyData[monthKey].expense += Number(transaction.amount || 0);
    }
  });

  return Object.entries(monthlyData).map(([month, data]) => ({
    month,
    ...data,
    balance: data.income - data.expense,
  }));
};

const handleLocalRequest = async (path, options = {}) => {
  const method = (options.method || 'GET').toUpperCase();
  const db = readLocalDb();
  const segments = path.replace(/^\/api\//, '').split('/');

  if (path === '/api/health' && method === 'GET') {
    return createResponse(true, {
      status: 'ok',
      mode: 'local',
    });
  }

  if (path === '/api/reset' && method === 'POST') {
    const initialData = getSeedData();
    writeLocalDb(initialData);
    return createResponse(true, {
      message: 'Database reset successfully',
      transactions: initialData.transactions,
    });
  }

  if (path === '/api/analytics' && method === 'GET') {
    return buildAnalyticsFromTransactions(db.transactions || []);
  }

  if (path === '/api/transactions' && method === 'GET') {
    return createResponse(true, {
      transactions: db.transactions || [],
    });
  }

  if (path === '/api/transactions' && method === 'POST') {
    const payload = JSON.parse(options.body || '{}');
    const { date, description, amount, category, type, merchant, status } = payload;

    if (!date || !description || !amount || !category || !type || !merchant) {
      return createResponse(false, null, {
        message: 'Missing required fields',
      });
    }

    const maxId = Math.max(0, ...db.transactions.map((transaction) => transaction.id || 0));
    const transaction = {
      id: maxId + 1,
      date,
      description,
      amount: Number(amount),
      category,
      type,
      merchant,
      status: status || 'Completed',
      createdAt: new Date().toISOString(),
    };

    const nextDb = {
      transactions: [transaction, ...db.transactions],
    };
    writeLocalDb(nextDb);

    return createResponse(true, {
      transaction,
    });
  }

  if (segments[0] === 'transactions' && segments[1]) {
    const id = Number(segments[1]);
    const index = db.transactions.findIndex((transaction) => Number(transaction.id) === id);

    if (index === -1) {
      return createResponse(false, null, {
        message: 'Transaction not found',
      });
    }

    if (method === 'PUT') {
      const payload = JSON.parse(options.body || '{}');
      const transaction = {
        ...db.transactions[index],
        ...payload,
        amount: payload.amount !== undefined
          ? Number(payload.amount)
          : Number(db.transactions[index].amount),
        updatedAt: new Date().toISOString(),
      };

      const nextTransactions = [...db.transactions];
      nextTransactions[index] = transaction;
      writeLocalDb({ transactions: nextTransactions });

      return createResponse(true, {
        transaction,
      });
    }

    if (method === 'DELETE') {
      const transaction = db.transactions[index];
      const nextTransactions = db.transactions.filter((item) => Number(item.id) !== id);
      writeLocalDb({ transactions: nextTransactions });

      return createResponse(true, {
        transaction,
      });
    }
  }

  if (path === '/api/monthly-trend' && method === 'GET') {
    return createResponse(true, buildMonthlyTrendFromTransactions(db.transactions || []));
  }

  throw new Error(`Local API route not implemented: ${method} ${path}`);
};

const request = async (path, options = {}) => {
  if (apiMode === 'local') {
    return handleLocalRequest(path, options);
  }

  try {
    const response = await fetch(`${API_BASE}${path.replace('/api', '')}`, {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      body: options.body,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    apiMode = 'remote';
    return result;
  } catch (error) {
    const shouldFallback = error instanceof TypeError || /HTTP 404|HTTP 405|Failed to fetch/i.test(error.message);
    if (!shouldFallback) {
      throw error;
    }

    console.warn(`API request failed for ${path}. Falling back to local storage mode.`, error);
    apiMode = 'local';
    return handleLocalRequest(path, options);
  }
};

/**
 * TRANSACTION APIs
 */

// GET: Fetch all transactions
export const getTransactions = async (options = {}) => {
  try {
    const result = await request('/api/transactions');

    if (!result.success) {
      return result;
    }

    let transactions = result.data.transactions || [];

    // Client-side filtering
    if (options.type && options.type !== 'All') {
      transactions = transactions.filter((t) => t.type === options.type);
    }

    if (options.category && options.category !== 'All') {
      transactions = transactions.filter((t) => t.category === options.category);
    }

    if (options.status && options.status !== 'All') {
      transactions = transactions.filter((t) => t.status === options.status);
    }

    if (options.search) {
      const searchLower = options.search.toLowerCase();
      transactions = transactions.filter(
        (t) =>
          t.description.toLowerCase().includes(searchLower) ||
          t.merchant.toLowerCase().includes(searchLower)
      );
    }

    // Sorting
    if (options.sortBy) {
      transactions.sort((a, b) => {
        const order = options.sortOrder === 'desc' ? -1 : 1;
        if (a[options.sortBy] < b[options.sortBy]) return -1 * order;
        if (a[options.sortBy] > b[options.sortBy]) return 1 * order;
        return 0;
      });
    }

    // Pagination
    if (options.skip !== undefined && options.limit) {
      transactions = transactions.slice(options.skip, options.skip + options.limit);
    }

    return createResponse(true, {
      transactions,
      total: result.data.transactions.length,
      count: transactions.length,
    });
  } catch (error) {
    return handleError(error);
  }
};

// GET: Fetch transaction by ID
export const getTransactionById = async (id) => {
  try {
    const result = await request('/api/transactions');
    const transaction = result.data.transactions.find((t) => Number(t.id) === Number(id));

    if (!transaction) {
      return createResponse(false, null, {
        message: `Transaction with id ${id} not found`,
      });
    }

    return createResponse(true, transaction);
  } catch (error) {
    return handleError(error);
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

    const result = await request('/api/transactions', {
      method: 'POST',
      body: JSON.stringify(transactionData),
    });

    if (!result.success) {
      return result;
    }

    return createResponse(true, {
      message: 'Transaction created successfully',
      transaction: result.data.transaction,
    });
  } catch (error) {
    return handleError(error);
  }
};

// PUT: Update transaction
export const updateTransaction = async (id, updateData) => {
  try {
    const result = await request(`/api/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });

    if (!result.success) {
      return result;
    }

    return createResponse(true, {
      message: 'Transaction updated successfully',
      transaction: result.data.transaction,
    });
  } catch (error) {
    return handleError(error);
  }
};

// DELETE: Delete transaction
export const deleteTransaction = async (id) => {
  try {
    const result = await request(`/api/transactions/${id}`, {
      method: 'DELETE',
    });

    if (!result.success) {
      return result;
    }

    return createResponse(true, {
      message: 'Transaction deleted successfully',
      transaction: result.data.transaction,
    });
  } catch (error) {
    return handleError(error);
  }
};

/**
 * ANALYTICS APIs
 */

// GET: Analytics dashboard data
export const getAnalytics = async () => {
  try {
    console.log('Fetching analytics from:', `${API_BASE}/analytics`);
    const result = await request('/api/analytics');
    console.log('Analytics result:', result);
    return result;
  } catch (error) {
    console.error('Analytics fetch error:', error);
    return handleError(error);
  }
};

// GET: Monthly trend data
export const getMonthlyTrend = async () => {
  try {
    const result = await request('/api/transactions');
    const transactions = result.data.transactions || [];
    return createResponse(true, buildMonthlyTrendFromTransactions(transactions));
  } catch (error) {
    return handleError(error);
  }
};

/**
 * UTILITY APIs
 */

// GET: Health check
export const healthCheck = async () => {
  try {
    const result = await request('/api/health');
    return result?.success !== undefined ? result : createResponse(true, result);
  } catch (error) {
    return handleError(error);
  }
};

// POST: Reset database
export const resetDatabase = async () => {
  try {
    const result = await request('/api/reset', {
      method: 'POST',
    });
    return result;
  } catch (error) {
    return handleError(error);
  }
};
