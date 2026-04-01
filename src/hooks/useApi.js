import { useCallback } from 'react';
import useStore from './useStore';

/**
 * Custom hook for managing transactions with automatic loading/error handling
 * Simplifies component logic by handling state management internally
 */
export function useTransactions() {
  const {
    transactions,
    isTransactionLoading,
    transactionError,
    fetchTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    setTransactionError,
  } = useStore();

  // Fetch with error handling
  const fetch = useCallback(
    async (filters = {}) => {
      try {
        const response = await fetchTransactions(filters);
        return response;
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
        return { success: false, error: error.message };
      }
    },
    [fetchTransactions]
  );

  // Create with error handling
  const create = useCallback(
    async (transactionData) => {
      try {
        const response = await addTransaction(transactionData);
        if (response.success) {
          return response;
        } else {
          throw new Error(response.error?.message || 'Failed to create');
        }
      } catch (error) {
        console.error('Failed to create transaction:', error);
        return { success: false, error: error.message };
      }
    },
    [addTransaction]
  );

  // Update with error handling
  const update = useCallback(
    async (id, updateData) => {
      try {
        const response = await updateTransaction(id, updateData);
        if (response.success) {
          return response;
        } else {
          throw new Error(response.error?.message || 'Failed to update');
        }
      } catch (error) {
        console.error('Failed to update transaction:', error);
        return { success: false, error: error.message };
      }
    },
    [updateTransaction]
  );

  // Delete with error handling
  const delete_ = useCallback(
    async (id) => {
      try {
        const response = await deleteTransaction(id);
        if (response.success) {
          return response;
        } else {
          throw new Error(response.error?.message || 'Failed to delete');
        }
      } catch (error) {
        console.error('Failed to delete transaction:', error);
        return { success: false, error: error.message };
      }
    },
    [deleteTransaction]
  );

  // Clear errors
  const clearError = useCallback(() => {
    setTransactionError(null);
  }, [setTransactionError]);

  return {
    transactions,
    isLoading: isTransactionLoading,
    error: transactionError,
    fetch,
    create,
    update,
    delete: delete_,
    clearError,
  };
}

/**
 * Custom hook for managing analytics data
 * Handles analytics and monthly trend data fetching
 */
export function useAnalytics() {
  const {
    analytics,
    monthlyTrend,
    analyticsLoading,
    analyticsError,
    trendLoading,
    trendError,
    fetchAnalytics,
    fetchMonthlyTrend,
  } = useStore();

  // Fetch analytics
  const loadAnalytics = useCallback(async () => {
    try {
      return await fetchAnalytics();
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      return { success: false, error: error.message };
    }
  }, [fetchAnalytics]);

  // Fetch trend
  const loadTrend = useCallback(async () => {
    try {
      return await fetchMonthlyTrend();
    } catch (error) {
      console.error('Failed to fetch trend:', error);
      return { success: false, error: error.message };
    }
  }, [fetchMonthlyTrend]);

  return {
    analytics,
    monthlyTrend,
    analyticsLoading,
    analyticsError,
    trendLoading,
    trendError,
    loadAnalytics,
    loadTrend,
  };
}

/**
 * Custom hook for managing toast/alert notifications
 * Display API errors and success messages
 */
export function useApiNotification() {
  const { transactionError, clearError } = useTransactions();

  const showError = useCallback((message) => {
    console.error('API Error:', message);
    // TODO: Integrate with your toast/notification system
    // Example: toast.error(message);
  }, []);

  const showSuccess = useCallback((message) => {
    console.log('API Success:', message);
    // TODO: Integrate with your toast/notification system
    // Example: toast.success(message);
  }, []);

  return {
    showError,
    showSuccess,
  };
}
