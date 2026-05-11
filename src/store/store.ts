import { configureStore } from '@reduxjs/toolkit';
import { clientsApi } from '../services/clientsApi';
import authReducer from '../features/auth/authSlice';

export const store = configureStore({
  reducer: {
    [clientsApi.reducerPath]: clientsApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(clientsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
