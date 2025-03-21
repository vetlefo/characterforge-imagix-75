
import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { useDependency } from './DependencyContext';
import ForceDirectedGraph from './visualizations/ForceDirectedGraph';
import HierarchicalTreeGraph from './visualizations/HierarchicalTreeGraph';
import RadialDendogramGraph from './visualizations/RadialDendogramGraph';
import ViewTypeSelector from './visualizations/ViewTypeSelector';
import LoadingState from './visualizations/LoadingState';
import ErrorState from './visualizations/ErrorState';
import EmptyState from './visualizations/EmptyState';

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
    hierarchyData,
    loading, 
    error, 
    selectedNode, 
    setSelectedNode,
    highlightMode 
  } = useDependency();
  
  const svgRef = useRef<SVGSVGElement>(null);
  const [viewType, setViewType] = useState<'force' | 'hierarchical' | 'radial'>('hierarchical');

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

    // Render the appropriate visualization based on viewType
    if (viewType === 'force') {
      ForceDirectedGraph({
        nodes: graph.nodes,
        links: graph.links,
        width,
        height,
        colorScale,
        selectedNode,
        setSelectedNode,
        highlightMode,
        svg,
        g
      });
    } else if (viewType === 'hierarchical') {
      HierarchicalTreeGraph({
        hierarchyData,
        width,
        height,
        colorScale,
        selectedNode,
        setSelectedNode,
        g
      });
    } else if (viewType === 'radial') {
      RadialDendogramGraph({
        hierarchyData,
        width,
        height,
        colorScale,
        selectedNode,
        setSelectedNode,
        g
      });
    }

    return () => {
      // Cleanup
    };
  }, [graph, hierarchyData, loading, error, width, height, selectedNode, highlightMode, viewType]);

  if (loading) {
    return <LoadingState className={className} />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={() => window.location.reload()} className={className} />;
  }

  return (
    <div className={`relative ${className}`}>
      <ViewTypeSelector 
        viewType={viewType} 
        setViewType={setViewType} 
        className="absolute top-2 right-2 z-10" 
      />
      <svg 
        ref={svgRef} 
        className="w-full h-full rounded-lg"
        style={{ minHeight: '500px' }}
      />
      {graph.nodes.length === 0 && <EmptyState />}
    </div>
  );
};

export default DependencyGraph;
