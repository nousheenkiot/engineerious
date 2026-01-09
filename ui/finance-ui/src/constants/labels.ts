/**
 * Application Labels and Text Constants
 * Centralized location for all UI labels, messages, and text content
 * Following industry standard practice for internationalization readiness
 */

export const LABELS = {
    // App Name
    APP_NAME: 'FinanceEngine',

    // Navigation
    NAVIGATION: {
        DASHBOARD: 'Dashboard',
        COHORT_MANAGEMENT: 'Cohort Management',
        PROCESSING_RUNS: 'Processing Runs',
        CASHFLOWS: 'Cashflows',
        REPORTS: 'Reports',
        SETTINGS: 'Settings',
    },

    // Page Titles
    PAGE_TITLES: {
        COHORT_MANAGEMENT: 'Cohort Management',
        POLICY_DETAILS: 'Policy Details',
        CASHFLOW_MANAGEMENT: 'Cashflow Management',
        CASHFLOW_PROJECTION: 'Cashflow Projection',
        FINANCIAL_DASHBOARD: 'Financial Dashboard',
    },

    // Page Descriptions
    PAGE_DESCRIPTIONS: {
        COHORT_MANAGEMENT: 'Manage insurance policy cohorts and financial year data.',
        CASHFLOW_MANAGEMENT: 'Record principal inflows and track IFRS 17 CSM updates.',
        FINANCIAL_DASHBOARD: "Welcome back, here's what happening with your projects today.",
    },

    // Section Headers
    SECTIONS: {
        POLICY_SUMMARY: 'Policy Summary',
        FINANCIAL_INDICATORS: 'Financial Indicators',
        DETAILED_CASHFLOWS: 'Detailed Cashflows',
        SIMULATOR: 'Simulator',
        PROCESSING_VOLUME: 'Processing Volume',
        LIVE_ACTIVITY: 'Live Activity',
    },

    // Button Labels
    BUTTONS: {
        ADD_NEW_COHORT: 'Add New Cohort',
        CALCULATE: 'Calculate',
        CANCEL: 'Cancel',
        BACK: 'Back',
        BACK_TO_POLICY_DETAILS: 'Back to PolicyDetails',
        GO_BACK: 'Go Back',
        REFRESH_DATA: 'Refresh Data',
        SYNC_SERVICES: 'Sync Services',
        NEW_PROCESS: 'New Process',
        VIEW_DETAILS: 'View Details',
        VIEW_FULL_AUDIT_LOG: 'View Full Audit Log',
        CREATE_COHORT: 'Create Cohort',
        UPDATE_COHORT: 'Update Cohort',
        CALCULATE_NEW_PREMIUM: 'Calculate New Premium',
    },

    // Dialog Titles
    DIALOGS: {
        CREATE_NEW_COHORT: 'Create New Cohort',
        EDIT_COHORT: 'Edit Cohort',
        COHORT_DETAILS: 'Cohort Details',
    },

    // Form Field Labels
    FORM_FIELDS: {
        POLICY_NUMBER: 'Policy number',
        POLICY_HOLDER_NAME: 'Policy holder name',
        ANNUAL_PREMIUM: 'Annual premium ($)',
        FINANCIAL_YEAR_DATE: 'Financial year date',
        POLICY_ASSUMPTION: 'Policy assumption',
        INTEREST_RATE: 'Interest Rate (%)',
        PREMIUM_AMOUNT: 'Premium Amount',
        CURRENT_ASSUMPTION: 'Current Assumption',
        YEARS: 'Number of Years',
        NEW_PREMIUM: 'New Premium',
    },

    // Table Headers
    TABLE_HEADERS: {
        ID: 'ID',
        POLICY_NUMBER: 'Policy Number',
        HOLDER_NAME: 'Holder Name',
        PREMIUM: 'Premium',
        FY_DATE: 'FY Date',
        ASSUMPTION: 'Assumption',
        ACTIONS: 'Actions',
        DATE: 'Date',
        AMOUNT: 'Amount',
        TYPE: 'Type',
        STATUS: 'Status',
        RECORDED_AT: 'Recorded At',
    },

    // Status Messages
    MESSAGES: {
        CASHFLOW_INTERFACE_COMING_SOON: 'Cashflow recording interface coming soon...',
        CASHFLOW_SAGA_INTEGRATION: 'Integrates with the Saga Choreography pattern for automated CSM adjustments.',
        NO_CALCULATION_DATA: 'No calculation data found. Please start from a Policy Details page.',
        NO_COHORTS_FOUND: 'No cohorts found matching your search',
        NO_CASHFLOWS_RECORDED: 'No cashflows recorded for this policy.',
        POLICY_DELETE_CONFIRM: 'Are you sure you want to delete this policy?',
        POLICY_NOT_FOUND: 'Policy not found',
        OPERATION_SUCCESSFUL: 'Operation successful',
        CALCULATOR_PLACEHOLDER: 'Enter an interest rate and click Calculate to see projections',
    },

    // Success Messages
    SUCCESS: {
        POLICY_CREATED: 'Policy created successfully',
        POLICY_UPDATED: 'Policy updated successfully',
        POLICY_DELETED: 'Policy deleted successfully',
    },

    // Error Messages
    ERRORS: {
        FAILED_TO_LOAD_POLICY: 'Failed to load policy or cashflow details',
        FAILED_TO_FETCH_COHORT: 'Failed to fetch cohort data',
        ACTION_FAILED: 'Action failed',
        INVALID_INTENT: 'Invalid intent',
    },

    // Stat Card Labels
    STATS: {
        TOTAL_POLICIES: 'Total Policies',
        PROCESSING_RUNS: 'Processing Runs',
        AVERAGE_LATENCY: 'Average Latency',
        SYSTEM_HEALTH: 'System Health',
        TOTAL_CASHFLOW_SUM: 'Total Cashflow (Sum)',
        CASHFLOW_COUNT: 'Cashflow Count',
        PENDING_REVERSALS: 'Pending Reversals',
        VS_LAST_MONTH: 'vs last month',
    },

    // Placeholders
    PLACEHOLDERS: {
        SEARCH_COHORT: 'Search by holder name or policy number...',
        ENTER_INTEREST_RATE: 'Enter rate (e.g. 5)',
    },

    // Calculator Labels
    CALCULATOR: {
        PROJECTION_RESULTS: 'Projection Results (Rate: {rate}%)',
        INTEREST_GENERATED: 'Interest Generated',
        TOTAL_PROJECTED_VALUE: 'Total Projected Value',
        OF_CASHFLOWS: '({rate}% of Cashflows)',
        PREMIUM_PLUS_INTEREST: '(Premium + Interest)',
    },

    // Assumption Types
    ASSUMPTIONS: {
        AGGRESSIVE: 'Aggressive',
        MODERATE: 'Moderate',
        CONSERVATIVE: 'Conservative',
    },

    // Activity Status
    ACTIVITY_STATUS: {
        SUCCESS: 'SUCCESS',
        FINISHED: 'FINISHED',
        FAILED: 'FAILED',
        REVERSED: 'REVERSED',
    },

    // Validation Messages
    VALIDATION: {
        POLICY_NUMBER_REQUIRED: 'Policy Number is required',
        HOLDER_NAME_REQUIRED: 'Holder Name is required',
        PREMIUM_POSITIVE: 'Premium must be positive',
        INVALID_DATE_FORMAT: 'Invalid date format (YYYY-MM-DD)',
    },
} as const;

// Type-safe access to labels
export type Labels = typeof LABELS;
