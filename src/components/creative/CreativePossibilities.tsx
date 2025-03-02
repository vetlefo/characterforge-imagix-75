
import React from "react";
import { Combine, Orbit, LightbulbIcon, Monitor } from "lucide-react";

interface CreativePossibilityProps { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
  isPro?: boolean;
}

const CreativePossibility = ({ icon, title, description, isPro = false }: CreativePossibilityProps) => (
  <div className="bg-[#1A1A2E]/40 backdrop-blur-sm rounded-xl p-5 flex items-center hover:bg-[#1A1A2E]/60 transition-all cursor-pointer group border border-transparent hover:border-blue-900/30">
    <div className="mr-4 p-3.5 rounded-full bg-[#2A2A4A]/50 text-blue-400 group-hover:text-blue-300 transition-colors">
      {icon}
    </div>
    <div className="flex-grow">
      <div className="flex items-center gap-2">
        <h3 className="font-medium text-white">{title}</h3>
        {isPro && (
          <span className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 text-blue-300 text-[10px] px-1.5 py-0.5 rounded-full font-medium backdrop-blur-sm">
            PRO
          </span>
        )}
      </div>
      <p className="text-sm text-gray-400 mt-1">{description}</p>
    </div>
  </div>
);

const CreativePossibilities = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <CreativePossibility 
        icon={<Combine size={22} />} 
        title="Transform" 
        description="Shape your creation into new forms"
      />
      <CreativePossibility 
        icon={<Orbit size={22} />} 
        title="Animate" 
        description="Breathe movement into your vision"
      />
      <CreativePossibility 
        icon={<LightbulbIcon size={22} />} 
        title="Expand" 
        description="Let your ideas grow beyond boundaries"
        isPro={true}
      />
      <CreativePossibility 
        icon={<Monitor size={22} />} 
        title="Preview" 
        description="Interactive website code previewer"
      />
    </div>
  );
};

export default CreativePossibilities;
