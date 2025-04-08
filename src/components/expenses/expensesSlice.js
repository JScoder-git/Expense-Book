import { createSlice, createSelector } from '@reduxjs/toolkit';

const initialState = {
  expenses: [],
  status: 'idle',
  searchTerm: '',
  filterCategory: '',
};

export const expenseSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    setExpenses: (state, action) => {
      state.expenses = action.payload;
    },
    addExpense: (state, action) => {
      const expense = {
        ...action.payload,
        lastUpdated: new Date().toISOString(),
      };
      state.expenses.push(expense);
    },
    updateExpense: (state, action) => {
      const index = state.expenses.findIndex(expense => expense.id === action.payload.id);
      if (index !== -1) {
        state.expenses[index] = {
          ...action.payload,
          lastUpdated: new Date().toISOString(),
        };
      }
    },
    deleteExpense: (state, action) => {
      state.expenses = state.expenses.filter(expense => expense.id !== action.payload);
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setFilterCategory: (state, action) => {
      state.filterCategory = action.payload;
    },
  },
});

export const {
  setExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
  setStatus,
  setSearchTerm,
  setFilterCategory,
} = expenseSlice.actions;

// Memoized filtered & searched expenses
export const selectAllExpenses = createSelector(
  (state) => state.expenses.expenses,
  (state) => state.expenses.searchTerm,
  (state) => state.expenses.filterCategory,
  (expenses, searchTerm, filterCategory) => {
    return expenses.filter(expense => {
      const matchesSearch = expense.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory ? expense.category === filterCategory : true;
      return matchesSearch && matchesCategory;
    });
  }
);

export const selectExpenseById = (id) => (state) =>
  state.expenses.expenses.find(expense => expense.id === id);

export const selectExpensesStatus = (state) => state.expenses.status;
export const selectSearchTerm = (state) => state.expenses.searchTerm;
export const selectFilterCategory = (state) => state.expenses.filterCategory;

export default expenseSlice.reducer;
