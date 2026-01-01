import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import { PATHS } from './paths';

// Lazy load components
const Dashboard = lazy(() => import('../pages/Dashboard'));
const CohortManagement = lazy(() => import('../pages/CohortManagement'));
const ProcessingRuns = lazy(() => import('../pages/ProcessingRuns'));
const CashflowManagement = lazy(() => import('../pages/CashflowManagement'));
const NotFound = lazy(() => import('../pages/NotFound'));

// Loading component
const PageLoader = () => (
    <div className="flex h-full w-full items-center justify-center p-20">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
    </div>
);

export const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: (
                    <Suspense fallback={<PageLoader />}>
                        <Dashboard />
                    </Suspense>
                ),
            },
            {
                path: PATHS.COHORT,
                element: (
                    <Suspense fallback={<PageLoader />}>
                        <CohortManagement />
                    </Suspense>
                ),
            },
            {
                path: PATHS.PROCESSING,
                element: (
                    <Suspense fallback={<PageLoader />}>
                        <ProcessingRuns />
                    </Suspense>
                ),
            },
            {
                path: PATHS.CASHFLOW,
                element: (
                    <Suspense fallback={<PageLoader />}>
                        <CashflowManagement />
                    </Suspense>
                ),
            },
            {
                path: '404',
                element: (
                    <Suspense fallback={<PageLoader />}>
                        <NotFound />
                    </Suspense>
                ),
            },
            {
                path: PATHS.NOT_FOUND,
                element: <Navigate to="/404" replace />,
            },
        ],
    },
]);
