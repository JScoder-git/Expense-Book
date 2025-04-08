// src/app/syncMiddleware.js
import { clearPendingActions, selectPendingActions, setSyncStatus } from '../features/sync/syncSlice';
import { addExpense, updateExpense, deleteExpense } from '../components/expenses/expensesSlice';

// Middleware to handle syncing when going back online
const syncMiddleware = store => next => action => {
  // Process the action first
  const result = next(action);
  
  // If we're setting online status to true, process any pending actions
  if (action.type === 'sync/setOnlineStatus' && action.payload === true) {
    const pendingActions = selectPendingActions(store.getState());
    
    if (pendingActions.length > 0) {
      store.dispatch(setSyncStatus('syncing'));
      
      // Simulate network delay
      setTimeout(() => {
        try {
          // Process all pending actions
          pendingActions.forEach(pendingAction => {
            switch (pendingAction.type) {
              case 'ADD_EXPENSE':
                store.dispatch(addExpense(pendingAction.payload));
                break;
              case 'UPDATE_EXPENSE':
                store.dispatch(updateExpense(pendingAction.payload));
                break;
              case 'DELETE_EXPENSE':
                store.dispatch(deleteExpense(pendingAction.payload));
                break;
              default:
                break;
            }
          });
          
          // After all actions are processed, clear the queue
          store.dispatch(clearPendingActions());
          
          // Update localStorage or AsyncStorage here
          const { expenses } = store.getState().expenses;
          localStorage.setItem('expenses', JSON.stringify(expenses));
          
        } catch (error) {
          console.error('Sync failed:', error);
          store.dispatch({ type: 'sync/syncError' });
        }
      }, 2000); // 2 second delay to simulate network latency
    }
  }
  
  return result;
};

export default syncMiddleware;