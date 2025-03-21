
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define types for our dependency graph
export interface DependencyNode {
  id: string;
  name: string;
  type: string;
  size: number;
  imports: string[];
  exports: string[];
}

export interface DependencyLink {
  source: string;
  target: string;
  type: 'import' | 'export' | 'bidirectional';
  strength: number;
}

export interface DependencyGraph {
  nodes: DependencyNode[];
  links: DependencyLink[];
}

interface DependencyContextType {
  graph: DependencyGraph;
  loading: boolean;
  error: string | null;
  updateGraph: (newGraph: DependencyGraph) => void;
  refreshDependencies: () => void;
  selectedNode: string | null;
  setSelectedNode: (nodeId: string | null) => void;
  highlightMode: 'none' | 'imports' | 'exports' | 'both';
  setHighlightMode: (mode: 'none' | 'imports' | 'exports' | 'both') => void;
}

const DependencyContext = createContext<DependencyContextType | undefined>(undefined);

// Mock data generator for demonstration purposes
const generateMockData = (): DependencyGraph => {
  // List of component types
  const componentTypes = ['UI', 'Page', 'Hook', 'Context', 'Util', 'Service'];
  
  // Create nodes
  const nodes: DependencyNode[] = [
    { id: 'App', name: 'App.tsx', type: 'Page', size: 10, imports: ['Layout', 'Router'], exports: [] },
    { id: 'Layout', name: 'Layout.tsx', type: 'UI', size: 8, imports: ['Sidebar', 'Header'], exports: [] },
    { id: 'Router', name: 'Router.tsx', type: 'UI', size: 7, imports: ['AuthContext'], exports: [] },
    { id: 'Sidebar', name: 'Sidebar.tsx', type: 'UI', size: 6, imports: ['AuthContext'], exports: [] },
    { id: 'Header', name: 'Header.tsx', type: 'UI', size: 5, imports: ['AuthContext', 'utils'], exports: [] },
    { id: 'AuthContext', name: 'AuthContext.tsx', type: 'Context', size: 9, imports: ['utils', 'api'], exports: [] },
    { id: 'utils', name: 'utils.ts', type: 'Util', size: 4, imports: [], exports: [] },
    { id: 'api', name: 'api.ts', type: 'Service', size: 6, imports: [], exports: [] },
    { id: 'CreativeContext', name: 'CreativeContext.tsx', type: 'Context', size: 9, imports: ['assetService', 'conversationService'], exports: [] },
    { id: 'assetService', name: 'assetService.ts', type: 'Service', size: 7, imports: ['api'], exports: [] },
    { id: 'conversationService', name: 'conversationService.ts', type: 'Service', size: 5, imports: [], exports: [] },
  ];
  
  // Create links based on imports
  const links: DependencyLink[] = [];
  
  nodes.forEach(node => {
    node.imports.forEach(importName => {
      links.push({
        source: node.id,
        target: importName,
        type: 'import',
        strength: 1
      });
    });
  });
  
  return { nodes, links };
};

export const DependencyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [graph, setGraph] = useState<DependencyGraph>({ nodes: [], links: [] });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [highlightMode, setHighlightMode] = useState<'none' | 'imports' | 'exports' | 'both'>('none');

  const updateGraph = (newGraph: DependencyGraph) => {
    setGraph(newGraph);
  };

  const refreshDependencies = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real implementation, this would call an API to parse the codebase
      // For now, we'll use mock data
      const mockData = generateMockData();
      
      // Simulate API delay
      setTimeout(() => {
        setGraph(mockData);
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError('Failed to load dependencies');
      setLoading(false);
      console.error('Error fetching dependencies:', err);
    }
  };

  // Load initial data
  useEffect(() => {
    refreshDependencies();
  }, []);

  return (
    <DependencyContext.Provider
      value={{
        graph,
        loading,
        error,
        updateGraph,
        refreshDependencies,
        selectedNode,
        setSelectedNode,
        highlightMode,
        setHighlightMode
      }}
    >
      {children}
    </DependencyContext.Provider>
  );
};

export const useDependency = () => {
  const context = useContext(DependencyContext);
  if (context === undefined) {
    throw new Error('useDependency must be used within a DependencyProvider');
  }
  return context;
};
