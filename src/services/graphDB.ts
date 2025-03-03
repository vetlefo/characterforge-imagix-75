/**
 * GraphDB Service - In-memory graph database implementation
 * 
 * This service provides a simple graph database for managing nodes and relationships
 * between creative elements in the application. It supports:
 * - Creating, reading, updating, and deleting nodes
 * - Managing relationships between nodes
 * - Traversing the graph to find related elements
 * - Querying by node type and properties
 */

export interface GraphNode {
  id: string;
  type: string; 
  properties: Record<string, any>;
  createdAt: number;
  updatedAt: number;
}

export interface GraphRelationship {
  id: string;
  sourceId: string;
  targetId: string;
  type: string;
  properties: Record<string, any>;
  createdAt: number;
  updatedAt: number;
}

export interface GraphQuery {
  nodeType?: string;
  properties?: Record<string, any>;
  relationships?: {
    type?: string;
    direction?: 'outgoing' | 'incoming' | 'both';
    nodeType?: string;
  }[];
}

class InMemoryGraphDB {
  private nodes: Map<string, GraphNode>;
  private relationships: Map<string, GraphRelationship>;
  private nodeRelationships: Map<string, Set<string>>;

  constructor() {
    this.nodes = new Map();
    this.relationships = new Map();
    this.nodeRelationships = new Map();
  }

  // Node operations
  
  public createNode(id: string, type: string, properties: Record<string, any> = {}): GraphNode {
    const timestamp = Date.now();
    const node: GraphNode = {
      id,
      type,
      properties,
      createdAt: timestamp,
      updatedAt: timestamp
    };
    
    this.nodes.set(id, node);
    this.nodeRelationships.set(id, new Set());
    
    return node;
  }

  public getNode(id: string): GraphNode | null {
    return this.nodes.get(id) || null;
  }

  public updateNode(id: string, properties: Record<string, any>): GraphNode | null {
    const node = this.nodes.get(id);
    
    if (!node) {
      return null;
    }
    
    const updatedNode: GraphNode = {
      ...node,
      properties: {
        ...node.properties,
        ...properties
      },
      updatedAt: Date.now()
    };
    
    this.nodes.set(id, updatedNode);
    return updatedNode;
  }

  public deleteNode(id: string): boolean {
    if (!this.nodes.has(id)) {
      return false;
    }
    
    // Delete all relationships associated with this node
    const relationshipIds = this.nodeRelationships.get(id) || new Set();
    relationshipIds.forEach(relId => {
      const relationship = this.relationships.get(relId);
      if (relationship) {
        // Remove from the other node's relationships
        const otherId = relationship.sourceId === id ? relationship.targetId : relationship.sourceId;
        const otherNodeRelationships = this.nodeRelationships.get(otherId);
        if (otherNodeRelationships) {
          otherNodeRelationships.delete(relId);
        }
        
        // Delete the relationship
        this.relationships.delete(relId);
      }
    });
    
    // Delete the node and its relationship tracking
    this.nodes.delete(id);
    this.nodeRelationships.delete(id);
    
    return true;
  }

  // Relationship operations
  
  public createRelationship(
    id: string,
    sourceId: string,
    targetId: string,
    type: string,
    properties: Record<string, any> = {}
  ): GraphRelationship | null {
    // Check if both nodes exist
    if (!this.nodes.has(sourceId) || !this.nodes.has(targetId)) {
      return null;
    }
    
    const timestamp = Date.now();
    const relationship: GraphRelationship = {
      id,
      sourceId,
      targetId,
      type,
      properties,
      createdAt: timestamp,
      updatedAt: timestamp
    };
    
    this.relationships.set(id, relationship);
    
    // Add relationship to both nodes' tracking
    this.nodeRelationships.get(sourceId)?.add(id);
    this.nodeRelationships.get(targetId)?.add(id);
    
    return relationship;
  }

  public getRelationship(id: string): GraphRelationship | null {
    return this.relationships.get(id) || null;
  }

