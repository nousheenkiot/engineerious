export const PATHS = {
    DASHBOARD: '/:username/dashboard',
    COHORT: '/:username/cohort',
    PROCESSING: '/:username/processing',
    CASHFLOW: '/:username/cashflow',
    REPORTS: '/:username/reports',
    SETTINGS: '/:username/settings',
    POLICY_DETAILS: '/:username/cohort/:id',
    CALCULATOR: '/:username/calculator',
    UNAUTHORIZED: '/:username/unauthorized',
    LOGIN: '/login',
    REGISTER: '/register',
    NOT_FOUND: '*',
} as const;
