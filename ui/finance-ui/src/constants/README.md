# Constants Refactoring

## Overview
All hardcoded UI labels, messages, and text content have been moved to a centralized constants file following industry best practices.

## Location
All constants are located in: `src/constants/labels.ts`

## Usage

### Import the constants
```typescript
import { LABELS } from '../constants/labels';
// or
import { LABELS } from '@/constants';
```

### Use in components
```typescript
// Instead of:
<Typography>Cohort Management</Typography>

// Use:
<Typography>{LABELS.PAGE_TITLES.COHORT_MANAGEMENT}</Typography>
```

## Available Constants

### App Information
- `LABELS.APP_NAME` - Application name

### Navigation
- `LABELS.NAVIGATION.DASHBOARD`
- `LABELS.NAVIGATION.COHORT_MANAGEMENT`
- `LABELS.NAVIGATION.PROCESSING_RUNS`
- `LABELS.NAVIGATION.CASHFLOWS`
- `LABELS.NAVIGATION.REPORTS`
- `LABELS.NAVIGATION.SETTINGS`

### Page Titles
- `LABELS.PAGE_TITLES.COHORT_MANAGEMENT`
- `LABELS.PAGE_TITLES.POLICY_DETAILS`
- `LABELS.PAGE_TITLES.CASHFLOW_MANAGEMENT`
- `LABELS.PAGE_TITLES.CASHFLOW_PROJECTION`
- `LABELS.PAGE_TITLES.FINANCIAL_DASHBOARD`

### Page Descriptions
- `LABELS.PAGE_DESCRIPTIONS.COHORT_MANAGEMENT`
- `LABELS.PAGE_DESCRIPTIONS.CASHFLOW_MANAGEMENT`
- `LABELS.PAGE_DESCRIPTIONS.FINANCIAL_DASHBOARD`

### Section Headers
- `LABELS.SECTIONS.POLICY_SUMMARY`
- `LABELS.SECTIONS.FINANCIAL_INDICATORS`
- `LABELS.SECTIONS.DETAILED_CASHFLOWS`
- `LABELS.SECTIONS.SIMULATOR`
- `LABELS.SECTIONS.PROCESSING_VOLUME`
- `LABELS.SECTIONS.LIVE_ACTIVITY`

### Button Labels
- `LABELS.BUTTONS.ADD_NEW_COHORT`
- `LABELS.BUTTONS.CALCULATE`
- `LABELS.BUTTONS.CANCEL`
- `LABELS.BUTTONS.BACK`
- `LABELS.BUTTONS.BACK_TO_POLICY_DETAILS`
- `LABELS.BUTTONS.GO_BACK`
- `LABELS.BUTTONS.REFRESH_DATA`
- `LABELS.BUTTONS.SYNC_SERVICES`
- `LABELS.BUTTONS.NEW_PROCESS`
- `LABELS.BUTTONS.VIEW_DETAILS`
- `LABELS.BUTTONS.VIEW_FULL_AUDIT_LOG`
- `LABELS.BUTTONS.CREATE_COHORT`
- `LABELS.BUTTONS.UPDATE_COHORT`

### Dialog Titles
- `LABELS.DIALOGS.CREATE_NEW_COHORT`
- `LABELS.DIALOGS.EDIT_COHORT`
- `LABELS.DIALOGS.COHORT_DETAILS`

### Form Field Labels
- `LABELS.FORM_FIELDS.POLICY_NUMBER`
- `LABELS.FORM_FIELDS.POLICY_HOLDER_NAME`
- `LABELS.FORM_FIELDS.ANNUAL_PREMIUM`
- `LABELS.FORM_FIELDS.FINANCIAL_YEAR_DATE`
- `LABELS.FORM_FIELDS.POLICY_ASSUMPTION`
- `LABELS.FORM_FIELDS.INTEREST_RATE`
- `LABELS.FORM_FIELDS.PREMIUM_AMOUNT`
- `LABELS.FORM_FIELDS.CURRENT_ASSUMPTION`

### Table Headers
- `LABELS.TABLE_HEADERS.ID`
- `LABELS.TABLE_HEADERS.POLICY_NUMBER`
- `LABELS.TABLE_HEADERS.HOLDER_NAME`
- `LABELS.TABLE_HEADERS.PREMIUM`
- `LABELS.TABLE_HEADERS.FY_DATE`
- `LABELS.TABLE_HEADERS.ASSUMPTION`
- `LABELS.TABLE_HEADERS.ACTIONS`
- `LABELS.TABLE_HEADERS.DATE`
- `LABELS.TABLE_HEADERS.AMOUNT`
- `LABELS.TABLE_HEADERS.TYPE`
- `LABELS.TABLE_HEADERS.STATUS`
- `LABELS.TABLE_HEADERS.RECORDED_AT`

