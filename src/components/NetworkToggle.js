// src/components/NetworkToggle.js
import React from 'react';
import useNetworkStatus from '../hooks/useNetworkStatus';

const NetworkToggle = () => {
  const { isOnline, toggleNetworkStatus } = useNetworkStatus();
  
  return (
    <div className="flex items-center mb-4">
      <span className="mr-2">Network:</span>
      <button
        onClick={toggleNetworkStatus}
        className={`px-4 py-2 rounded-md ${
          isOnline 
            ? 'bg-green-500 hover:bg-green-600' 
            : 'bg-gray-500 hover:bg-gray-600'
        } text-white transition-colors`}
      >
        {isOnline ? 'Online' : 'Offline'}
      </button>
    </div>
  );
};

export default NetworkToggle;