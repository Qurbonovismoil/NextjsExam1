import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  user: string | null;
  isAuthenticated: boolean;
}

const getInitialState = (): AuthState => {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('crm_auth_user');
    return {
      user: user,
      isAuthenticated: !!user,
    };
  }
  return { user: null, isAuthenticated: false };
};

const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
    login: (state, action: PayloadAction<string>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      if (typeof window !== 'undefined') {
        localStorage.setItem('crm_auth_user', action.payload);
      }
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('crm_auth_user');
      }
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
