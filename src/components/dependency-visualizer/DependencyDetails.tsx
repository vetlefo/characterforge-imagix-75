
import React from 'react';
import { useDependency, DependencyNode } from './DependencyContext';
import { Card } from '@/components/ui/card';
import { CodeIcon, LinkIcon, PackageIcon, FolderTreeIcon } from 'lucide-react';

interface DependencyDetailsProps {
  className?: string;
}

const DependencyDetails: React.FC<DependencyDetailsProps> = ({ className = '' }) => {
  const { graph, selectedNode, hierarchyData } = useDependency();
  
  if (!selectedNode) {
    return (
      <Card className={`p-4 bg-[#0F0F23]/80 border-[#2A2A4A]/30 ${className}`}>
        <div className="text-center text-sm text-gray-400 flex flex-col items-center">
          <FolderTreeIcon className="w-12 h-12 text-gray-500 mb-3 mt-8" />
          <p className="mb-2">Select a node to view details</p>
          <p className="text-xs text-gray-500 max-w-xs">
            Click on any node in the graph to see its dependencies and imports
          </p>
        </div>
      </Card>
    );
  }
  
  const node = graph.nodes.find(n => n.id === selectedNode);
  
  if (!node) {
    return (
      <Card className={`p-4 bg-[#0F0F23]/80 border-[#2A2A4A]/30 ${className}`}>
        <div className="text-center text-sm text-red-500">
          <p>Node not found</p>
        </div>
      </Card>
    );
  }
  
  // Find all nodes that import this node
  const importedBy = graph.nodes.filter(n => 
    n.imports.includes(node.id)
  );
  
  // Find the file path by splitting on common delimiters
  const parts = node.name.split(/[\/\\]/);
  const fileName = parts[parts.length - 1];
  const filePath = parts.length > 1 ? parts.slice(0, -1).join('/') : '';
  
  return (
    <Card className={`p-4 bg-[#0F0F23]/80 border-[#2A2A4A]/30 text-gray-200 ${className}`}>
      <div className="flex items-start gap-3 mb-4">
        <div className="p-2 rounded-md bg-blue-500/20">
          <CodeIcon className="text-blue-400" />
        </div>
        <div>
          <h3 className="text-lg font-medium">{fileName}</h3>
          {filePath && (
            <p className="text-xs text-gray-400">{filePath}</p>
          )}
          <div className="flex gap-2 mt-1">
            <span className="text-xs py-1 px-2 rounded-full bg-gray-700">{node.type}</span>
            <span className="text-xs py-1 px-2 rounded-full bg-blue-900/50">
              {node.imports.length} imports
            </span>
            <span className="text-xs py-1 px-2 rounded-full bg-purple-900/50">
              {importedBy.length} uses
            </span>
          </div>
        </div>
      </div>
      
      <div className="space-y-4 mt-6">
        {node.imports.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-indigo-400 mb-2 flex items-center gap-2">
              <LinkIcon size={14} />
              Imports ({node.imports.length})
            </h4>
            <ul className="space-y-1 pl-2 border-l-2 border-indigo-900/30">
              {node.imports.map(imp => {
                const importNode = graph.nodes.find(n => n.id === imp);
                return (
                  <li key={imp} className="text-sm flex items-center gap-2 p-1.5 hover:bg-indigo-900/20 rounded-r-md">
                    <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                    <span>{importNode?.name || imp}</span>
                    {importNode && (
                      <span className="text-xs text-gray-500 ml-auto">{importNode.type}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
        
        {importedBy.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-purple-400 mb-2 flex items-center gap-2">
              <PackageIcon size={14} />
              Imported By ({importedBy.length})
            </h4>
            <ul className="space-y-1 pl-2 border-l-2 border-purple-900/30">
              {importedBy.map(imp => (
                <li key={imp.id} className="text-sm flex items-center gap-2 p-1.5 hover:bg-purple-900/20 rounded-r-md">
                  <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                  <span>{imp.name}</span>
                  <span className="text-xs text-gray-500 ml-auto">{imp.type}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {node.imports.length === 0 && importedBy.length === 0 && (
          <div className="text-sm text-gray-400 p-4 bg-gray-800/20 rounded-md text-center">
            <p>No dependencies found for this file.</p>
            <p className="text-xs mt-1">This file neither imports nor is imported by other files.</p>
          </div>
        )}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-700/30">
        <h4 className="text-xs text-gray-400 mb-2">File Details</h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-gray-800/30 p-2 rounded">
            <span className="text-gray-500">Type:</span>
            <span className="ml-2 text-white">{node.type}</span>
          </div>
          <div className="bg-gray-800/30 p-2 rounded">
            <span className="text-gray-500">Size:</span>
            <span className="ml-2 text-white">{node.size} KB</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DependencyDetails;
