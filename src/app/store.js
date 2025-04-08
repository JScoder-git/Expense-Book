// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import expenseReducer from '../components/expenses/expensesSlice';
import authReducer from '../features/auth/authSlice';
import syncReducer from '../features/sync/syncSlice';
import syncMiddleware from './syncMiddleware';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    expenses: expenseReducer,
    sync: syncReducer
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat(syncMiddleware)
});