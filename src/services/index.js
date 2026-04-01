// Export all API services
export * from './api';

// Create API client instance (for future extensibility)
export const apiClient = {
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  timeout: 30000,
  retryAttempts: 3,
};

export default apiClient;
