import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  user: any | null;
  permissions: string[];
  isAuthenticated: boolean;
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  permissions: [],
  isAuthenticated: false,
  isInitialized: false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      { payload: { user } }: PayloadAction<{ user: any }>
    ) => {
      state.user = user;
      state.permissions = user.permissions || [];
      state.isAuthenticated = true;
      state.error = null;
    },
    initialize: (state, action: PayloadAction<{ user: any | null }>) => {
      state.user = action.payload.user;
      state.permissions = action.payload.user?.permissions || [];
      state.isAuthenticated = !!action.payload.user;
      state.isInitialized = true;
    },
    logout: (state) => {
      state.user = null;
      state.permissions = [];
      state.isAuthenticated = false;
      state.isInitialized = true; // Still initialized, just logged out
      state.error = null;
    },
    setAuthError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setCredentials, logout, setAuthError, initialize } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.user;
export const selectUserPermissions = (state: { auth: AuthState }) => state.auth.permissions;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectIsInitialized = (state: { auth: AuthState }) => state.auth.isInitialized;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;

export const selectHasPermission = (slug: string) => (state: { auth: AuthState }) =>
  state.auth.permissions.includes(slug);
