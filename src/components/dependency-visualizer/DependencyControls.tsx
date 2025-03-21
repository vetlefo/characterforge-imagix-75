
import React from 'react';
import { useDependency } from './DependencyContext';
import { Button } from '@/components/ui/button';
import { RefreshCcw, ZoomIn, ZoomOut, Filter, Eye } from 'lucide-react';

interface DependencyControlsProps {
  className?: string;
}

const DependencyControls: React.FC<DependencyControlsProps> = ({ className = '' }) => {
  const { 
    refreshDependencies, 
    loading, 
    highlightMode, 
    setHighlightMode 
  } = useDependency();

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={refreshDependencies}
        disabled={loading}
        className="bg-blue-500/20 border-blue-500/30 hover:bg-blue-500/30 gap-2"
      >
        <RefreshCcw size={16} />
        {loading ? 'Refreshing...' : 'Refresh'}
      </Button>
      
      <div className="border-l border-gray-700 mx-2"></div>
      
      <Button 
        variant="outline" 
        size="sm"
        className={`gap-2 ${highlightMode === 'imports' ? 'bg-indigo-600/50' : 'bg-indigo-600/10'}`}
        onClick={() => setHighlightMode(highlightMode === 'imports' ? 'none' : 'imports')}
      >
        <Filter size={16} />
        Show Imports
      </Button>
      
      <Button 
        variant="outline" 
        size="sm"
        className={`gap-2 ${highlightMode === 'exports' ? 'bg-purple-600/50' : 'bg-purple-600/10'}`}
        onClick={() => setHighlightMode(highlightMode === 'exports' ? 'none' : 'exports')}
      >
        <Eye size={16} />
        Show Exports
      </Button>
      
      <Button 
        variant="outline" 
        size="sm"
        className={`gap-2 ${highlightMode === 'both' ? 'bg-pink-600/50' : 'bg-pink-600/10'}`}
        onClick={() => setHighlightMode(highlightMode === 'both' ? 'none' : 'both')}
      >
        <Eye size={16} />
        Show All
      </Button>
    </div>
  );
};

export default DependencyControls;
