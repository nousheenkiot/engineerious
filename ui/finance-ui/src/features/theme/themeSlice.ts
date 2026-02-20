import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

type ThemeMode = 'light' | 'dark';

interface ThemeState {
    mode: ThemeMode;
}

const getInitialTheme = (): ThemeMode => {
    const savedTheme = localStorage.getItem('theme') as ThemeMode;
    if (savedTheme) return savedTheme;

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const initialState: ThemeState = {
    mode: getInitialTheme(),
};

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        setTheme: (state, action: PayloadAction<ThemeMode>) => {
            state.mode = action.payload;
            localStorage.setItem('theme', action.payload);
        },
        toggleTheme: (state) => {
            state.mode = state.mode === 'light' ? 'dark' : 'light';
            localStorage.setItem('theme', state.mode);
        },
    },
});

export const { setTheme, toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
