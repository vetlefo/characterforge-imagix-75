
import React from 'react';

interface ErrorStateProps {
  error: string;
  onRetry?: () => void;
  className?: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({ 
  error, 
  onRetry, 
  className = '' 
}) => {
  return (
    <div className={`flex items-center justify-center h-full ${className}`}>
      <div className="text-center text-red-500">
        <p>Error: {error}</p>
        {onRetry && (
          <button 
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={onRetry}
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorState;
