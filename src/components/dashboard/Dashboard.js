// src/components/expenses/ExpenseForm.js
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addExpense, updateExpense } from '../expenses/expensesSlice';
import { selectOnlineStatus, addPendingAction } from '../../features/sync/syncSlice';
import { v4 as uuidv4 } from 'uuid'; // Ensure you have uuid installed

const ExpenseForm = ({ expense = null, onCancel = null }) => {
  const dispatch = useDispatch();
  const isOnline = useSelector(selectOnlineStatus);
  const isEditing = !!expense;
  
  const [formData, setFormData] = useState({
    description: expense?.description || '',
    amount: expense?.amount || '',
    date: expense?.date || new Date().toISOString().substr(0, 10),
    category: expense?.category || 'groceries'
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'amount' ? parseFloat(value) || '' : value
    });
  };
  
  // Define the handleSubmit function directly in the component
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form fields
    if (!formData.description || !formData.amount || !formData.date) {
      // You can add state for error messages if desired
      alert('Please fill all required fields');
      return;
    }

    // Create expense object
    const expenseData = {
      id: expense?.id || uuidv4(),
      ...formData,
      amount: parseFloat(formData.amount),
      timestamp: new Date().toISOString()
    };
    
    if (isEditing) {
      // Dispatch update action
      dispatch(updateExpense(expenseData));
      
      // If offline, add to pending actions
      if (!isOnline) {
        dispatch(addPendingAction({
          type: 'UPDATE_EXPENSE',
          payload: expenseData
        }));
      }
    } else {
      // Dispatch add action
      dispatch(addExpense(expenseData));
      
      // If offline, add to pending actions
      if (!isOnline) {
        dispatch(addPendingAction({
          type: 'ADD_EXPENSE',
          payload: expenseData
        }));
      }
    }
    
    // Reset form if not editing
    if (!isEditing) {
      setFormData({
        description: '',
        amount: '',
        date: new Date().toISOString().substr(0, 10),
        category: 'groceries'
      });
    } else if (onCancel) {
      // If editing, call onCancel if provided (to close edit form)
      onCancel();
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
          Description
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="description"
          type="text"
          placeholder="Expense description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
          Amount
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="amount"
          type="number"
          step="0.01"
          placeholder="0.00"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
          Date
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="date"
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
          Category
        </label>
        <select
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
        >
          <option value="groceries">Groceries</option>
          <option value="utilities">Utilities</option>
          <option value="rent">Rent</option>
          <option value="entertainment">Entertainment</option>
          <option value="other">Other</option>
        </select>
      </div>
      
      <div className="flex items-center justify-between">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          {isEditing ? 'Update Expense' : 'Add Expense'}
        </button>
        
        {isEditing && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default ExpenseForm;