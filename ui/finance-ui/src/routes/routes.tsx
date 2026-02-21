import { lazy, Suspense } from 'react';
import { Navigate } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import PageLoader from '../components/common/PageLoader';
import { PATHS } from './paths';
import { requireAuth } from './guard';

// Lazy load components
const Dashboard = lazy(() => import('../pages/Dashboard'));
const ProcessingRuns = lazy(() => import('../pages/ProcessingRuns'));
const CashflowManagement = lazy(() => import('../pages/CashflowManagement'));
const Unauthorized = lazy(() => import('../pages/Unauthorized'));
const Login = lazy(() => import('../pages/Login'));
const NotFound = lazy(() => import('../pages/NotFound'));
const CashflowCalculatorPage = lazy(() => import('../pages/CashflowCalculatorPage'));

export const routes: RouteObject[] = [
    {
        path: '/',
        element: <Navigate to={PATHS.LOGIN} replace />,
    },
    {
        path: PATHS.LOGIN,
        element: (
            <Suspense fallback={<PageLoader />}>
                <Login />
            </Suspense>
        ),
    },
    {
        path: '/:username',
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <Navigate to="dashboard" replace />,
            },
            {
                path: 'dashboard',
                loader: requireAuth(),
                element: (
                    <Suspense fallback={<PageLoader />}>
                        <Dashboard />
                    </Suspense>
                ),
            },
            {
                path: 'cohort',
                async loader(args) {
                    await requireAuth(['COHORT_PAGINATION', 'COHORT_VIEW'])(args);
                    const { cohortLoader } = await import('../pages/CohortManagement');
                    return cohortLoader(args);
                },
                async lazy() {
                    const { default: CohortManagement, cohortAction } = await import('../pages/CohortManagement');
                    return {
                        Component: CohortManagement,
                        action: cohortAction,
                    };
                },
            },
            {
                path: 'processing',
                loader: requireAuth(),
                element: (
                    <Suspense fallback={<PageLoader />}>
                        <ProcessingRuns />
                    </Suspense>
                ),
            },
            {
                path: 'cashflow',
                loader: requireAuth(),
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
                path: 'cohort/:id',
                async loader(args) {
                    await requireAuth(['COHORT_VIEW'])(args);
                    const { policyDetailsLoader } = await import('../pages/PolicyDetails');
                    return policyDetailsLoader(args);
                },
                async lazy() {
                    const { default: PolicyDetails } = await import('../pages/PolicyDetails');
                    return {
                        Component: PolicyDetails,
                    };
                },
            },
            {
                path: 'calculator',
                loader: requireAuth(),
                element: (
                    <Suspense fallback={<PageLoader />}>
                        <CashflowCalculatorPage />
                    </Suspense>
                ),
            },
            {
                path: 'unauthorized',
                element: (
                    <Suspense fallback={<PageLoader />}>
                        <Unauthorized />
                    </Suspense>
                ),
            },
            {
                path: '*',
                element: <Navigate to="404" replace />,
            },
        ],
    },
];
