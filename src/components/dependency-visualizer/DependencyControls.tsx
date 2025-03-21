
import React from 'react';
import { useDependency } from './DependencyContext';
import { Button } from '@/components/ui/button';
import { RefreshCcw, Filter, Eye, Search, Info, FileTree } from 'lucide-react';

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
        <span className="hidden md:inline">Show</span> Imports
      </Button>
      
      <Button 
        variant="outline" 
        size="sm"
        className={`gap-2 ${highlightMode === 'exports' ? 'bg-purple-600/50' : 'bg-purple-600/10'}`}
        onClick={() => setHighlightMode(highlightMode === 'exports' ? 'none' : 'exports')}
      >
        <Eye size={16} />
        <span className="hidden md:inline">Show</span> Exports
      </Button>
      
      <Button 
        variant="outline" 
        size="sm"
        className={`gap-2 ${highlightMode === 'both' ? 'bg-pink-600/50' : 'bg-pink-600/10'}`}
        onClick={() => setHighlightMode(highlightMode === 'both' ? 'none' : 'both')}
      >
        <FileTree size={16} />
        <span className="hidden md:inline">Show All</span>
        <span className="md:hidden">All</span>
      </Button>
      
      <div className="flex-grow"></div>
      
      <Button
        variant="ghost"
        size="sm"
        className="gap-2 text-xs text-gray-400"
      >
        <Search size={14} />
        <span className="hidden md:inline">Search files</span>
        <span className="md:hidden">Search</span>
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        className="gap-2 text-xs text-gray-400"
      >
        <Info size={14} />
        <span className="hidden md:inline">Click nodes to explore dependencies</span>
      </Button>
    </div>
  );
};

export default DependencyControls;
