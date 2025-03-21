
import React from 'react';
import { useDependency, DependencyNode } from './DependencyContext';
import { Card } from '@/components/ui/card';
import { CodeIcon, LinkIcon, PackageIcon } from 'lucide-react';

interface DependencyDetailsProps {
  className?: string;
}

const DependencyDetails: React.FC<DependencyDetailsProps> = ({ className = '' }) => {
  const { graph, selectedNode } = useDependency();
  
  if (!selectedNode) {
    return (
      <Card className={`p-4 bg-[#0F0F23]/80 border-[#2A2A4A]/30 ${className}`}>
        <div className="text-center text-sm text-gray-400">
          <p>Select a node to view details</p>
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
  
  return (
    <Card className={`p-4 bg-[#0F0F23]/80 border-[#2A2A4A]/30 text-gray-200 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <CodeIcon className="text-blue-400" />
        <h3 className="text-lg font-medium">{node.name}</h3>
        <span className="text-xs py-1 px-2 rounded-full bg-gray-700">{node.type}</span>
      </div>
      
      <div className="space-y-4">
        {node.imports.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-indigo-400 mb-2 flex items-center gap-2">
              <LinkIcon size={14} />
              Imports ({node.imports.length})
            </h4>
            <ul className="space-y-1 pl-5">
              {node.imports.map(imp => {
                const importNode = graph.nodes.find(n => n.id === imp);
                return (
                  <li key={imp} className="text-sm flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                    <span>{importNode?.name || imp}</span>
                    <span className="text-xs text-gray-500">{importNode?.type}</span>
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
            <ul className="space-y-1 pl-5">
              {importedBy.map(imp => (
                <li key={imp.id} className="text-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                  <span>{imp.name}</span>
                  <span className="text-xs text-gray-500">{imp.type}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {node.imports.length === 0 && importedBy.length === 0 && (
          <div className="text-sm text-gray-400">
            No dependencies found for this file.
          </div>
        )}
      </div>
    </Card>
  );
};

export default DependencyDetails;
