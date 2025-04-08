// src/hooks/useNetworkStatus.js
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setOnlineStatus, selectOnlineStatus } from '../features/sync/syncSlice';

const useNetworkStatus = () => {
  const dispatch = useDispatch();
  const isOnline = useSelector(selectOnlineStatus);
  
  // For browser/web implementation
  useEffect(() => {
    const handleOnline = () => {
      dispatch(setOnlineStatus(true));
    };
    
    const handleOffline = () => {
      dispatch(setOnlineStatus(false));
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [dispatch]);
  
  // Function to manually toggle online status (for simulation)
  const toggleNetworkStatus = () => {
    dispatch(setOnlineStatus(!isOnline));
  };
  
  return { isOnline, toggleNetworkStatus };
};

export default useNetworkStatus;