// src/App.js
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from './features/auth/authSlice';

// Components
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import Dashboard from './components/dashboard/Dashboard';
import ProtectedRoute from './components/auth/ProtectedRoute';
import SessionMonitor from './components/auth/SessionMonitor';

// Services
import { authService } from './services/authService';

// CSS
import './App.css';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Check if there's an existing valid session on app load
    const sessionCheck = authService.checkSession();
    
    if (sessionCheck.isValid) {
      dispatch(login({
        user: sessionCheck.user,
        sessionExpiry: sessionCheck.sessionExpiry
      }));
    }
  }, [dispatch]);

  return (
    <Router>
      <SessionMonitor />
      <div className="app-container">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;