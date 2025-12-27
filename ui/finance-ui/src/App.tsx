import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store } from './store';
import theme from './theme';
import MainLayout from './components/layout/MainLayout';

// Lazy load pages for better performance
import Dashboard from './pages/Dashboard';
import CohortManagement from './pages/CohortManagement';
import ProcessingRuns from './pages/ProcessingRuns';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const LoadingFallback = () => (
  <div className="flex h-screen w-full items-center justify-center bg-slate-950">
    <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-500 border-t-transparent shadow-lg shadow-primary-500/20"></div>
  </div>
);

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <BrowserRouter>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<MainLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="cohort" element={<CohortManagement />} />
                  <Route path="processing" element={<ProcessingRuns />} />
                  {/* Add more routes as needed */}
                </Route>
              </Routes>
            </Suspense>
          </BrowserRouter>
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  );
};

export default App;
