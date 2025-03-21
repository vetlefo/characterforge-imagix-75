
import React from 'react';
import Layout from "../components/Layout";
import DependencyVisualizer from "../components/dependency-visualizer/DependencyVisualizer";

const DependencyVisualizerPage: React.FC = () => {
  return (
    <Layout>
      <div className="p-6 md:p-8 bg-[#0F0F23] min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-white bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              Project Dependency Visualizer
            </h1>
            <p className="text-gray-400 mt-2">
              Visualize and explore the dependencies between files in your codebase.
            </p>
          </div>
          
          <DependencyVisualizer className="mb-8" />
          
          <div className="bg-[#0A0A1B]/70 backdrop-blur-md rounded-xl border border-[#2A2A4A]/30 p-6 mb-8">
            <h2 className="text-xl font-bold text-white mb-4">About the Visualizer</h2>
            <p className="text-gray-300 mb-4">
              This dependency visualizer helps you understand the relationships between different files in your codebase. 
              It's particularly useful for:
            </p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2 mb-4">
              <li>Understanding the structure of a new codebase</li>
              <li>Planning refactoring efforts</li>
              <li>Identifying tightly coupled components</li>
              <li>Visualizing the impact of changes</li>
              <li>Monitoring dependencies when working with AI agents</li>
            </ul>
            <p className="text-gray-300">
              The current implementation uses mock data for demonstration purposes. In a production environment, 
              it would be connected to an AST parser to extract real dependencies from your codebase.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DependencyVisualizerPage;
