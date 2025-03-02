
import { ReactNode } from "react";
import CreativeSpace from "./CreativeSpace";
import CreativePartner from "./CreativePartner";

interface CreativeWorkspaceProps {
  lastImage: string | null;
  onDrawingComplete: (dataUrl: string) => void;
  assistantMessage: string;
  showAssistantSuggestion: boolean;
}

const CreativeWorkspace = ({ 
  lastImage, 
  onDrawingComplete, 
  assistantMessage, 
  showAssistantSuggestion 
}: CreativeWorkspaceProps) => {
  return (
    <div className="mb-10 relative">
      <div className="bg-[#0A0A1B]/70 backdrop-blur-md rounded-2xl p-6 border border-[#2A2A4A]/30 overflow-hidden">
        {/* Ambient ethereal background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-full h-full opacity-20">
            <div className="absolute top-1/4 -left-10 w-72 h-72 bg-blue-600/20 rounded-full filter blur-[80px] animate-pulse-slow"></div>
            <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-purple-600/20 rounded-full filter blur-[100px] animate-pulse-slow" style={{animationDelay: '1s'}}></div>
            <div className="absolute top-1/4 right-1/4 w-60 h-60 bg-indigo-600/20 rounded-full filter blur-[70px] animate-pulse-slow" style={{animationDelay: '2s'}}></div>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          <h2 className="text-2xl font-medium text-white mb-4">What would you like to create today?</h2>
          
          {/* Fluid workspace area */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <CreativeSpace 
              lastImage={lastImage} 
              onDrawingComplete={onDrawingComplete} 
            />
            
            <CreativePartner 
              assistantMessage={assistantMessage}
              showSuggestion={showAssistantSuggestion}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreativeWorkspace;
