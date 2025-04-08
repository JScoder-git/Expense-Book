// src/components/auth/SessionMonitor.js
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout, setSessionExpired, selectSessionExpiry, selectIsAuthenticated } from '../../features/auth/authSlice';
import { authService } from '../../services/authService';

const SessionMonitor = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sessionExpiry = useSelector(selectSessionExpiry);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    // If not authenticated, no need to monitor
    if (!isAuthenticated || !sessionExpiry) return;

    const checkSessionExpiry = () => {
      if (Date.now() > sessionExpiry) {
        // Session expired
        authService.logoutUser();
        dispatch(setSessionExpired());
        navigate('/login', { state: { message: 'Session expired. Please log in again.' } });
      }
    };

    // Initial check
    checkSessionExpiry();

    // Set up interval to check session expiry every 30 seconds
    const interval = setInterval(checkSessionExpiry, 30000);

    return () => clearInterval(interval);
  }, [dispatch, navigate, sessionExpiry, isAuthenticated]);

  return null; // This component doesn't render anything
};

export default SessionMonitor;