### Messages
- `LABELS.MESSAGES.CASHFLOW_INTERFACE_COMING_SOON`
- `LABELS.MESSAGES.CASHFLOW_SAGA_INTEGRATION`
- `LABELS.MESSAGES.NO_CALCULATION_DATA`
- `LABELS.MESSAGES.NO_COHORTS_FOUND`
- `LABELS.MESSAGES.NO_CASHFLOWS_RECORDED`
- `LABELS.MESSAGES.POLICY_DELETE_CONFIRM`
- `LABELS.MESSAGES.POLICY_NOT_FOUND`
- `LABELS.MESSAGES.OPERATION_SUCCESSFUL`

### Success Messages
- `LABELS.SUCCESS.POLICY_CREATED`
- `LABELS.SUCCESS.POLICY_UPDATED`
- `LABELS.SUCCESS.POLICY_DELETED`

### Error Messages
- `LABELS.ERRORS.FAILED_TO_LOAD_POLICY`
- `LABELS.ERRORS.FAILED_TO_FETCH_COHORT`
- `LABELS.ERRORS.ACTION_FAILED`
- `LABELS.ERRORS.INVALID_INTENT`

### Statistics Labels
- `LABELS.STATS.TOTAL_POLICIES`
- `LABELS.STATS.PROCESSING_RUNS`
- `LABELS.STATS.AVERAGE_LATENCY`
- `LABELS.STATS.SYSTEM_HEALTH`
- `LABELS.STATS.TOTAL_CASHFLOW_SUM`
- `LABELS.STATS.CASHFLOW_COUNT`
- `LABELS.STATS.PENDING_REVERSALS`
- `LABELS.STATS.VS_LAST_MONTH`

### Placeholders
- `LABELS.PLACEHOLDERS.SEARCH_COHORT`
- `LABELS.PLACEHOLDERS.ENTER_INTEREST_RATE`

### Assumption Types
- `LABELS.ASSUMPTIONS.AGGRESSIVE`
- `LABELS.ASSUMPTIONS.MODERATE`
- `LABELS.ASSUMPTIONS.CONSERVATIVE`

### Activity Status
- `LABELS.ACTIVITY_STATUS.SUCCESS`
- `LABELS.ACTIVITY_STATUS.FINISHED`
- `LABELS.ACTIVITY_STATUS.FAILED`
- `LABELS.ACTIVITY_STATUS.REVERSED`

### Validation Messages
- `LABELS.VALIDATION.POLICY_NUMBER_REQUIRED`
- `LABELS.VALIDATION.HOLDER_NAME_REQUIRED`
- `LABELS.VALIDATION.PREMIUM_POSITIVE`
- `LABELS.VALIDATION.INVALID_DATE_FORMAT`

## Benefits

1. **Maintainability**: All text content in one place, easy to update
2. **Consistency**: Ensures consistent terminology across the application
3. **Internationalization Ready**: Easy to add i18n support in the future
4. **Type Safety**: TypeScript types ensure correct usage
5. **Searchability**: Easy to find where labels are used
6. **Refactoring**: Changing labels doesn't require searching through multiple files

## Future Enhancements

### Internationalization (i18n)
When ready to add multi-language support:

1. Install i18n library (e.g., `react-i18next`)
2. Convert `labels.ts` to language-specific JSON files
3. Update imports to use i18n hooks
4. The structure is already organized for easy translation

### Adding New Labels

When adding new labels:

1. Add to the appropriate category in `labels.ts`
2. Use SCREAMING_SNAKE_CASE for constant names
3. Group related labels together
4. Add comments if the label needs context

Example:
```typescript
// In labels.ts
export const LABELS = {
  // ... existing labels
  
  // New Category
  NEW_CATEGORY: {
    LABEL_NAME: 'Label Text',
  },
} as const;
```

## Files Updated

The following files have been refactored to use constants:

- `src/pages/CashflowManagement.tsx`
- `src/pages/PolicyDetails.tsx`
- `src/pages/CohortManagement.tsx`
- `src/pages/CashflowCalculatorPage.tsx`
- `src/pages/Dashboard.tsx`
- `src/components/layout/Sidebar.tsx`

## Migration Checklist

- [x] Create constants file
- [x] Define all labels
- [x] Update CashflowManagement page
- [x] Update PolicyDetails page
- [x] Update CohortManagement page
- [x] Update CashflowCalculatorPage
- [x] Update Dashboard page
- [x] Update Sidebar component
- [ ] Update ProcessingRuns page (if needed)
- [ ] Update other components as needed
- [ ] Add unit tests for constants
- [ ] Document in team wiki
