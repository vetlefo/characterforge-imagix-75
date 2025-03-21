
import React from 'react';
import { FolderOpen } from 'lucide-react';

interface EmptyStateProps {
  message?: string;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  message = 'No dependencies found', 
  className = '' 
}) => {
  return (
    <div className={`absolute inset-0 flex flex-col items-center justify-center ${className}`}>
      <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mb-4">
        <FolderOpen size={24} className="text-gray-400" />
      </div>
      <p className="text-gray-400 text-center">{message}</p>
    </div>
  );
};

export default EmptyState;
