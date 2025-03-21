
import React, { useState, useEffect, useRef } from 'react';
import { Network, Brain, Workflow } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Simplified node type for visualization
interface VisualizerNode {
  id: string;
  type: 'human' | 'ai' | 'asset' | 'concept';
  label: string;
  size: number;
  x?: number;
  y?: number;
}

// Simplified edge type for visualization
interface VisualizerEdge {
  id: string;
  source: string;
  target: string;
  type: string;
}

// Initial mock data for visualization
const initialNodes: VisualizerNode[] = [
  { id: 'human-core', type: 'human', label: 'Human', size: 8 },
  { id: 'ai-core', type: 'ai', label: 'AI', size: 8 },
  { id: 'concept-1', type: 'concept', label: 'Creative Idea', size: 6 },
  { id: 'asset-1', type: 'asset', label: 'Generated Asset', size: 6 },
];

const initialEdges: VisualizerEdge[] = [
  { id: 'edge-1', source: 'human-core', target: 'concept-1', type: 'created' },
  { id: 'edge-2', source: 'ai-core', target: 'asset-1', type: 'generated' },
  { id: 'edge-3', source: 'concept-1', target: 'asset-1', type: 'related' },
];

const SimpleCollaborationVisualizer: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const [nodes, setNodes] = useState<VisualizerNode[]>(initialNodes);
  const [edges, setEdges] = useState<VisualizerEdge[]>(initialEdges);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Simulate growth over time
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        addRandomNode();
      }
    }, 15000); // Every 15 seconds
    
    return () => clearInterval(interval);
  }, [nodes, edges]);
  
  // Add a new random node and connect it
  const addRandomNode = () => {
    const nodeTypes = ['asset', 'concept'];
    const type = nodeTypes[Math.floor(Math.random() * nodeTypes.length)] as 'asset' | 'concept';
    const newId = `${type}-${Date.now().toString(36)}`;
    
    // Create new node
    const newNode: VisualizerNode = {
      id: newId,
      type,
      label: type === 'asset' ? 'New Asset' : 'New Concept',
      size: 5 + Math.random() * 3
    };
    
    // Get a random existing node to connect to
    const existingNode = nodes[Math.floor(Math.random() * nodes.length)];
    const sourceNode = Math.random() > 0.5 ? 'human-core' : 'ai-core';
    
    // Create new edges
    const newEdge: VisualizerEdge = {
      id: `edge-${Date.now().toString(36)}`,
      source: sourceNode,
      target: newId,
      type: 'created'
    };
    
    // Add another edge to connect to an existing node if it exists
    const secondEdge: VisualizerEdge = existingNode ? {
      id: `edge-${Date.now().toString(36)}-2`,
      source: existingNode.id,
      target: newId,
      type: 'related'
    } : null;
    
    setNodes(prev => [...prev, newNode]);
    setEdges(prev => [
      ...prev, 
      newEdge, 
      ...(secondEdge ? [secondEdge] : [])
    ]);
  };
  
  // Toggle expanded state
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };
  
  // Calculate positions (simplified force-directed layout)
  const getNodePositions = () => {
    // This is a very simplified layout algorithm
    // In a real implementation, you'd use a proper force-directed layout
    return nodes.map((node, index) => {
      const angle = (index / nodes.length) * Math.PI * 2;
      const radius = expanded ? 80 : 30;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      
      return {
        ...node,
        x,
        y
      };
    });
  };
  
  const positionedNodes = getNodePositions();
  
  // Determine the size of the visualizer
  const visualizerSize = expanded ? 240 : 100;
  
  return (
    <div 
      ref={containerRef}
      className={`fixed bottom-6 right-6 bg-[#0f0f23]/80 backdrop-blur-md rounded-xl border border-[#2A2A4A]/30 
                 shadow-lg transition-all duration-300 z-50 overflow-hidden
                 ${expanded ? 'w-[240px] h-[240px]' : 'w-[100px] h-[100px]'}`}
    >
      {/* SVG Graph Visualization */}
      <svg 
        width={visualizerSize} 
        height={visualizerSize} 
        className="cursor-pointer"
        onClick={toggleExpanded}
      >
        {/* Center point */}
        <circle 
          cx={visualizerSize/2} 
          cy={visualizerSize/2} 
          r={3} 
          fill="#9b87f5" 
          className="animate-pulse"
        />
        
        {/* Edges */}
        {edges.map(edge => {
          const source = positionedNodes.find(n => n.id === edge.source);
          const target = positionedNodes.find(n => n.id === edge.target);
          
          if (!source || !target) return null;
          
          return (
            <line 
              key={edge.id}
              x1={source.x + visualizerSize/2}
              y1={source.y + visualizerSize/2}
              x2={target.x + visualizerSize/2}
              y2={target.y + visualizerSize/2}
              stroke="#9b87f580"
              strokeWidth={1}
              strokeDasharray={edge.type === 'related' ? "2,2" : ""}
            />
          );
        })}
        
        {/* Nodes */}
        {positionedNodes.map(node => (
          <g key={node.id}>
            <circle
              cx={node.x + visualizerSize/2}
              cy={node.y + visualizerSize/2}
              r={node.type === 'human' || node.type === 'ai' ? 4 : 3}
              fill={
                node.type === 'human' 
                  ? '#7E69AB' 
                  : node.type === 'ai' 
                    ? '#9b87f5' 
                    : node.type === 'asset' 
                      ? '#6E59A5' 
                      : '#D6BCFA'
              }
              className={`
                ${node.type === 'ai' ? 'animate-pulse' : ''}
                transition-all duration-300
              `}
            />
            
            {expanded && (
              <text
                x={node.x + visualizerSize/2}
                y={node.y + visualizerSize/2 + 12}
                fontSize="8"
                fill="#ffffff80"
                textAnchor="middle"
              >
                {node.label}
              </text>
            )}
          </g>
        ))}
      </svg>
      
      {/* Additional UI when expanded */}
      {expanded && (
        <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center">
          <div className="flex space-x-1">
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <Network size={14} />
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <Brain size={14} />
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <Workflow size={14} />
            </Button>
          </div>
          <div className="text-xs text-muted-foreground">
            {nodes.length} nodes
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleCollaborationVisualizer;
