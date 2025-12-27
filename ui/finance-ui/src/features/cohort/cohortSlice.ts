import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface CohortState {
    policies: unknown[];
    cashflows: unknown[];
    loading: boolean;
    error: string | null;
}

const initialState: CohortState = {
    policies: [],
    cashflows: [],
    loading: false,
    error: null,
};

const cohortSlice = createSlice({
    name: 'cohort',
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        setPolicies: (state, action: PayloadAction<unknown[]>) => {
            state.policies = action.payload;
        },
        setCashflows: (state, action: PayloadAction<unknown[]>) => {
            state.cashflows = action.payload;
        },
    },
});

export const { setLoading, setError, setPolicies, setCashflows } = cohortSlice.actions;
export default cohortSlice.reducer;
