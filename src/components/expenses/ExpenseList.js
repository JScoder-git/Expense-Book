import React from 'react';
import '../../Styles/expenselist.css';

const ExpenseList = ({ expenses = [], onEdit = () => {}, onDelete = () => {} }) => {
  if (expenses.length === 0) {
    return (
      <div className="empty-state">
        <p className="empty-state-text">No expenses found. Add your first expense!</p>
      </div>
    );
  }

  return (
    <div className="expenses-container">
      <div className="overflow-x-auto">
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
            {expenses.map((expense) => (
              <tr key={expense.id}>
                <td>{expense.title}</td>
                <td>
                  <span className="category-badge">{expense.category}</span>
                </td>
                <td className={`amount-cell ${expense.amount < 0 ? 'negative-amount' : ''}`}>
                  ${expense.amount ? Math.abs(expense.amount).toFixed(2) : '0.00'}
                </td>
                <td className="date-cell">
                  {expense.date ? new Date(expense.date).toLocaleDateString() : '—'}
                </td>
                <td className="actions-cell">
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
    </div>
  );
};

export default ExpenseList;
