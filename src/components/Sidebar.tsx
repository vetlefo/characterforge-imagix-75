
import { useState } from "react";
import { ChevronRight, HomeIcon, Users, Video, Image, Edit, Palette, Grid, Apps, Rss, Code, ChevronDown, BookOpen, HelpCircle, Sparkles, Palette as ThemeIcon, Newspaper } from "lucide-react";

type SidebarItemProps = {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  isNew?: boolean;
  hasDropdown?: boolean;
  onClick?: () => void;
};

const SidebarItem = ({ icon, label, isActive = false, isNew = false, hasDropdown = false, onClick }: SidebarItemProps) => (
  <button 
    className={`w-full flex items-center gap-3 p-3 rounded-md transition-colors ${isActive ? 'bg-accent' : 'hover:bg-accent'}`}
    onClick={onClick}
  >
    <div className="text-gray-300">{icon}</div>
    <span className="text-white text-sm font-medium flex-1 text-left">{label}</span>
    {isNew && (
      <span className="bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">
        NEW
      </span>
    )}
    {hasDropdown && <ChevronDown size={16} className="text-gray-500" />}
  </button>
);

const DropdownItem = ({ icon, label, isExternal = false }: { icon: React.ReactNode; label: string; isExternal?: boolean }) => (
  <div className="flex items-center gap-3 p-3 pl-12 hover:bg-accent rounded-md transition-colors cursor-pointer">
    <div className="text-gray-300">{icon}</div>
    <span className="text-white text-sm">{label}</span>
    {isExternal && <span className="ml-2 px-1 bg-muted rounded-sm text-[10px]">↗</span>}
  </div>
);

export const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);

  if (isCollapsed) {
    return (
      <div className="w-16 bg-sidebar min-h-screen flex flex-col items-center py-4 border-r border-gray-800">
        <div className="mb-8">
          <img src="/logo.svg" alt="Logo" className="w-8 h-8" />
        </div>
        <button
          onClick={() => setIsCollapsed(false)}
          className="absolute left-16 top-1/2 -translate-y-1/2 bg-gray-800 rounded-full p-1 text-white hover:bg-gray-700 transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    );
  }

  return (
    <div className="w-[232px] bg-sidebar min-h-screen flex flex-col border-r border-gray-800">
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <img src="/logo.svg" alt="Logo" className="w-8 h-8" />
          <span className="text-white font-semibold">OpenArt</span>
        </div>
        <button
          onClick={() => setIsCollapsed(true)}
          className="text-gray-400 hover:text-white transition-colors p-1 rounded-md hover:bg-gray-800"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="py-2 px-3 flex flex-col gap-1">
        <SidebarItem icon={<HomeIcon size={20} />} label="Home" />
        <SidebarItem icon={<Users size={20} />} label="Characters" isNew />
        <SidebarItem icon={<Video size={20} />} label="Videos" />
        <SidebarItem icon={<Image size={20} />} label="Create Image" />
        <SidebarItem icon={<Edit size={20} />} label="Edit Image" />
        <SidebarItem icon={<Palette size={20} />} label="Style Palettes" />
        <SidebarItem icon={<Grid size={20} />} label="Models" />
        <SidebarItem icon={<Apps size={20} />} label="Apps" />
        <SidebarItem icon={<Rss size={20} />} label="Community Feed" />
        <SidebarItem icon={<Code size={20} />} label="ComfyUI Workflows" />
      </div>

      <div className="flex-grow overflow-auto">
        <div className="py-2 px-3">
          <div className="flex items-center gap-3 p-3 text-gray-300 hover:bg-accent rounded-md transition-colors cursor-pointer">
            <ChevronRight size={16} />
            <span className="text-white text-sm">My stuff</span>
          </div>
        </div>

        <div className="py-2 px-3">
          <SidebarItem 
            icon={<ChevronDown size={16} />} 
            label="Resources" 
            hasDropdown 
            onClick={() => setResourcesOpen(!resourcesOpen)} 
          />
          
          {resourcesOpen && (
            <div className="mt-1 space-y-1 animate-fade-in">
              <DropdownItem icon={<BookOpen size={16} />} label="Tutorials" />
              <DropdownItem icon={<HelpCircle size={16} />} label="Wiki" isExternal />
              <DropdownItem icon={<HelpCircle size={16} />} label="Help Center" />
              <DropdownItem icon={<Sparkles size={16} />} label="What's New" />
              <DropdownItem icon={<ThemeIcon size={16} />} label="Theme Gallery" />
              <DropdownItem icon={<Newspaper size={16} />} label="Blog" isExternal />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
