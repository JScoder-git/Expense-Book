// src/components/expenses/ExpenseList.js
import React from 'react';

const ExpenseList = ({ expenses, onEdit, onDelete }) => {
  if (!expenses || expenses.length === 0) {
    return (
      <div className="no-expenses">
        <p>No expenses found. Add your first expense!</p>
      </div>
    );
  }

  return (
    <div className="expense-list">
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map(expense => (
            <tr key={expense.id}>
              <td>{expense.title}</td>
              <td>{expense.category}</td>
              <td className="amount">${expense.amount.toFixed(2)}</td>
              <td>{new Date(expense.date).toLocaleDateString()}</td>
              <td className="actions">
                <button 
                  onClick={() => onEdit(expense)} 
                  className="btn-edit"
                >
                  Edit
                </button>
                <button 
                  onClick={() => onDelete(expense.id)} 
                  className="btn-delete"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExpenseList;