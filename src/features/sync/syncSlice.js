// src/features/sync/syncSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isOnline: true,
  syncStatus: 'idle', // 'idle' | 'syncing' | 'completed' | 'error'
  pendingActions: [],
  lastSyncTimestamp: null
};

export const syncSlice = createSlice({
  name: 'sync',
  initialState,
  reducers: {
    setOnlineStatus: (state, action) => {
      state.isOnline = action.payload;
      // When going online, automatically start sync process
      if (action.payload && state.pendingActions.length > 0) {
        state.syncStatus = 'syncing';
      } else if (action.payload) {
        state.syncStatus = 'idle';
      }
    },
    addPendingAction: (state, action) => {
      // Only add to pending actions if offline
      if (!state.isOnline) {
        state.pendingActions.push(action.payload);
      }
    },
    setSyncStatus: (state, action) => {
      state.syncStatus = action.payload;
    },
    clearPendingActions: (state) => {
      state.pendingActions = [];
      state.lastSyncTimestamp = new Date().toISOString();
      state.syncStatus = 'completed';
    },
    syncError: (state) => {
      state.syncStatus = 'error';
    }
  }
});

export const {
  setOnlineStatus,
  addPendingAction,
  setSyncStatus,
  clearPendingActions,
  syncError
} = syncSlice.actions;

// Select all pending actions
export const selectPendingActions = (state) => state.sync.pendingActions;

// Select online status
export const selectOnlineStatus = (state) => state.sync.isOnline;

// Select sync status
export const selectSyncStatus = (state) => state.sync.syncStatus;

// Select last sync timestamp
export const selectLastSyncTimestamp = (state) => state.sync.lastSyncTimestamp;

export default syncSlice.reducer;