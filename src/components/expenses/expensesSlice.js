// src/features/expenses/expenseSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { addPendingAction } from '../../features/sync/syncSlice';

const initialState = {
  expenses: [],
  status: 'idle'
};

export const expenseSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    setExpenses: (state, action) => {
      state.expenses = action.payload;
    },
    addExpense: (state, action) => {
      state.expenses.push(action.payload);
    },
    updateExpense: (state, action) => {
      const index = state.expenses.findIndex(expense => expense.id === action.payload.id);
      if (index !== -1) {
        state.expenses[index] = action.payload;
      }
    },
    deleteExpense: (state, action) => {
      state.expenses = state.expenses.filter(expense => expense.id !== action.payload);
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    }
  }
});

export const {
  setExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
  setStatus
} = expenseSlice.actions;

// Thunks that handle sync logic
export const addExpenseAsync = (expense) => (dispatch, getState) => {
  const { isOnline } = getState().sync;
  
  if (isOnline) {
    // If online, directly add to expenses
    dispatch(addExpense(expense));
    // Save to localStorage/AsyncStorage would happen here
  } else {
    // If offline, add to expenses AND add to pending actions queue
    dispatch(addExpense(expense));
    dispatch(addPendingAction({
      type: 'ADD_EXPENSE',
      payload: expense
    }));
  }
};

export const updateExpenseAsync = (expense) => (dispatch, getState) => {
  const { isOnline } = getState().sync;
  
  if (isOnline) {
    dispatch(updateExpense(expense));
    // Save to localStorage/AsyncStorage would happen here
  } else {
    dispatch(updateExpense(expense));
    dispatch(addPendingAction({
      type: 'UPDATE_EXPENSE',
      payload: expense
    }));
  }
};

export const deleteExpenseAsync = (expenseId) => (dispatch, getState) => {
  const { isOnline } = getState().sync;
  
  if (isOnline) {
    dispatch(deleteExpense(expenseId));
    // Save to localStorage/AsyncStorage would happen here
  } else {
    dispatch(deleteExpense(expenseId));
    dispatch(addPendingAction({
      type: 'DELETE_EXPENSE',
      payload: expenseId
    }));
  }
};

// Selectors
export const selectAllExpenses = (state) => state.expenses.expenses;
export const selectExpenseById = (id) => (state) => 
  state.expenses.expenses.find(expense => expense.id === id);
export const selectExpensesStatus = (state) => state.expenses.status;

export default expenseSlice.reducer;