
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

export interface HierarchyNode {
  name: string;
  children?: HierarchyNode[];
  imports?: string[];
  exports?: string[];
  size?: number;
  type?: string;
  id?: string;
}

interface DependencyContextType {
  graph: DependencyGraph;
  hierarchyData: HierarchyNode;
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

// Convert flat data to hierarchical structure
const buildHierarchy = (nodes: DependencyNode[], delimiter = "/"): HierarchyNode => {
  let root: HierarchyNode = { name: "root", children: [] };
  const map = new Map<string, HierarchyNode>();
  
  // First pass: create nodes
  nodes.forEach(node => {
    const path = node.name.split(delimiter);
    let currentName = "";
    let currentNode = root;
    
    // Create path structure
    path.forEach((part, i) => {
      currentName = currentName ? `${currentName}${delimiter}${part}` : part;
      
      if (!map.has(currentName)) {
        const newNode: HierarchyNode = { 
          name: part,
          children: [],
        };
        
        if (!currentNode.children) {
          currentNode.children = [];
        }
        
        currentNode.children.push(newNode);
        map.set(currentName, newNode);
        currentNode = newNode;
      } else {
        currentNode = map.get(currentName)!;
      }
      
      // If this is the leaf node, add all the node properties
      if (i === path.length - 1) {
        currentNode.id = node.id;
        currentNode.type = node.type;
        currentNode.size = node.size;
        currentNode.imports = node.imports;
        currentNode.exports = node.exports;
      }
    });
  });
  
  return root;
};

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
    { id: 'components/Button', name: 'components/Button.tsx', type: 'UI', size: 3, imports: [], exports: [] },
    { id: 'components/Card', name: 'components/Card.tsx', type: 'UI', size: 4, imports: ['components/Button'], exports: [] },
    { id: 'pages/Home', name: 'pages/Home.tsx', type: 'Page', size: 8, imports: ['Layout', 'components/Card'], exports: [] },
    { id: 'pages/About', name: 'pages/About.tsx', type: 'Page', size: 6, imports: ['Layout'], exports: [] },
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
  const [hierarchyData, setHierarchyData] = useState<HierarchyNode>({ name: "root", children: [] });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [highlightMode, setHighlightMode] = useState<'none' | 'imports' | 'exports' | 'both'>('none');

  const updateGraph = (newGraph: DependencyGraph) => {
    setGraph(newGraph);
    setHierarchyData(buildHierarchy(newGraph.nodes));
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
        setHierarchyData(buildHierarchy(mockData.nodes));
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
        hierarchyData,
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
