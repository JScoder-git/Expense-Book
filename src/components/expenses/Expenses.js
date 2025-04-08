// src/components/expenses/Expenses.js
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectAllExpenses, setExpenses, addExpense, updateExpense, deleteExpense } from './expensesSlice';
import { selectUser } from '../../features/auth/authSlice';
import { expensesService } from '../../services/expensesService';
import ExpenseList from './ExpenseList';
import ExpenseForm from './ExpenseForm';

const Expenses = () => {
  const dispatch = useDispatch();
  const expenses = useSelector(selectAllExpenses);
  const user = useSelector(selectUser);
  
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [currentExpense, setCurrentExpense] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  
  const categories = [
    'Food', 'Transportation', 'Housing', 'Utilities', 
    'Entertainment', 'Healthcare', 'Education', 
    'Shopping', 'Personal', 'Other'
  ];

  useEffect(() => {
    if (user && user.id) {
      const storedExpenses = expensesService.getExpenses(user.id);
      dispatch(setExpenses(storedExpenses));
    }
  }, [dispatch, user]);

  const handleAddExpense = (expenseData) => {
    try {
      dispatch(addExpense(expenseData));
      setIsFormVisible(false);
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  const handleUpdateExpense = (expenseData) => {
    try {
      dispatch(updateExpense(expenseData));
      setIsFormVisible(false);
      setCurrentExpense(null);
    } catch (error) {
      console.error('Error updating expense:', error);
    }
  };

  const handleDeleteExpense = (expenseId) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        dispatch(deleteExpense(expenseId));
      } catch (error) {
        console.error('Error deleting expense:', error);
      }
    }
  };

  const handleEditClick = (expense) => {
    setCurrentExpense(expense);
    setIsFormVisible(true);
  };

  const handleAddClick = () => {
    setCurrentExpense(null);
    setIsFormVisible(true);
  };

  const handleFormCancel = () => {
    setIsFormVisible(false);
    setCurrentExpense(null);
  };

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory ? expense.category === filterCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="expenses-container">
      <div className="expenses-header">
        <h2>Expense Management</h2>
        <button onClick={handleAddClick} className="btn-primary">
          Add New Expense
        </button>
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="Search expenses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select 
          value={filterCategory} 
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      {isFormVisible ? (
        <ExpenseForm
          expense={currentExpense}
          onSubmit={currentExpense ? handleUpdateExpense : handleAddExpense}
          onCancel={handleFormCancel}
        />
      ) : (
        <ExpenseList
          expenses={filteredExpenses}
          onEdit={handleEditClick}
          onDelete={handleDeleteExpense}
        />
      )}
    </div>
  );
};

export default Expenses;