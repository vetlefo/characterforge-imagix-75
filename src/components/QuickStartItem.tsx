
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Paintbrush, Images, Palette, Wand2, Globe, Film, 
  FileCode, PanelRight, Code, Workflow, Network 
} from 'lucide-react';
import { Card } from './ui/card';

interface QuickStartItemProps {
  title: string;
  description: string;
  icon: string;
  link: string;
  isNew?: boolean;
}

const iconMap: Record<string, React.ReactNode> = {
  'Paintbrush': <Paintbrush className="h-6 w-6" />,
  'Images': <Images className="h-6 w-6" />,
  'Palette': <Palette className="h-6 w-6" />,
  'Wand2': <Wand2 className="h-6 w-6" />,
  'Globe': <Globe className="h-6 w-6" />,
  'Film': <Film className="h-6 w-6" />,
  'FileCode': <FileCode className="h-6 w-6" />,
  'PanelRight': <PanelRight className="h-6 w-6" />,
  'Code': <Code className="h-6 w-6" />,
  'Workflow': <Workflow className="h-6 w-6" />,
  'Network': <Network className="h-6 w-6" />,
};

const QuickStartItem: React.FC<QuickStartItemProps> = ({ title, description, icon, link, isNew = false }) => {
  return (
    <Link to={link}>
      <Card className="p-6 bg-[#0A0A1B]/80 border-[#2A2A4A]/30 hover:bg-[#0A0A1B] transition-colors relative h-full flex flex-col">
        <div className="mb-4 text-blue-400">{iconMap[icon]}</div>
        <h3 className="text-xl font-medium text-white mb-2 flex items-center gap-2">
          {title}
          {isNew && (
            <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-blue-900/50 text-blue-300">
              New
            </span>
          )}
        </h3>
        <p className="text-gray-400 flex-grow">{description}</p>
      </Card>
    </Link>
  );
};

export default QuickStartItem;
