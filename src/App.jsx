import { useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Settings from './pages/Settings';
import useStore from './store/useStore';

function AppContent() {
  const activePage = useStore((s) => s.activePage);

  switch (activePage) {
    case 'dashboard':
      return <Dashboard />;
    case 'transactions':
      return <Transactions />;
    case 'settings':
      return <Settings />;
    default:
      return <Dashboard />;
  }
}

export default function App() {
  const setIsLoading = useStore((s) => s.setIsLoading);

  // Simulate initial data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, [setIsLoading]);

  return (
    <Layout>
      <AppContent />
    </Layout>
  );
}
