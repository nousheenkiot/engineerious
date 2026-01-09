import { configureStore } from '@reduxjs/toolkit';
import cohortReducer from '../features/cohort/cohortSlice';
import processingReducer from '../features/processing/processingSlice';
import authReducer from '../features/auth/authSlice';

export const store = configureStore({
    reducer: {
        cohort: cohortReducer,
        processing: processingReducer,
        auth: authReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
