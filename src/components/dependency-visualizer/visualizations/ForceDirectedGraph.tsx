
import React from 'react';
import * as d3 from 'd3';
import { DependencyLink, DependencyNode } from '../DependencyContext';

interface ForceDirectedGraphProps {
  nodes: DependencyNode[];
  links: DependencyLink[];
  width: number;
  height: number;
  colorScale: d3.ScaleOrdinal<string, string>;
  selectedNode: string | null;
  setSelectedNode: (nodeId: string | null) => void;
  highlightMode: 'none' | 'imports' | 'exports' | 'both';
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;
  g: d3.Selection<SVGGElement, unknown, null, undefined>;
}

const ForceDirectedGraph: React.FC<ForceDirectedGraphProps> = ({
  nodes,
  links,
  width,
  height,
  colorScale,
  selectedNode,
  setSelectedNode,
  highlightMode,
  svg,
  g
}) => {
  // Create the force simulation
  const simulation = d3.forceSimulation(nodes as d3.SimulationNodeDatum[])
    .force('link', d3.forceLink(links)
      .id((d: any) => d.id)
      .distance(100)
    )
    .force('charge', d3.forceManyBody().strength(-300))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('collision', d3.forceCollide().radius((d: any) => d.size * 2 + 10));

  // Draw links
  const linkElements = g.append('g')
    .attr('class', 'links')
    .selectAll('line')
    .data(links)
    .enter()
    .append('line')
    .attr('stroke-width', (d: DependencyLink) => Math.sqrt(d.strength) * 2)
    .attr('stroke', '#4A4A6A')
    .attr('stroke-opacity', 0.6)
    .attr('marker-end', (d: DependencyLink) => `url(#arrow-${d.type})`);

  // Draw nodes
  const nodeElements = g.append('g')
    .attr('class', 'nodes')
    .selectAll('circle')
    .data(nodes)
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
  nodeElements.append('circle')
    .attr('r', (d: DependencyNode) => d.size * 2)
    .attr('fill', (d: DependencyNode) => colorScale(d.type))
    .attr('stroke', '#fff')
    .attr('stroke-width', (d: DependencyNode) => selectedNode === d.id ? 3 : 1.5)
    .attr('stroke-opacity', (d: DependencyNode) => selectedNode === d.id ? 1 : 0.8);

  // Add node labels
  nodeElements.append('text')
    .text((d: DependencyNode) => d.name)
    .attr('dx', (d: DependencyNode) => d.size * 2 + 5)
    .attr('dy', 4)
    .attr('fill', '#E2E8F0')
    .attr('font-family', 'sans-serif')
    .attr('font-size', (d: DependencyNode) => d.size / 2 + 8)
    .attr('pointer-events', 'none');

  // Add type labels
  nodeElements.append('text')
    .text((d: DependencyNode) => d.type)
    .attr('dx', (d: DependencyNode) => d.size * 2 + 5)
    .attr('dy', 20)
    .attr('fill', '#A0AEC0')
    .attr('font-family', 'sans-serif')
    .attr('font-size', (d: DependencyNode) => d.size / 2 + 4)
    .attr('pointer-events', 'none');

  // Update positions on simulation tick
  simulation.on('tick', () => {
    linkElements
      .attr('x1', (d: any) => d.source.x)
      .attr('y1', (d: any) => d.source.y)
      .attr('x2', (d: any) => d.target.x)
      .attr('y2', (d: any) => d.target.y);

    nodeElements.attr('transform', (d: any) => `translate(${d.x}, ${d.y})`);
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
    const node = nodes.find(n => n.id === selectedNode);
    if (node) {
      const imports = new Set(node.imports);
      const exportedBy = new Set(
        nodes
          .filter(n => n.imports.includes(node.id))
          .map(n => n.id)
      );
      
      // Dim all nodes and links first
      nodeElements.selectAll('circle')
        .attr('opacity', 0.3);
      nodeElements.selectAll('text')
        .attr('opacity', 0.3);
      linkElements
        .attr('stroke-opacity', 0.1);
      
      // Then highlight the selected node and its related nodes/links
      nodeElements.filter((d: DependencyNode) => {
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
      
      linkElements.filter((d: DependencyLink) => {
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

  return null;
};

export default ForceDirectedGraph;
