
import React from 'react';
import * as d3 from 'd3';
import { HierarchyNode } from '../DependencyContext';

interface HierarchicalTreeGraphProps {
  hierarchyData: HierarchyNode;
  width: number;
  height: number;
  colorScale: d3.ScaleOrdinal<string, string>;
  selectedNode: string | null;
  setSelectedNode: (nodeId: string | null) => void;
  g: d3.Selection<SVGGElement, unknown, null, undefined>;
}

const HierarchicalTreeGraph: React.FC<HierarchicalTreeGraphProps> = ({
  hierarchyData,
  width,
  height,
  colorScale,
  selectedNode,
  setSelectedNode,
  g
}) => {
  // Use d3.hierarchy to create a hierarchical layout
  const root = d3.hierarchy(hierarchyData);
  
  // Filter out the root node from visualization if it doesn't have meaningful data
  const hierarchyRoot = root.children ? root.children[0] : root;
  
  // Set up tree layout
  const treeLayout = d3.tree<any>()
    .size([height - 100, width - 200])
    .nodeSize([30, 200]);

  // Apply the layout
  treeLayout(hierarchyRoot);
  
  // Define a function to generate path data for links
  const linkGenerator = d3.linkHorizontal<any, any>()
    .x(d => d.y)  // Note: x and y are swapped to create a horizontal tree
    .y(d => d.x);
  
  // Create container and translate to provide some margin
  const container = g.append("g")
    .attr("transform", `translate(50, 50)`);
  
  // Add links
  container.selectAll(".link")
    .data(hierarchyRoot.links())
    .join("path")
    .attr("class", "link")
    .attr("d", linkGenerator)
    .attr("fill", "none")
    .attr("stroke", "#4A4A6A")
    .attr("stroke-width", 1.5)
    .attr("stroke-opacity", 0.6);
  
  // Add nodes
  const nodes = container.selectAll(".node")
    .data(hierarchyRoot.descendants())
    .join("g")
    .attr("class", "node")
    .attr("transform", d => `translate(${d.y},${d.x})`)
    .on("click", (event, d) => {
      event.stopPropagation();
      if (d.data.id) {
        setSelectedNode(selectedNode === d.data.id ? null : d.data.id);
      }
    });
  
  // Add node circles
  nodes.append("circle")
    .attr("r", d => d.data.size ? Math.max(d.data.size * 1.5, 5) : 5)
    .attr("fill", d => d.data.type ? colorScale(d.data.type) : "#4A4A6A")
    .attr("stroke", "#fff")
    .attr("stroke-width", d => selectedNode === d.data.id ? 3 : 1.5);
  
  // Add node labels
  nodes.append("text")
    .attr("dy", 4)
    .attr("x", d => d.children ? -10 : 10)
    .attr("text-anchor", d => d.children ? "end" : "start")
    .attr("fill", "#E2E8F0")
    .attr("font-size", "12px")
    .text(d => d.data.name);
  
  // Add type labels
  nodes.filter(d => d.data.type)
    .append("text")
    .attr("dy", 20)
    .attr("x", d => d.children ? -10 : 10)
    .attr("text-anchor", d => d.children ? "end" : "start")
    .attr("fill", "#A0AEC0")
    .attr("font-size", "10px")
    .text(d => d.data.type);
  
  // Highlight selected node
  if (selectedNode) {
    nodes.filter(d => d.data.id === selectedNode)
      .select("circle")
      .attr("stroke", "#F6AD55")
      .attr("stroke-width", 3);
  }

  return null;
};

export default HierarchicalTreeGraph;
