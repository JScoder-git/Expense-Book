
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isAuthenticated: false,
  sessionExpiry: null,
  sessionExpired: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.sessionExpiry = action.payload.sessionExpiry;
      state.sessionExpired = false;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.sessionExpiry = null;
      state.sessionExpired = false;
    },
    setSessionExpired: (state) => {
      state.sessionExpired = true;
      state.isAuthenticated = false;
    },
  },
});

export const { login, logout, setSessionExpired } = authSlice.actions;

// Selectors
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectSessionExpiry = (state) => state.auth.sessionExpiry;
export const selectSessionExpired = (state) => state.auth.sessionExpired;

export default authSlice.reducer;