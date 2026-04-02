import { useEffect } from 'react';
import { Layout } from './components/Layout';
import useStore from './store/useStore';
import { getRouteComponent } from './appRouter';

function AppContent() {
  const activePage = useStore((s) => s.activePage);
  const RouteComponent = getRouteComponent(activePage);
  
  return <RouteComponent />;
}

export default function App() {
  const setIsLoading = useStore((s) => s.setIsLoading);
  const initTheme = useStore((s) => s.initTheme);

  // Initialize theme on mount
  useEffect(() => {
    initTheme();
  }, [initTheme]);

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
