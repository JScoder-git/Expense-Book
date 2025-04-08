// src/app/syncMiddleware.js
import { clearPendingActions, selectPendingActions, setSyncStatus } from '../features/sync/syncSlice';
import { addExpense, updateExpense, deleteExpense } from '../components/expenses/expensesSlice';

const syncMiddleware = store => next => action => {
  const result = next(action);
  
  if (action.type === 'sync/setOnlineStatus' && action.payload === true) {
    const pendingActions = selectPendingActions(store.getState());
    
    if (pendingActions.length > 0) {
      store.dispatch(setSyncStatus('syncing'));
      
      setTimeout(() => {
        try {
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
          
          store.dispatch(clearPendingActions());
          localStorage.setItem('expenses', JSON.stringify(store.getState().expenses.expenses));
        } catch (error) {
          console.error('Sync failed:', error);
          store.dispatch({ type: 'sync/syncError' });
        }
      }, 2000);
    }
  }
  
  return result;
};

export default syncMiddleware;