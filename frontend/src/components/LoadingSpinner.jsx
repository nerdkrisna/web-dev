import React from 'react';

const LoadingSpinner = ({ text = 'Loading project data...' }) => {
  return (
    <div className="spinner-wrapper" id="loading-spinner-container">
      <div className="spinner" id="loading-spinner"></div>
      <p style={{ fontSize: '0.9rem', fontWeight: 500 }}>{text}</p>
    </div>
  );
};

export default LoadingSpinner;
