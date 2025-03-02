
import { ReactNode } from "react";
import CreativeSpace from "./CreativeSpace";
import CreativePartner from "./CreativePartner";
import { CreativeProvider } from "./CreativeContext";
import ConversationDemo from "./ConversationDemo";
import ConversationHistoryDemo from "./ConversationHistoryDemo";
import { useCreative } from "./CreativeContext";

interface CreativeWorkspaceProps {
  lastImage: string | null;
  onDrawingComplete: (dataUrl: string) => void;
  assistantMessage: string;
  showAssistantSuggestion: boolean;
}

// This is a wrapped version that doesn't include the provider
// so we can use the context inside the component
const CreativeWorkspaceContent = ({ 
  lastImage, 
  onDrawingComplete, 
  assistantMessage, 
  showAssistantSuggestion 
}: CreativeWorkspaceProps) => {
  const { getAssetsByType } = useCreative();
  
  // Get the most recent assets for display
  const recentImages = getAssetsByType("image").slice(0, 5);
  
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
          
          {/* Conversation history section */}
          <ConversationHistoryDemo />
          
          {/* Original conversation demo */}
          <div className="mt-8 mb-4">
            <h3 className="text-xl font-medium text-white mb-4">Live Conversation</h3>
            <ConversationDemo />
          </div>
          
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
          
          {/* Recent assets section */}
          {recentImages.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-medium text-white mb-4">Recent Creations</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {recentImages.map((asset) => (
                  <div key={asset.id} className="relative aspect-square rounded-lg overflow-hidden border border-[#2A2A4A]/30 group">
                    <img 
                      src={asset.content} 
                      alt="Creative asset" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="text-white text-xs">{new Date(asset.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// The wrapper component that includes the provider
const CreativeWorkspace = (props: CreativeWorkspaceProps) => {
  return (
    <CreativeProvider>
      <CreativeWorkspaceContent {...props} />
    </CreativeProvider>
  );
};

export default CreativeWorkspace;
