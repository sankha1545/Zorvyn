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
  const initializeApp = useStore((s) => s.initializeApp);

  // Initialize app on mount - load all data from backend
  useEffect(() => {
    const loadApp = async () => {
      try {
        await initializeApp();
      } catch (error) {
        console.error('Error initializing app:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadApp();
  }, []);

  return (
    <Layout>
      <AppContent />
    </Layout>
  );
}
