// src/services/expensesService.js

export const expensesService = {
    // Get all expenses for current user
    getExpenses: (userId) => {
      try {
        const expensesData = localStorage.getItem(`expenses_${userId}`);
        return expensesData ? JSON.parse(expensesData) : [];
      } catch (error) {
        console.error('Error fetching expenses:', error);
        return [];
      }
    },
    
    // Save all expenses for current user
    saveExpenses: (userId, expenses) => {
      try {
        localStorage.setItem(`expenses_${userId}`, JSON.stringify(expenses));
        return true;
      } catch (error) {
        console.error('Error saving expenses:', error);
        return false;
      }
    },
    
    // Add new expense
    addExpense: (userId, expenseData) => {
      const expenses = expensesService.getExpenses(userId);
      const newExpense = {
        ...expenseData,
        id: Date.now().toString(), // Generate unique ID
        date: new Date(expenseData.date).toISOString(), // Ensure consistent date format
      };
      
      expenses.push(newExpense);
      expensesService.saveExpenses(userId, expenses);
      
      return newExpense;
    },
    
    // Update existing expense
    updateExpense: (userId, expenseData) => {
      const expenses = expensesService.getExpenses(userId);
      const index = expenses.findIndex(expense => expense.id === expenseData.id);
      
      if (index !== -1) {
        expenses[index] = {
          ...expenseData,
          date: new Date(expenseData.date).toISOString(), // Ensure consistent date format
        };
        expensesService.saveExpenses(userId, expenses);
        return expenses[index];
      }
      
      throw new Error('Expense not found');
    },
    
    // Delete expense
    deleteExpense: (userId, expenseId) => {
      const expenses = expensesService.getExpenses(userId);
      const updatedExpenses = expenses.filter(expense => expense.id !== expenseId);
      
      if (expenses.length === updatedExpenses.length) {
        throw new Error('Expense not found');
      }
      
      expensesService.saveExpenses(userId, updatedExpenses);
      return true;
    }
  };