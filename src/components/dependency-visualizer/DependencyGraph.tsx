
import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { useDependency, DependencyNode, DependencyLink } from './DependencyContext';

interface DependencyGraphProps {
  width?: number;
  height?: number;
  className?: string;
}

const DependencyGraph: React.FC<DependencyGraphProps> = ({ 
  width = 800, 
  height = 600,
  className = ''
}) => {
  const { 
    graph, 
    loading, 
    error, 
    selectedNode, 
    setSelectedNode,
    highlightMode 
  } = useDependency();
  
  const svgRef = useRef<SVGSVGElement>(null);
  const [viewType, setViewType] = useState<'force' | 'hierarchical'>('force');

  useEffect(() => {
    if (loading || error || !svgRef.current || graph.nodes.length === 0) return;

    // Clear previous graph
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('width', '100%')
      .attr('height', '100%');

    // Add zoom functionality
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    // Create the main group that will contain our visualization
    const g = svg.append('g');

    // Add a border and background
    g.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', '#0F0F23')
      .attr('rx', 10)
      .attr('stroke', '#2A2A4A')
      .attr('stroke-width', 1);

    // Color scale for node types
    const colorScale = d3.scaleOrdinal<string>()
      .domain(['UI', 'Page', 'Hook', 'Context', 'Util', 'Service'])
      .range(['#4299E1', '#F56565', '#68D391', '#9F7AEA', '#F6E05E', '#ED8936']);

    // Define arrow markers for different link types
    const defs = svg.append('defs');
    
    ['import', 'export', 'bidirectional'].forEach(type => {
      defs.append('marker')
        .attr('id', `arrow-${type}`)
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 20)
        .attr('refY', 0)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .append('path')
        .attr('fill', type === 'import' ? '#6366F1' : type === 'export' ? '#8B5CF6' : '#EC4899')
        .attr('d', 'M0,-5L10,0L0,5');
    });

    if (viewType === 'force') {
      renderForceDirectedGraph(g, svg, colorScale);
    } else {
      renderHierarchicalBundling(g, svg, colorScale);
    }

    // Toggle view type button
    svg.append('g')
      .attr('transform', `translate(${width - 40}, 30)`)
      .append('circle')
      .attr('r', 15)
      .attr('fill', '#4A4A6A')
      .attr('stroke', '#8B5CF6')
      .attr('stroke-width', 2)
      .attr('cursor', 'pointer')
      .on('click', () => {
        setViewType(viewType === 'force' ? 'hierarchical' : 'force');
      });

    svg.append('g')
      .attr('transform', `translate(${width - 40}, 30)`)
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('fill', 'white')
      .attr('font-size', '10px')
      .attr('pointer-events', 'none')
      .text(viewType === 'force' ? 'H' : 'F');

    return () => {
      // Cleanup
    };
  }, [graph, loading, error, width, height, selectedNode, highlightMode, viewType]);

  const renderForceDirectedGraph = (g: d3.Selection<SVGGElement, unknown, null, undefined>, 
                                    svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
                                    colorScale: d3.ScaleOrdinal<string, string>) => {
    // Create the force simulation
    const simulation = d3.forceSimulation(graph.nodes as d3.SimulationNodeDatum[])
      .force('link', d3.forceLink(graph.links)
        .id((d: any) => d.id)
        .distance(100)
      )
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius((d: any) => d.size * 2 + 10));

    // Draw links
    const links = g.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(graph.links)
      .enter()
      .append('line')
      .attr('stroke-width', (d: DependencyLink) => Math.sqrt(d.strength) * 2)
      .attr('stroke', '#4A4A6A')
      .attr('stroke-opacity', 0.6)
      .attr('marker-end', (d: DependencyLink) => `url(#arrow-${d.type})`);

    // Draw nodes
    const nodes = g.append('g')
      .attr('class', 'nodes')
      .selectAll('circle')
      .data(graph.nodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .call(d3.drag<SVGGElement, DependencyNode>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended)
      )
      .on('click', (event, d: DependencyNode) => {
        event.stopPropagation();
        setSelectedNode(selectedNode === d.id ? null : d.id);
      });

    // Add node circles
    nodes.append('circle')
      .attr('r', (d: DependencyNode) => d.size * 2)
      .attr('fill', (d: DependencyNode) => colorScale(d.type))
      .attr('stroke', '#fff')
      .attr('stroke-width', (d: DependencyNode) => selectedNode === d.id ? 3 : 1.5)
      .attr('stroke-opacity', (d: DependencyNode) => selectedNode === d.id ? 1 : 0.8);

    // Add node labels
    nodes.append('text')
      .text((d: DependencyNode) => d.name)
      .attr('dx', (d: DependencyNode) => d.size * 2 + 5)
      .attr('dy', 4)
      .attr('fill', '#E2E8F0')
      .attr('font-family', 'sans-serif')
      .attr('font-size', (d: DependencyNode) => d.size / 2 + 8)
      .attr('pointer-events', 'none');

    // Add type labels
    nodes.append('text')
      .text((d: DependencyNode) => d.type)
      .attr('dx', (d: DependencyNode) => d.size * 2 + 5)
      .attr('dy', 20)
      .attr('fill', '#A0AEC0')
      .attr('font-family', 'sans-serif')
      .attr('font-size', (d: DependencyNode) => d.size / 2 + 4)
      .attr('pointer-events', 'none');

    // Update positions on simulation tick
    simulation.on('tick', () => {
      links
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      nodes.attr('transform', (d: any) => `translate(${d.x}, ${d.y})`);
    });

    // Handle node dragging
    function dragstarted(event: d3.D3DragEvent<SVGGElement, DependencyNode, DependencyNode>, d: DependencyNode) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      (d as any).fx = (d as any).x;
      (d as any).fy = (d as any).y;
    }

    function dragged(event: d3.D3DragEvent<SVGGElement, DependencyNode, DependencyNode>, d: DependencyNode) {
      (d as any).fx = event.x;
      (d as any).fy = event.y;
    }

    function dragended(event: d3.D3DragEvent<SVGGElement, DependencyNode, DependencyNode>, d: DependencyNode) {
      if (!event.active) simulation.alphaTarget(0);
      (d as any).fx = null;
      (d as any).fy = null;
    }

    // Highlight related nodes and links when a node is selected
    if (selectedNode !== null && highlightMode !== 'none') {
      const node = graph.nodes.find(n => n.id === selectedNode);
      if (node) {
        const imports = new Set(node.imports);
        const exportedBy = new Set(
          graph.nodes
            .filter(n => n.imports.includes(node.id))
            .map(n => n.id)
        );
        
        // Dim all nodes and links first
        nodes.selectAll('circle')
          .attr('opacity', 0.3);
        nodes.selectAll('text')
          .attr('opacity', 0.3);
        links
          .attr('stroke-opacity', 0.1);
        
        // Then highlight the selected node and its related nodes/links
        nodes.filter((d: DependencyNode) => {
          if (d.id === selectedNode) return true;
          if (highlightMode === 'imports' || highlightMode === 'both') {
            if (imports.has(d.id)) return true;
          }
          if (highlightMode === 'exports' || highlightMode === 'both') {
            if (exportedBy.has(d.id)) return true;
          }
          return false;
        })
        .selectAll('circle, text')
        .attr('opacity', 1);
        
        links.filter((d: DependencyLink) => {
          if (highlightMode === 'imports' || highlightMode === 'both') {
            if (d.source === selectedNode && imports.has(d.target as string)) return true;
          }
          if (highlightMode === 'exports' || highlightMode === 'both') {
            if (d.target === selectedNode && exportedBy.has(d.source as string)) return true;
          }
          return false;
        })
        .attr('stroke-opacity', 1)
        .attr('stroke', (d: DependencyLink) => {
          if (d.source === selectedNode) return '#6366F1'; // Outgoing/import
          return '#8B5CF6'; // Incoming/export
        })
        .attr('stroke-width', 3);
      }
    }
  };

  const renderHierarchicalBundling = (g: d3.Selection<SVGGElement, unknown, null, undefined>, 
                                      svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
                                      colorScale: d3.ScaleOrdinal<string, string>) => {
    const radius = Math.min(width, height) / 2 - 80;
    
    // Prepare hierarchical data
    // Group nodes by type first (UI, Page, etc.)
    const nodesByType: { [key: string]: DependencyNode[] } = {};
    
    graph.nodes.forEach(node => {
      if (!nodesByType[node.type]) {
        nodesByType[node.type] = [];
      }
      nodesByType[node.type].push(node);
    });
    
    // Create a hierarchical structure
    const hierarchy = {
      name: "root",
      children: Object.keys(nodesByType).map(type => ({
        name: type,
        children: nodesByType[type].map(node => ({
          name: node.id,
          displayName: node.name,
          size: node.size,
          imports: node.imports,
          exports: node.exports,
          nodeData: node
        }))
      }))
    };

    // Create the cluster layout
    const cluster = d3.cluster<any>()
      .size([360, radius]);

    // Convert the nested data to a d3 hierarchy
    const root = d3.hierarchy(hierarchy);
    
    // Generate the cluster layout
    cluster(root);
    
    // Create a map of node id to node data for easy lookup
    const nodeById = new Map();
    root.descendants().forEach(node => {
      if (node.data.name !== 'root' && node.data.name !== node.parent?.data.name) {
        nodeById.set(node.data.name, node);
      }
    });
    
    // Create a line generator for the bundled edges
    const line = d3.lineRadial<[number, number]>()
      .curve(d3.curveBundle.beta(0.85))
      .radius(d => d[1])
      .angle(d => d[0] * Math.PI / 180);
    
    // Draw the nodes
    const nodes = g.append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`)
      .selectAll('.node')
      .data(root.descendants().filter(d => d.data.name !== 'root' && d.data.name !== d.parent?.data.name))
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', d => `rotate(${d.x - 90}) translate(${d.y},0)`)
      .on('mouseover', function(event, d) {
        highlightConnections(d, true);
      })
      .on('mouseout', function(event, d) {
        if (selectedNode === null) {
          highlightConnections(d, false);
        }
      })
      .on('click', function(event, d) {
        event.stopPropagation();
        if (d.data.name === selectedNode) {
          setSelectedNode(null);
          highlightConnections(d, false);
        } else {
          setSelectedNode(d.data.name);
          highlightConnections(d, true);
        }
      });
    
    // Add circles for nodes
    nodes.append('circle')
      .attr('r', d => d.data.size ? d.data.size : 5)
      .attr('fill', d => {
        if (d.parent?.data.name === hierarchy.name) return '#ccc';
        return colorScale(d.parent?.data.name || 'default');
      })
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5);
    
    // Add labels for nodes
    nodes.append('text')
      .attr('dy', '.31em')
      .attr('transform', d => d.x < 180 ? 'translate(8,0)' : 'rotate(180) translate(-8,0)')
      .attr('text-anchor', d => d.x < 180 ? 'start' : 'end')
      .attr('fill', '#E2E8F0')
      .text(d => d.data.displayName || d.data.name)
      .style('font-size', '10px');
    
    // Generate links
    const links: Array<{source: any, target: any}> = [];
    
    root.descendants().filter(d => d.data.name !== 'root' && d.data.name !== d.parent?.data.name).forEach(node => {
      if (node.data.imports && node.data.imports.length) {
        node.data.imports.forEach((importId: string) => {
          const targetNode = nodeById.get(importId);
          if (targetNode) {
            links.push({
              source: node,
              target: targetNode
            });
          }
        });
      }
    });
    
    // Draw the links
    const paths = g.append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`)
      .selectAll('.link')
      .data(links)
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('fill', 'none')
      .attr('stroke', '#aaa')
      .attr('stroke-opacity', 0.4)
      .attr('d', d => {
        const sourcePoint: [number, number] = [d.source.x, d.source.y];
        const targetPoint: [number, number] = [d.target.x, d.target.y];
        
        return line([
          [sourcePoint[0], sourcePoint[1]],
          [targetPoint[0], targetPoint[1]]
        ]);
      });
    
    // Function to highlight connections
    function highlightConnections(d: any, highlight: boolean) {
      // Find all import connections for this node
      const imports = d.data.imports || [];
      
      // Find all nodes that import this node
      const exportedTo = root.descendants().filter(node => 
        node.data.imports && node.data.imports.includes(d.data.name)
      ).map(node => node.data.name);
      
      // Highlight relevant paths based on highlight mode
      paths.attr('stroke-opacity', p => {
        if (!highlight) return 0.4;
        
        const sourceIsSelected = p.source.data.name === d.data.name;
        const targetIsSelected = p.target.data.name === d.data.name;
        
        if (highlightMode === 'imports' && sourceIsSelected) return 1;
        if (highlightMode === 'exports' && targetIsSelected) return 1;
        if (highlightMode === 'both' && (sourceIsSelected || targetIsSelected)) return 1;
        if (highlightMode === 'none' && (sourceIsSelected || targetIsSelected)) return 1;
        
        return 0.1;
      })
      .attr('stroke', p => {
        if (!highlight) return '#aaa';
        
        const sourceIsSelected = p.source.data.name === d.data.name;
        const targetIsSelected = p.target.data.name === d.data.name;
        
        if (sourceIsSelected) return '#6366F1'; // Outgoing/import
        if (targetIsSelected) return '#8B5CF6'; // Incoming/export
        
        return '#aaa';
      })
      .attr('stroke-width', p => {
        if (!highlight) return 1;
        
        const sourceIsSelected = p.source.data.name === d.data.name;
        const targetIsSelected = p.target.data.name === d.data.name;
        
        if (sourceIsSelected || targetIsSelected) return 2;
        
        return 1;
      });
      
      // Highlight relevant nodes
      nodes.attr('opacity', n => {
        if (!highlight) return 1;
        
        if (n.data.name === d.data.name) return 1;
        if (imports.includes(n.data.name)) return 1;
        if (exportedTo.includes(n.data.name)) return 1;
        
        return 0.3;
      });
    }
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center h-full ${className}`}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-t-blue-500 border-b-blue-700 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading dependency graph...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center h-full ${className}`}>
        <div className="text-center text-red-500">
          <p>Error: {error}</p>
          <button 
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div className="absolute top-2 right-2 z-10 bg-[#1A1A2E]/80 p-2 rounded text-xs text-white">
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
          Hierarchical
        </button>
      </div>
      <svg 
        ref={svgRef} 
        className="w-full h-full rounded-lg"
        style={{ minHeight: '500px' }}
      />
      {graph.nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-gray-400">No dependencies found</p>
        </div>
      )}
    </div>
  );
};

export default DependencyGraph;
