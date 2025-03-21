
import React from 'react';

interface EmptyStateProps {
  message?: string;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  message = 'No dependencies found', 
  className = '' 
}) => {
  return (
    <div className={`absolute inset-0 flex items-center justify-center ${className}`}>
      <p className="text-gray-400">{message}</p>
    </div>
  );
};

export default EmptyState;