  public updateRelationship(id: string, properties: Record<string, any>): GraphRelationship | null {
    const relationship = this.relationships.get(id);
    
    if (!relationship) {
      return null;
    }
    
    const updatedRelationship: GraphRelationship = {
      ...relationship,
      properties: {
        ...relationship.properties,
        ...properties
      },
      updatedAt: Date.now()
    };
    
    this.relationships.set(id, updatedRelationship);
    return updatedRelationship;
  }

  public deleteRelationship(id: string): boolean {
    const relationship = this.relationships.get(id);
    
    if (!relationship) {
      return false;
    }
    
    // Remove from node tracking
    this.nodeRelationships.get(relationship.sourceId)?.delete(id);
    this.nodeRelationships.get(relationship.targetId)?.delete(id);
    
    // Delete the relationship
    this.relationships.delete(id);
    
    return true;
  }

  // Query operations
  
  public getNodesByType(type: string): GraphNode[] {
    return Array.from(this.nodes.values()).filter(node => node.type === type);
  }

  public getNodeRelationships(nodeId: string, options?: {
    direction?: 'outgoing' | 'incoming' | 'both';
    type?: string;
  }): GraphRelationship[] {
    const relationshipIds = this.nodeRelationships.get(nodeId);
    
    if (!relationshipIds) {
      return [];
    }
    
    let relationships = Array.from(relationshipIds)
      .map(id => this.relationships.get(id))
      .filter((rel): rel is GraphRelationship => rel !== undefined);
    
    // Filter by direction
    if (options?.direction) {
      relationships = relationships.filter(rel => {
        if (options.direction === 'outgoing') {
          return rel.sourceId === nodeId;
        } else if (options.direction === 'incoming') {
          return rel.targetId === nodeId;
        }
        return true; // 'both'
      });
    }
    
    // Filter by type
    if (options?.type) {
      relationships = relationships.filter(rel => rel.type === options.type);
    }
    
    return relationships;
  }

  public getRelatedNodes(nodeId: string, options?: {
    direction?: 'outgoing' | 'incoming' | 'both';
    type?: string;
    relationshipType?: string;
  }): GraphNode[] {
    const relationships = this.getNodeRelationships(nodeId, {
      direction: options?.direction,
      type: options?.relationshipType
    });
    
    const relatedNodeIds = relationships.map(rel => {
      return rel.sourceId === nodeId ? rel.targetId : rel.sourceId;
    });
    
    let nodes = relatedNodeIds
      .map(id => this.nodes.get(id))
      .filter((node): node is GraphNode => node !== undefined);
    
    // Filter by node type
    if (options?.type) {
      nodes = nodes.filter(node => node.type === options.type);
    }
    
    return nodes;
  }

  public executeQuery(query: GraphQuery): GraphNode[] {
    let results = Array.from(this.nodes.values());
    
    // Filter by node type
    if (query.nodeType) {
      results = results.filter(node => node.type === query.nodeType);
    }
    
    // Filter by properties
    if (query.properties) {
      results = results.filter(node => {
        return Object.entries(query.properties || {}).every(([key, value]) => {
          return node.properties[key] === value;
        });
      });
    }
    
    // Filter by relationships
    if (query.relationships && query.relationships.length > 0) {
      for (const relConstraint of query.relationships) {
        const filteredNodes: Set<string> = new Set();
        
        results.forEach(node => {
          const relatedNodes = this.getRelatedNodes(node.id, {
            direction: relConstraint.direction,
            type: relConstraint.nodeType,
            relationshipType: relConstraint.type
          });
          
          if (relatedNodes.length > 0) {
            filteredNodes.add(node.id);
          }
        });
        
        results = results.filter(node => filteredNodes.has(node.id));
      }
    }
    
    return results;
  }

  // Utility operations
  
  public getAllNodes(): GraphNode[] {
    return Array.from(this.nodes.values());
  }

  public getAllRelationships(): GraphRelationship[] {
    return Array.from(this.relationships.values());
  }

  public clearAll(): void {
    this.nodes.clear();
    this.relationships.clear();
    this.nodeRelationships.clear();
  }
}

// Create a singleton instance for global use
const graphDB = new InMemoryGraphDB();

export default graphDB;