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
        path: PATHS.LOGIN,
        element: (
            <Suspense fallback={<PageLoader />}>
                <Login />
            </Suspense>
        ),
    },
    {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                index: true,
                loader: requireAuth(),
                element: (
                    <Suspense fallback={<PageLoader />}>
                        <Dashboard />
                    </Suspense>
                ),
            },
            {
                path: PATHS.COHORT,
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
                path: PATHS.PROCESSING,
                loader: requireAuth(),
                element: (
                    <Suspense fallback={<PageLoader />}>
                        <ProcessingRuns />
                    </Suspense>
                ),
            },
            {
                path: PATHS.CASHFLOW,
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
                path: PATHS.POLICY_DETAILS,
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
                path: PATHS.CALCULATOR,
                element: (
                    <Suspense fallback={<PageLoader />}>
                        <CashflowCalculatorPage />
                    </Suspense>
                ),
            },
            {
                path: PATHS.UNAUTHORIZED,
                element: (
                    <Suspense fallback={<PageLoader />}>
                        <Unauthorized />
                    </Suspense>
                ),
            },
            {
                path: PATHS.NOT_FOUND,
                element: <Navigate to="/404" replace />,
            },
        ],
    },
];
