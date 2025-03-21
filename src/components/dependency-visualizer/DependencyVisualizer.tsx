
import React from 'react';
import { DependencyProvider } from './DependencyContext';
import DependencyGraph from './DependencyGraph';
import DependencyControls from './DependencyControls';
import DependencyDetails from './DependencyDetails';

interface DependencyVisualizerProps {
  className?: string;
}

const DependencyVisualizer: React.FC<DependencyVisualizerProps> = ({ className = '' }) => {
  return (
    <DependencyProvider>
      <div className={`p-4 md:p-6 bg-[#0A0A1B]/70 backdrop-blur-md rounded-xl border border-[#2A2A4A]/30 ${className}`}>
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl md:text-2xl font-bold text-white bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              Dependency Visualizer
            </h2>
            
            <DependencyControls />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-3 bg-[#0F0F23]/50 rounded-lg border border-[#2A2A4A]/20 overflow-hidden" style={{ minHeight: '500px' }}>
              <DependencyGraph className="h-full" />
            </div>
            
            <div className="lg:col-span-1">
              <DependencyDetails className="h-full" />
            </div>
          </div>
          
          <div className="text-xs text-gray-500 mt-4 bg-[#0F0F23]/30 p-3 rounded-lg">
            <p className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full bg-blue-500"></span>
              <strong>UI Components</strong> - 
              <span className="inline-block w-3 h-3 rounded-full bg-red-500 ml-4"></span>
              <strong>Pages</strong> - 
              <span className="inline-block w-3 h-3 rounded-full bg-green-500 ml-4"></span>
              <strong>Hooks</strong> - 
              <span className="inline-block w-3 h-3 rounded-full bg-purple-500 ml-4"></span>
              <strong>Context</strong>
            </p>
            <p className="mt-2">
              Tip: Drag nodes to reposition them. Click on a node to see its dependencies. Use the view selector to switch between Force, Tree, and Radial layouts.
            </p>
          </div>
        </div>
      </div>
    </DependencyProvider>
  );
};

export default DependencyVisualizer;
