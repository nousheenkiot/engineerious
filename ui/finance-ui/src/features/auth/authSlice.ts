import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { UserInfo } from '../../api/authApi';

interface AuthState {
    user: UserInfo | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: !!localStorage.getItem('token'),
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (
            state,
            action: PayloadAction<{ user: UserInfo; token: string }>
        ) => {
            const { user, token } = action.payload;
            state.user = user;
            state.token = token;
            state.isAuthenticated = true;
            localStorage.setItem('token', token);
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem('token');
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        setUserInfo: (state, action: PayloadAction<UserInfo>) => {
            state.user = action.payload;
            state.isAuthenticated = true;
        }
    },
});

export const { setCredentials, logout, setLoading, setError, setUserInfo } = authSlice.actions;

export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectHasActivity = (activity: string) => (state: { auth: AuthState }) =>
    state.auth.user?.activities?.includes(activity) ?? false;
export const selectHasRole = (role: string) => (state: { auth: AuthState }) =>
    state.auth.user?.roles?.includes(role) ?? false;

export default authSlice.reducer;
