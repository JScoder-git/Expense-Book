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
      if (action.payload && state.pendingActions.length > 0) {
        state.syncStatus = 'syncing';
      } else if (action.payload) {
        state.syncStatus = 'idle';
      }
    },
    addPendingAction: (state, action) => {
      if (!state.isOnline) {
        state.pendingActions.push({ ...action.payload, addedAt: Date.now() });
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
    },
    removePendingAction: (state, action) => {
      state.pendingActions = state.pendingActions.filter(
        (a) => a.id !== action.payload
      );
    },
    setPendingActions: (state, action) => {
      state.pendingActions = action.payload;
    },
  }
});

export const {
  setOnlineStatus,
  addPendingAction,
  setSyncStatus,
  clearPendingActions,
  syncError,
  removePendingAction,
  setPendingActions
} = syncSlice.actions;

export const selectPendingActions = (state) => state.sync.pendingActions;
export const selectOnlineStatus = (state) => state.sync.isOnline;
export const selectSyncStatus = (state) => state.sync.syncStatus;
export const selectLastSyncTimestamp = (state) => state.sync.lastSyncTimestamp;

export default syncSlice.reducer;