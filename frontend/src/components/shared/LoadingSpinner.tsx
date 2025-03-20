import React from 'react';

interface LoadingSpinnerProps {
  color?: string;
  size?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  color = 'white',
  size = '5'
}) => (
  <div className="spinner-container">
    <div 
      className={`animate-spin rounded-full h-${size} w-${size} border-b-2`}
      style={{ borderColor: color }}
    />
  </div>
);
