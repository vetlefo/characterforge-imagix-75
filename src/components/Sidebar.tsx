
import { useState } from "react";
import { PlusCircle, FolderOpen, BookOpen, Compass, Settings, LogOut, Home } from "lucide-react";
import { cn } from "@/lib/utils";

const SidebarItem = ({ 
  icon, 
  label, 
  active = false,
  onClick
}: { 
  icon: React.ReactNode; 
  label: string; 
  active?: boolean;
  onClick?: () => void;
}) => (
  <button
    className={cn(
      "w-full flex flex-col items-center justify-center p-3 rounded-xl transition-all", 
      active 
        ? "bg-[#2A2A4A] text-blue-400" 
        : "text-gray-400 hover:text-white hover:bg-[#1A1A2E]"
    )}
    onClick={onClick}
  >
    <div className="mb-1">{icon}</div>
    <span className="text-xs font-medium">{label}</span>
  </button>
);

export const Sidebar = () => {
  const [activeItem, setActiveItem] = useState("Home");

  return (
    <div className="w-20 bg-[#0A0A1B] border-r border-[#1A1A2E] flex flex-col items-center py-6">
      {/* Logo */}
      <div className="mb-8">
        <div className="w-10 h-10 flex">
          <img src="/lovable-uploads/407e5ec8-9b67-42ee-acf0-b238e194aa64.png" alt="Logo" className="w-full" />
        </div>
      </div>
      
      {/* Main Navigation */}
      <div className="space-y-1 w-full px-2">
        <SidebarItem 
          icon={<Home size={22} />} 
          label="Home" 
          active={activeItem === "Home"}
          onClick={() => setActiveItem("Home")}
        />
        <SidebarItem 
          icon={<PlusCircle size={22} />} 
          label="Create" 
          active={activeItem === "Create"}
          onClick={() => setActiveItem("Create")}
        />
        <SidebarItem 
          icon={<FolderOpen size={22} />} 
          label="Projects" 
          active={activeItem === "Projects"}
          onClick={() => setActiveItem("Projects")}
        />
        <SidebarItem 
          icon={<BookOpen size={22} />} 
          label="Library" 
          active={activeItem === "Library"}
          onClick={() => setActiveItem("Library")}
        />
        <SidebarItem 
          icon={<Compass size={22} />} 
          label="Explore" 
          active={activeItem === "Explore"}
          onClick={() => setActiveItem("Explore")}
        />
      </div>
      
      {/* Bottom Navigation */}
      <div className="mt-auto space-y-1 w-full px-2">
        <SidebarItem 
          icon={<Settings size={22} />} 
          label="Settings" 
          active={activeItem === "Settings"}
          onClick={() => setActiveItem("Settings")}
        />
      </div>
      
      {/* User */}
      <div className="mt-4 pt-4 border-t border-[#1A1A2E] w-full flex justify-center">
        <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium cursor-pointer">
          U
        </div>
      </div>
    </div>
  );
};
