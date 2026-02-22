import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store } from './store';
import { useAppSelector } from './store/hooks';
import { router } from './routes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const AppContent: React.FC = () => {
  const mode = useAppSelector((state) => state.theme.mode);

  React.useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', mode);
    // Also update body class for legacy support
    document.body.className = mode === 'dark' ? 'bg-dark text-white' : 'bg-light text-dark';
  }, [mode]);

  return (
    <RouterProvider router={router} />
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </Provider>
  );
};

export default App;
