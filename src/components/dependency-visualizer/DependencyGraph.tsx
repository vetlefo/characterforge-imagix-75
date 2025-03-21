
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
  const [simulation, setSimulation] = useState<d3.Simulation<d3.SimulationNodeDatum, undefined> | null>(null);

  // Color scale for node types
  const colorScale = d3.scaleOrdinal()
    .domain(['UI', 'Page', 'Hook', 'Context', 'Util', 'Service'])
    .range(['#4299E1', '#F56565', '#68D391', '#9F7AEA', '#F6E05E', '#ED8936']);

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

    // Create the force simulation
    const sim = d3.forceSimulation(graph.nodes as d3.SimulationNodeDatum[])
      .force('link', d3.forceLink(graph.links)
        .id((d: any) => d.id)
        .distance(100)
      )
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius((d: any) => d.size * 2 + 10));

    setSimulation(sim);

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
      .attr('fill', (d: DependencyNode) => colorScale(d.type) as string)
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
    sim.on('tick', () => {
      links
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      nodes.attr('transform', (d: any) => `translate(${d.x}, ${d.y})`);
    });

    // Handle node dragging
    function dragstarted(event: d3.D3DragEvent<SVGGElement, DependencyNode, DependencyNode>, d: DependencyNode) {
      if (!event.active) sim.alphaTarget(0.3).restart();
      (d as any).fx = (d as any).x;
      (d as any).fy = (d as any).y;
    }

    function dragged(event: d3.D3DragEvent<SVGGElement, DependencyNode, DependencyNode>, d: DependencyNode) {
      (d as any).fx = event.x;
      (d as any).fy = event.y;
    }

    function dragended(event: d3.D3DragEvent<SVGGElement, DependencyNode, DependencyNode>, d: DependencyNode) {
      if (!event.active) sim.alphaTarget(0);
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

    return () => {
      // Cleanup: stop simulation when component unmounts
      if (sim) sim.stop();
    };
  }, [graph, loading, error, width, height, selectedNode, highlightMode, colorScale]);

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
