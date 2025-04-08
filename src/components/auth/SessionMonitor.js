import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSessionExpired, selectSessionExpiry, selectIsAuthenticated } from '../../features/auth/authSlice';
import { authService } from '../../services/authService';

const SessionMonitor = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sessionExpiry = useSelector(selectSessionExpiry);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    if (!isAuthenticated || !sessionExpiry) return;

    const checkSessionExpiry = () => {
      if (Date.now() > sessionExpiry) {
        authService.logoutUser();
        dispatch(setSessionExpired());
        navigate('/login', { state: { message: 'Session expired. Please log in again.' } });
      }
    };

    checkSessionExpiry();

    const interval = setInterval(checkSessionExpiry, 30000);
    return () => clearInterval(interval);
  }, [dispatch, navigate, sessionExpiry, isAuthenticated]);

  return null;
};

export default SessionMonitor;