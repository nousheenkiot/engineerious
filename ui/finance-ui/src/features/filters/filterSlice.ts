import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface FilterState {
    [pageId: string]: Record<string, any>;
}

const initialState: FilterState = {};

const filterSlice = createSlice({
    name: 'filters',
    initialState,
    reducers: {
        setFilters: (state, action: PayloadAction<{ pageId: string; filters: Record<string, any> }>) => {
            const { pageId, filters } = action.payload;
            state[pageId] = filters;
        },
        updateFilter: (state, action: PayloadAction<{ pageId: string; key: string; value: any }>) => {
            const { pageId, key, value } = action.payload;
            if (!state[pageId]) {
                state[pageId] = {};
            }
            state[pageId][key] = value;
        },
        clearFilters: (state, action: PayloadAction<string>) => {
            delete state[action.payload];
        },
        clearAllFilters: () => {
            return initialState;
        }
    },
});

export const { setFilters, updateFilter, clearFilters, clearAllFilters } = filterSlice.actions;

export default filterSlice.reducer;
