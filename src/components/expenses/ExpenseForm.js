// src/components/expenses/ExpenseForm.js
import React, { useState, useEffect } from 'react';

const ExpenseForm = ({ expense, onSubmit, onCancel }) => {
  // Initialize form with empty values or existing expense data
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0], // Format as YYYY-MM-DD
  });
  const [error, setError] = useState('');
  
  // Categories for dropdown
  const categories = [
    'Food', 
    'Transportation', 
    'Housing', 
    'Utilities', 
    'Entertainment', 
    'Healthcare', 
    'Education', 
    'Shopping', 
    'Personal', 
    'Other'
  ];

  // If editing, populate form with expense data
  useEffect(() => {
    if (expense) {
      setFormData({
        title: expense.title,
        amount: expense.amount,
        category: expense.category,
        date: new Date(expense.date).toISOString().split('T')[0],
      });
    }
  }, [expense]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validate form
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    if (!formData.amount || isNaN(formData.amount) || Number(formData.amount) <= 0) {
      setError('Amount must be a positive number');
      return;
    }

    if (!formData.category) {
      setError('Please select a category');
      return;
    }

    if (!formData.date) {
      setError('Date is required');
      return;
    }

    // Submit valid form
    onSubmit({
      ...formData,
      id: expense?.id, // Keep the original ID if editing
      amount: Number(formData.amount), // Convert to number
    });
  };

  return (
    <div className="expense-form">
      <h3>{expense ? 'Edit Expense' : 'Add New Expense'}</h3>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Grocery shopping"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="amount">Amount</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="0.00"
            step="0.01"
            min="0"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="">Select category</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            {expense ? 'Update' : 'Add'} Expense
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExpenseForm;