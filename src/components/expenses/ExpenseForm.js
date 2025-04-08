import React, { useState, useEffect } from 'react';

const ExpenseForm = ({ expense = null, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    category: '',
    amount: '',
    date: new Date().toISOString().substr(0, 10)
  });

  // If expense is provided, populate form for editing
  useEffect(() => {
    if (expense) {
      setFormData({
        id: expense.id,
        title: expense.title || '',
        category: expense.category || '',
        amount: expense.amount ? expense.amount.toString() : '',
        date: expense.date ? new Date(expense.date).toISOString().substr(0, 10) : new Date().toISOString().substr(0, 10)
      });
    } else {
      // Reset form for new expense
      setFormData({
        id: '',
        title: '',
        category: '',
        amount: '',
        date: new Date().toISOString().substr(0, 10)
      });
    }
  }, [expense]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    onSubmit({
      ...formData,
      amount: parseFloat(formData.amount),
      id: formData.id || undefined // Let parent generate ID if new expense
    });
    
    // Reset form if not editing
    if (!expense) {
      setFormData({
        id: '',
        title: '',
        category: '',
        amount: '',
        date: new Date().toISOString().substr(0, 10)
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="expense-form">
      <div className="form-row">
        <div className="form-group">
          <label className="form-label" htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>
        
        <div className="form-group">
          <label className="form-label" htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="form-input"
            required
          >
            <option value="">Select category</option>
            <option value="Food">Food</option>
            <option value="Transportation">Transportation</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Housing">Housing</option>
            <option value="Utilities">Utilities</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label className="form-label" htmlFor="amount">Amount</label>
          <input
            type="number"
            step="0.01"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>
        
        <div className="form-group">
          <label className="form-label" htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>
      </div>
      
      <div className="form-buttons">
        <button type="submit" className="btn btn-primary">
          {expense ? 'Update Expense' : 'Add Expense'}
        </button>
        {expense && (
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default ExpenseForm;