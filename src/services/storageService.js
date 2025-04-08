// src/services/storageService.js
// This would be different for React Native (using AsyncStorage)

export const saveToStorage = (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Error saving to storage:', error);
      return false;
    }
  };
  
  export const loadFromStorage = (key) => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error loading from storage:', error);
      return null;
    }
  };
  
  export const saveSyncState = (syncState) => {
    return saveToStorage('syncState', syncState);
  };
  
  export const loadSyncState = () => {
    return loadFromStorage('syncState');
  };
  
  export const saveExpenses = (expenses) => {
    return saveToStorage('expenses', expenses);
  };
  
  export const loadExpenses = () => {
    return loadFromStorage('expenses');
  };