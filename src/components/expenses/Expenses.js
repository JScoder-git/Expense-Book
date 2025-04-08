// src/components/expenses/Expenses.js
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  selectExpenses, 
  loadExpenses, 
  addExpense, 
  updateExpense, 
  deleteExpense 
} from './expensesSlice';
import { selectUser } from '../../features/auth/authSlice';
import { expensesService } from '../../services/expensesService';
import ExpenseList from './ExpenseList';
import ExpenseForm from './ExpenseForm';

const Expenses = () => {
  const dispatch = useDispatch();
  const expenses = useSelector(selectExpenses);
  const user = useSelector(selectUser);
  
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [currentExpense, setCurrentExpense] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  
  // Categories for filter dropdown
  const categories = [
    'Food', 'Transportation', 'Housing', 'Utilities', 
    'Entertainment', 'Healthcare', 'Education', 
    'Shopping', 'Personal', 'Other'
  ];

  // Load expenses from storage on component mount
  useEffect(() => {
    if (user && user.id) {
      const storedExpenses = expensesService.getExpenses(user.id);
      dispatch(loadExpenses(storedExpenses));
    }
  }, [dispatch, user]);

  // Handle adding new expense
  const handleAddExpense = (expenseData) => {
    try {
      const newExpense = expensesService.addExpense(user.id, expenseData);
      dispatch(addExpense(newExpense));
      setIsFormVisible(false);
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  // Handle updating expense
  const handleUpdateExpense = (expenseData) => {
    try {
      const updatedExpense = expensesService.updateExpense(user.id, expenseData);
      dispatch(updateExpense(updatedExpense));
      setIsFormVisible(false);
      setCurrentExpense(null);
    } catch (error) {
      console.error('Error updating expense:', error);
    }
  };

  // Handle deleting expense
  const handleDeleteExpense = (expenseId) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        expensesService.deleteExpense(user.id, expenseId);
        dispatch(deleteExpense(expenseId));
      } catch (error) {
        console.error('Error deleting expense:', error);
      }
    }
  };

  // Handle edit button click
  const handleEditClick = (expense) => {
    setCurrentExpense(expense);
    setIsFormVisible(true);
  };

  // Handle add new button click
  const handleAddClick = () => {
    setCurrentExpense(null);
    setIsFormVisible(true);
  };

  // Handle form cancel
  const handleFormCancel = () => {
    setIsFormVisible(false);
    setCurrentExpense(null);
  };

  // Filter expenses based on search term and category
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
        <div className="search-box">
          <input
            type="text"
            placeholder="Search expenses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="category-filter">
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