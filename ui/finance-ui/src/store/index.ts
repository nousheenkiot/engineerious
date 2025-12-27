import { configureStore } from '@reduxjs/toolkit';
import cohortReducer from '../features/cohort/cohortSlice';
import processingReducer from '../features/processing/processingSlice';

export const store = configureStore({
    reducer: {
        cohort: cohortReducer,
        processing: processingReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
