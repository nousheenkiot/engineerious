export const PATHS = {
    DASHBOARD: '/',
    COHORT: '/cohort',
    PROCESSING: '/processing',
    CASHFLOW: '/cashflow', // New service we just added backend for
    REPORTS: '/reports',
    SETTINGS: '/settings',
    POLICY_DETAILS: '/cohort/:id',
    CALCULATOR: '/calculator',
    UNAUTHORIZED: '/unauthorized',
    LOGIN: '/login',
    NOT_FOUND: '*',
} as const;
