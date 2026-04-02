/**
 * FinTrack API Service
 * Calls real Express backend at http://localhost:5000
 * All data is persisted to server/db.json
 */

const API_BASE = 'http://localhost:5000/api';

// API Response wrapper
const createResponse = (success, data = null, error = null) => ({
  success,
  data,
  error,
  timestamp: new Date().toISOString(),
});

// Helper to handle API errors
const handleError = (error) => {
  console.error('API Error:', error);
  return createResponse(false, null, {
    message: error.message || 'API request failed',
    details: error.message,
  });
};

/**
 * TRANSACTION APIs
 */

// GET: Fetch all transactions
export const getTransactions = async (options = {}) => {
  try {
    const response = await fetch(`${API_BASE}/transactions`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    
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
    const response = await fetch(`${API_BASE}/transactions`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    const transaction = result.data.transactions.find((t) => t.id === id);

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

    const response = await fetch(`${API_BASE}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transactionData),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

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
    const response = await fetch(`${API_BASE}/transactions/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

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
    const response = await fetch(`${API_BASE}/transactions/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

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
    const response = await fetch(`${API_BASE}/analytics`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Analytics response status:', response.status, response.statusText);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
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
    const response = await fetch(`${API_BASE}/transactions`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    const transactions = result.data.transactions || [];

    const monthlyData = {};

    transactions.forEach((t) => {
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
    return handleError(error);
  }
};

/**
 * UTILITY APIs
 */

// GET: Health check
export const healthCheck = async () => {
  try {
    const response = await fetch(`${API_BASE}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    return createResponse(true, result);
  } catch (error) {
    return handleError(error);
  }
};

// POST: Reset database
export const resetDatabase = async () => {
  try {
    const response = await fetch(`${API_BASE}/reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    return handleError(error);
  }
};
