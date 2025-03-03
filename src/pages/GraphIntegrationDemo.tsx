import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import graphDB, { GraphNode, GraphRelationship } from '@/services/graphDB';
import { v4 as uuidv4 } from 'uuid';

/**
 * A demo page that visualizes the graph database and provides a UI for interacting with it.
 * This page demonstrates:
 * - Creating nodes and relationships
 * - Visualizing the graph
 * - Traversing the graph
 * - Querying the graph
 */
const GraphIntegrationDemo = () => {
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [relationships, setRelationships] = useState<GraphRelationship[]>([]);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [selectedRelatedNode, setSelectedRelatedNode] = useState<GraphNode | null>(null);
  const [newNodeType, setNewNodeType] = useState('concept');
  const [newNodeName, setNewNodeName] = useState('');
  const [newRelationshipType, setNewRelationshipType] = useState('related_to');
  const [newRelationshipSource, setNewRelationshipSource] = useState('');
  const [newRelationshipTarget, setNewRelationshipTarget] = useState('');
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Initialize the graph with some sample data
  useEffect(() => {
    initializeGraph();
  }, []);
  
  // Update the nodes and relationships whenever they change
  useEffect(() => {
    refreshGraph();
  }, []);
  
  // Draw the graph when nodes or relationships change
  useEffect(() => {
    drawGraph();
  }, [nodes, relationships, selectedNode]);
  
  // Initialize the graph with some sample data
  const initializeGraph = () => {
    // Clear the graph
    graphDB.clearAll();
    
    // Create some sample nodes
    const conceptNode = graphDB.createNode(uuidv4(), 'concept', { name: 'Creative Canvas' });
    const featureNode1 = graphDB.createNode(uuidv4(), 'feature', { name: 'Drawing Tools' });
    const featureNode2 = graphDB.createNode(uuidv4(), 'feature', { name: 'Animation System' });
    const featureNode3 = graphDB.createNode(uuidv4(), 'feature', { name: 'Style Controls' });
    
    // Create some sample relationships
    graphDB.createRelationship(uuidv4(), conceptNode.id, featureNode1.id, 'has_feature');
    graphDB.createRelationship(uuidv4(), conceptNode.id, featureNode2.id, 'has_feature');
    graphDB.createRelationship(uuidv4(), conceptNode.id, featureNode3.id, 'has_feature');
    graphDB.createRelationship(uuidv4(), featureNode1.id, featureNode2.id, 'can_enhance');
    
    // Refresh the graph
    refreshGraph();
  };
  
  // Refresh the graph data from the database
  const refreshGraph = () => {
    setNodes(graphDB.getAllNodes());
    setRelationships(graphDB.getAllRelationships());
  };
  
  // Create a new node
  const createNode = () => {
    if (newNodeName.trim() === '') {
      return;
    }
    
    const newNode = graphDB.createNode(uuidv4(), newNodeType, { name: newNodeName });
    setNewNodeName('');
    refreshGraph();
  };
  
  // Create a new relationship
  const createRelationship = () => {
    if (newRelationshipSource === '' || newRelationshipTarget === '') {
      return;
    }
    
    graphDB.createRelationship(uuidv4(), newRelationshipSource, newRelationshipTarget, newRelationshipType);
    refreshGraph();
  };
  
  // Draw the graph using HTML Canvas
  const drawGraph = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Calculate node positions (simple circle layout)
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 50;
    
    // Calculate positions for each node
    const nodePositions: Record<string, { x: number, y: number }> = {};
    nodes.forEach((node, index) => {
      const angle = (index / nodes.length) * 2 * Math.PI;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      nodePositions[node.id] = { x, y };
    });
    
    // Draw relationships
    ctx.strokeStyle = '#888';
    ctx.lineWidth = 1;
    
    relationships.forEach(relationship => {
      const sourcePos = nodePositions[relationship.sourceId];
      const targetPos = nodePositions[relationship.targetId];
      
      if (sourcePos && targetPos) {
        // Draw the line
        ctx.beginPath();
        ctx.moveTo(sourcePos.x, sourcePos.y);
        ctx.lineTo(targetPos.x, targetPos.y);
        ctx.stroke();
        
        // Draw the relationship type
        const midX = (sourcePos.x + targetPos.x) / 2;
        const midY = (sourcePos.y + targetPos.y) / 2;
        
        ctx.fillStyle = '#555';
        ctx.font = '10px Arial';
        ctx.fillText(relationship.type, midX, midY);
      }
    });
    
    // Draw nodes
    nodes.forEach(node => {
      const pos = nodePositions[node.id];
      
      if (pos) {
        // Node circle
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 20, 0, 2 * Math.PI);
        
        // Style based on node type and selection
        if (node.id === selectedNode?.id) {
          ctx.fillStyle = '#4c7cff';
        } else if (node.id === selectedRelatedNode?.id) {
          ctx.fillStyle = '#ff7c4c';
        } else {
          switch (node.type) {
            case 'concept':
              ctx.fillStyle = '#a7e8bd';
              break;
            case 'feature':
              ctx.fillStyle = '#e8d6a7';
              break;
            default:
              ctx.fillStyle = '#e8a7a7';
          }
        }
        
        ctx.fill();
        ctx.stroke();
        
        // Node label
        ctx.fillStyle = '#333';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(node.properties.name || node.id, pos.x, pos.y);
      }
    });
  };
  
  // Handle node selection
  const selectNode = (nodeId: string) => {
    const node = graphDB.getNode(nodeId);
    setSelectedNode(node);
    setSelectedRelatedNode(null);
  };
  
  // Handle related node selection
  const selectRelatedNode = (nodeId: string) => {
    const node = graphDB.getNode(nodeId);
    setSelectedRelatedNode(node);
  };
  
  // Get related nodes for the selected node
  const getRelatedNodes = () => {
    if (!selectedNode) return [];
    
    return graphDB.getRelatedNodes(selectedNode.id);
  };
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Graph Database Integration Demo</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Graph Visualization</h2>
            <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
              <canvas 
                ref={canvasRef} 
                width={600} 
                height={400} 
                className="w-full h-[400px]"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={initializeGraph}>Reset Demo Graph</Button>
              <Button variant="outline" onClick={refreshGraph}>Refresh Graph</Button>
            </div>
          </Card>
        </div>
        
        <div>
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Create Node</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Node Type</label>
                <Select value={newNodeType} onValueChange={setNewNodeType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select node type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="concept">Concept</SelectItem>
                    <SelectItem value="feature">Feature</SelectItem>
                    <SelectItem value="component">Component</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <Input 
                  value={newNodeName} 
                  onChange={(e) => setNewNodeName(e.target.value)} 
                  placeholder="Enter node name"
                />
              </div>
              
              <Button onClick={createNode}>Create Node</Button>
            </div>
          </Card>
          
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Create Relationship</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Source Node</label>
                <Select value={newRelationshipSource} onValueChange={setNewRelationshipSource}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select source node" />
                  </SelectTrigger>
                  <SelectContent>
                    {nodes.map(node => (
                      <SelectItem key={node.id} value={node.id}>
                        {node.properties.name || node.id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Relationship Type</label>
                <Select value={newRelationshipType} onValueChange={setNewRelationshipType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select relationship type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="has_feature">Has Feature</SelectItem>
                    <SelectItem value="related_to">Related To</SelectItem>
                    <SelectItem value="depends_on">Depends On</SelectItem>
                    <SelectItem value="can_enhance">Can Enhance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Target Node</label>
                <Select value={newRelationshipTarget} onValueChange={setNewRelationshipTarget}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select target node" />
                  </SelectTrigger>
                  <SelectContent>
                    {nodes.map(node => (
                      <SelectItem key={node.id} value={node.id}>
                        {node.properties.name || node.id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button onClick={createRelationship}>Create Relationship</Button>
            </div>
          </Card>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Node Explorer</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Select Node</label>
              <Select value={selectedNode?.id || ''} onValueChange={selectNode}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a node to explore" />
                </SelectTrigger>
                <SelectContent>
                  {nodes.map(node => (
                    <SelectItem key={node.id} value={node.id}>
                      {node.properties.name || node.id} ({node.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {selectedNode && (
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold">Node Details</h3>
                <div className="mt-2 space-y-2">
                  <div><span className="font-medium">ID:</span> {selectedNode.id}</div>
                  <div><span className="font-medium">Type:</span> {selectedNode.type}</div>
                  <div><span className="font-medium">Name:</span> {selectedNode.properties.name}</div>
                  <div>
                    <span className="font-medium">Properties:</span>
                    <pre className="mt-1 text-xs bg-gray-100 p-2 rounded">
                      {JSON.stringify(selectedNode.properties, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
        
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Relationships</h2>
          {selectedNode ? (
            <>
              <label className="block text-sm font-medium mb-1">Related Nodes</label>
              {getRelatedNodes().length > 0 ? (
                <div className="space-y-2">
                  {getRelatedNodes().map(relatedNode => (
                    <div 
                      key={relatedNode.id} 
                      className={`p-3 border rounded cursor-pointer ${
                        relatedNode.id === selectedRelatedNode?.id 
                          ? 'bg-blue-50 border-blue-300' 
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                      onClick={() => selectRelatedNode(relatedNode.id)}
                    >
                      <div className="font-medium">{relatedNode.properties.name || relatedNode.id}</div>
                      <div className="text-sm text-gray-500">Type: {relatedNode.type}</div>
                      {/* Find the relationship between the nodes */}
                      {graphDB.getNodeRelationships(selectedNode.id).filter(rel => 
                        rel.sourceId === relatedNode.id || rel.targetId === relatedNode.id
                      ).map(rel => (
                        <div key={rel.id} className="text-xs bg-gray-100 px-2 py-1 rounded mt-1 inline-block">
                          {rel.sourceId === selectedNode.id 
                            ? `→ ${rel.type} →` 
                            : `← ${rel.type} ←`}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500">No related nodes found.</div>
              )}
            </>
          ) : (
            <div className="text-gray-500">Select a node to view its relationships.</div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default GraphIntegrationDemo;