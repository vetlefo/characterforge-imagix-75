
import React from 'react';
import * as d3 from 'd3';
import { HierarchyNode } from '../DependencyContext';

interface RadialDendogramGraphProps {
  hierarchyData: HierarchyNode;
  width: number;
  height: number;
  colorScale: d3.ScaleOrdinal<string, string>;
  selectedNode: string | null;
  setSelectedNode: (nodeId: string | null) => void;
  g: d3.Selection<SVGGElement, unknown, null, undefined>;
}

const RadialDendogramGraph: React.FC<RadialDendogramGraphProps> = ({
  hierarchyData,
  width,
  height,
  colorScale,
  selectedNode,
  setSelectedNode,
  g
}) => {
  const radius = Math.min(width, height) / 2 - 80;
  
  // Use d3.hierarchy to create a hierarchical layout
  const root = d3.hierarchy(hierarchyData);
  
  // Filter out the root node from visualization if it doesn't have meaningful data
  const hierarchyRoot = root.children ? root.children[0] : root;
  
  // Create the cluster layout
  const cluster = d3.cluster<any>()
    .size([360, radius]);
  
  // Apply the layout
  cluster(hierarchyRoot);
  
  // Create container and translate to center
  const container = g.append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2})`);
  
  // Add links between nodes
  container.selectAll(".link")
    .data(hierarchyRoot.links())
    .join("path")
    .attr("class", "link")
    .attr("d", d => {
      return `M${d.target.y * Math.cos((d.target.x - 90) * Math.PI / 180)},${d.target.y * Math.sin((d.target.x - 90) * Math.PI / 180)}
              C${(d.source.y + d.target.y) / 2 * Math.cos((d.target.x - 90) * Math.PI / 180)},${(d.source.y + d.target.y) / 2 * Math.sin((d.target.x - 90) * Math.PI / 180)}
               ${(d.source.y + d.target.y) / 2 * Math.cos((d.source.x - 90) * Math.PI / 180)},${(d.source.y + d.target.y) / 2 * Math.sin((d.source.x - 90) * Math.PI / 180)}
               ${d.source.y * Math.cos((d.source.x - 90) * Math.PI / 180)},${d.source.y * Math.sin((d.source.x - 90) * Math.PI / 180)}`;
    })
    .attr("fill", "none")
    .attr("stroke", "#4A4A6A")
    .attr("stroke-width", 1.5)
    .attr("stroke-opacity", 0.6);
  
  // Add nodes
  const nodes = container.selectAll(".node")
    .data(hierarchyRoot.descendants())
    .join("g")
    .attr("class", "node")
    .attr("transform", d => `rotate(${d.x - 90}) translate(${d.y},0)`)
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
    .attr("dy", "0.31em")
    .attr("x", d => d.x < 180 ? 10 : -10)
    .attr("text-anchor", d => d.x < 180 ? "start" : "end")
    .attr("transform", d => d.x < 180 ? null : "rotate(180)")
    .attr("fill", "#E2E8F0")
    .attr("font-size", "12px")
    .text(d => d.data.name);
  
  // Highlight selected node
  if (selectedNode) {
    nodes.filter(d => d.data.id === selectedNode)
      .select("circle")
      .attr("stroke", "#F6AD55")
      .attr("stroke-width", 3);
  }

  return null;
};

export default RadialDendogramGraph;
