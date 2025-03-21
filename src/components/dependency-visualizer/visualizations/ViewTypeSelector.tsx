
import React from 'react';

interface ViewTypeSelectorProps {
  viewType: 'force' | 'hierarchical' | 'radial';
  setViewType: (type: 'force' | 'hierarchical' | 'radial') => void;
  className?: string;
}

const ViewTypeSelector: React.FC<ViewTypeSelectorProps> = ({
  viewType,
  setViewType,
  className = ''
}) => {
  return (
    <div className={`bg-[#1A1A2E]/80 p-2 rounded text-xs text-white ${className}`}>
      <button 
        className={`px-3 py-1 rounded ${viewType === 'force' ? 'bg-blue-600' : 'bg-gray-700'}`}
        onClick={() => setViewType('force')}
      >
        Force
      </button>
      <button 
        className={`px-3 py-1 rounded ml-2 ${viewType === 'hierarchical' ? 'bg-blue-600' : 'bg-gray-700'}`}
        onClick={() => setViewType('hierarchical')}
      >
        Tree
      </button>
      <button 
        className={`px-3 py-1 rounded ml-2 ${viewType === 'radial' ? 'bg-blue-600' : 'bg-gray-700'}`}
        onClick={() => setViewType('radial')}
      >
        Radial
      </button>
    </div>
  );
};

export default ViewTypeSelector;
