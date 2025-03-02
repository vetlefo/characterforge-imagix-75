
import { useState } from "react";
import { Button } from "../ui/button";
import { Sparkles } from "lucide-react";

interface CreativePartnerProps {
  assistantMessage: string;
  showSuggestion: boolean;
}

const CreativePartner = ({ assistantMessage, showSuggestion }: CreativePartnerProps) => {
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <div className="col-span-3 md:col-span-1 transition-all duration-300">
      <div className={`h-full bg-[#1A1A2E]/40 backdrop-blur-sm rounded-xl border border-[#2A2A4A]/30 flex flex-col transition-all ${isMinimized ? 'p-3' : 'p-5'}`}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium text-white flex items-center gap-2">
            <Sparkles size={18} className="text-blue-400" />
            Creative Partner
          </h3>
          <Button 
            variant="ghost" 
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            {isMinimized ? '+' : '−'}
          </Button>
        </div>
        
        {!isMinimized && (
          <>
            <div className="flex-grow mb-4">
              {showSuggestion ? (
                <div className="p-3 rounded-lg bg-[#2A2A4A]/50 backdrop-blur-sm text-sm text-gray-300 border border-blue-900/30">
                  {assistantMessage}
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" variant="default" className="bg-blue-600/80 hover:bg-blue-600 text-xs backdrop-blur-sm">Yes, let's continue</Button>
                    <Button size="sm" variant="outline" className="text-xs bg-transparent border-white/10">Explore something new</Button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400 text-sm">Share your creative intention...</p>
              )}
            </div>
            
            <div className="relative">
              <input 
                type="text" 
                placeholder="What are you imagining?"
                className="w-full bg-[#252547]/50 backdrop-blur-sm border border-[#3A3A5A]/50 rounded-lg py-2 pl-3 pr-10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
              />
              <Button size="sm" className="absolute right-1 top-1 h-7 w-7 p-0 bg-blue-600/80 hover:bg-blue-600">
                <Sparkles size={14} />
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CreativePartner;
