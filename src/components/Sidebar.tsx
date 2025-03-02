
import { useState } from "react";
import { 
  Sparkles, 
  Lightbulb, 
  Combine, 
  Layers, 
  Orbit, 
  Settings, 
  Home 
} from "lucide-react";
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
        ? "bg-blue-500/10 text-blue-400" 
        : "text-gray-400 hover:text-white hover:bg-[#1A1A2E]/30"
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
    <div className="w-20 bg-[#0A0A1B]/60 backdrop-blur-md border-r border-[#1A1A2E]/50 flex flex-col items-center py-6">
      {/* Logo */}
      <div className="mb-8">
        <div className="w-10 h-10 flex">
          <img src="/lovable-uploads/407e5ec8-9b67-42ee-acf0-b238e194aa64.png" alt="Logo" className="w-full" />
        </div>
      </div>
      
      {/* Main Navigation - Reimagined with conceptual icons */}
      <div className="space-y-1 w-full px-2">
        <SidebarItem 
          icon={<Home size={22} />} 
          label="Home" 
          active={activeItem === "Home"}
          onClick={() => setActiveItem("Home")}
        />
        <SidebarItem 
          icon={<Sparkles size={22} />} 
          label="Create" 
          active={activeItem === "Create"}
          onClick={() => setActiveItem("Create")}
        />
        <SidebarItem 
          icon={<Layers size={22} />} 
          label="Journey" 
          active={activeItem === "Journey"}
          onClick={() => setActiveItem("Journey")}
        />
        <SidebarItem 
          icon={<Lightbulb size={22} />} 
          label="Insight" 
          active={activeItem === "Insight"}
          onClick={() => setActiveItem("Insight")}
        />
        <SidebarItem 
          icon={<Orbit size={22} />} 
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
      <div className="mt-4 pt-4 border-t border-[#1A1A2E]/50 w-full flex justify-center">
        <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium cursor-pointer">
          U
        </div>
      </div>
    </div>
  );
};
