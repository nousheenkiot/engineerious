import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface ProcessingState {
    runs: unknown[];
    currentRun: unknown | null;
    loading: boolean;
    error: string | null;
}

const initialState: ProcessingState = {
    runs: [],
    currentRun: null,
    loading: false,
    error: null,
};

const processingSlice = createSlice({
    name: 'processing',
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        setRuns: (state, action: PayloadAction<unknown[]>) => {
            state.runs = action.payload;
        },
        setCurrentRun: (state, action: PayloadAction<unknown | null>) => {
            state.currentRun = action.payload;
        },
    },
});

export const { setLoading, setError, setRuns, setCurrentRun } = processingSlice.actions;
export default processingSlice.reducer;
