
import React from 'react';

interface LoadingStateProps {
  message?: string;
  className?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = 'Loading dependency graph...', 
  className = '' 
}) => {
  return (
    <div className={`flex items-center justify-center h-full ${className}`}>
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-t-blue-500 border-b-blue-700 rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-gray-400">{message}</p>
      </div>
    </div>
  );
};

export default LoadingState;
