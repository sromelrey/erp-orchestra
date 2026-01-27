import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { authApi } from './api/authApi';
import { tenantsApi } from './api/tenantsApi';
import { plansApi } from './api/plansApi';
import { systemModulesApi } from './api/systemModulesApi';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [tenantsApi.reducerPath]: tenantsApi.reducer,
    [plansApi.reducerPath]: plansApi.reducer,
    [systemModulesApi.reducerPath]: systemModulesApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware, 
      tenantsApi.middleware, 
      plansApi.middleware,
      systemModulesApi.middleware
    ),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
