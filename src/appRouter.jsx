import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Settings from './pages/Settings';

/**
 * App Routes Configuration
 * Defines all available routes and their corresponding components
 */
export const routes = {
  dashboard: {
    id: 'dashboard',
    component: Dashboard,
    label: 'Dashboard',
  },
  transactions: {
    id: 'transactions',
    component: Transactions,
    label: 'Transactions',
  },
  settings: {
    id: 'settings',
    component: Settings,
    label: 'Settings',
  },
};

/**
 * Get route component by route ID
 * @param {string} routeId - The route identifier
 * @returns {React.Component} The component for the given route
 */
export const getRouteComponent = (routeId) => {
  const route = routes[routeId];
  return route ? route.component : routes.dashboard.component;
};

/**
 * Get all available route IDs
 * @returns {string[]} Array of route IDs
 */
export const getAvailableRoutes = () => {
  return Object.keys(routes);
};

/**
 * Validate if a route exists
 * @param {string} routeId - The route identifier
 * @returns {boolean} True if route exists
 */
export const isValidRoute = (routeId) => {
  return routeId in routes;
};
