import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  selectAllExpenses,
  setExpenses,
  addExpense,
  updateExpense,
  deleteExpense
} from '../../components/expenses/expensesSlice';
import {
  selectOnlineStatus,
  selectSyncStatus,
  selectPendingActions,
} from '../../features/sync/syncSlice';
import { selectUser, logout } from '../../features/auth/authSlice';
import { authService } from '../../services/authService';
import ExpenseList from '../expenses/ExpenseList';
import ExpenseForm from '../expenses/ExpenseForm';
import NetworkToggle from '../NetworkToggle';
import SyncStatusIndicator from '../SyncStatusIndicator';
import { loadExpenses, loadSyncState } from '../../services/storageService';
import '../../Styles/dashboard.css';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const expenses = useSelector(selectAllExpenses);
  const isOnline = useSelector(selectOnlineStatus);
  const syncStatus = useSelector(selectSyncStatus);
  const pendingActions = useSelector(selectPendingActions);
  const [editingExpense, setEditingExpense] = useState(null);

  // Load expenses from localStorage on component mount
  useEffect(() => {
    const savedExpenses = loadExpenses();
    if (savedExpenses) {
      dispatch(setExpenses(savedExpenses));
    }

    const savedSyncState = loadSyncState();
    if (savedSyncState) {
      // Restore pending actions if needed
    }
  }, [dispatch]);

  // Sync updated expenses to localStorage
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  const handleLogout = () => {
    authService.logoutUser();
    dispatch(logout());
    navigate('/login');
  };

  const handleAddExpense = (expense) => {
    if (editingExpense) {
      // Update existing expense
      dispatch(updateExpense(expense));
      setEditingExpense(null);
    } else {
      // Add new expense
      const newExpense = {
        ...expense,
        id: Date.now().toString(),
      };
      dispatch(addExpense(newExpense));
    }
  };

  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    // Scroll to the form
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleDeleteExpense = (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      dispatch(deleteExpense(id));
    }
  };

  const handleCancelEdit = () => {
    setEditingExpense(null);
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Expense Manager</h1>
          <div className="controls-container">
            <NetworkToggle />
            <SyncStatusIndicator />
            <div className="user-profile">
              <span className="user-name">{user?.name || 'User'}</span>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>
          </div>
        </div>

        {!isOnline && pendingActions.length > 0 && (
          <div className="status-notification notification-warning">
            <p>
              You're currently offline. {pendingActions.length} changes will sync when you reconnect.
            </p>
          </div>
        )}

        {syncStatus === 'syncing' && (
          <div className="status-notification notification-syncing">
            <p>Syncing your changes...</p>
          </div>
        )}

        {syncStatus === 'completed' && (
          <div className="status-notification notification-success">
            <p>All changes synced successfully!</p>
          </div>
        )}

        {syncStatus === 'error' && (
          <div className="status-notification notification-error">
            <p>Sync failed. Please try again later.</p>
          </div>
        )}

        <div className="section-container">
          <h2 className="section-title">
            {editingExpense ? 'Edit Expense' : 'Add New Expense'}
          </h2>
          <ExpenseForm
            expense={editingExpense}
            onSubmit={handleAddExpense}
            onCancel={handleCancelEdit}
          />
        </div>

        <div className="section-container">
          <h2 className="section-title">Your Expenses</h2>
          <ExpenseList 
            expenses={expenses} 
            onEdit={handleEditExpense}
            onDelete={handleDeleteExpense}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
