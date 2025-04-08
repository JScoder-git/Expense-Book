// src/components/SyncStatusIndicator.js
import React from 'react';
import { useSelector } from 'react-redux';
import { selectSyncStatus, selectOnlineStatus, selectPendingActions } from '../features/sync/syncSlice';

const SyncStatusIndicator = () => {
  const syncStatus = useSelector(selectSyncStatus);
  const isOnline = useSelector(selectOnlineStatus);
  const pendingActions = useSelector(selectPendingActions);
  
  let statusMessage = '';
  let statusColor = '';
  
  if (!isOnline) {
    statusMessage = `Offline (${pendingActions.length} pending changes)`;
    statusColor = 'text-yellow-500';
  } else if (syncStatus === 'syncing') {
    statusMessage = 'Syncing...';
    statusColor = 'text-blue-500';
  } else if (syncStatus === 'completed') {
    statusMessage = 'All changes synced';
    statusColor = 'text-green-500';
  } else if (syncStatus === 'error') {
    statusMessage = 'Sync failed';
    statusColor = 'text-red-500';
  } else {
    statusMessage = 'Online';
    statusColor = 'text-green-500';
  }
  
  const colorwhite = {
    color: 'white',
  }
  return (
    <div className={`flex items-center ${statusColor} font-medium`}>
      {syncStatus === 'syncing' && (
        <div className="mr-2 w-4 h-4 border-2 border-t-transparent rounded-full animate-spin"></div>
      )}
      <span style={colorwhite}>{statusMessage}</span>
    </div>
  );
};

export default SyncStatusIndicator;