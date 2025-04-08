// src/components/NetworkToggle.js
import React from 'react';
import useNetworkStatus from '../hooks/useNetworkStatus';
import '../Styles/network.css';

const NetworkToggle = () => {
  const { isOnline, toggleNetworkStatus } = useNetworkStatus();
  
  return (
    <button
      onClick={toggleNetworkStatus}
      className={`network-toggle-btn ${isOnline ? 'online' : 'offline'}`}
    >
      <span className={`status-dot ${isOnline ? 'online' : 'offline'}`}></span>
      {isOnline ? 'Online' : 'Offline'}
    </button>
  );
};

export default NetworkToggle;