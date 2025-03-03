
import { useState } from "react";
import DrawingModule from "../draw/DrawingModule";
import { Button } from "../ui/button";
import { Layers, Wand2 } from "lucide-react";
import { useCreative } from "./CreativeContext";
import MediaTransform from "./MediaTransform/MediaTransform";

interface CreativeSpaceProps {
  children?: React.ReactNode;
  lastImage?: string | null;
  onDrawingComplete?: (dataUrl: string) => void;
}

const CreativeSpace = ({ children, lastImage, onDrawingComplete }: CreativeSpaceProps) => {
  const { 
    activeDrawing, 
    setActiveDrawing, 
    currentIntent,
    suggestionsVisible,
    setSuggestionsVisible,
    addAsset
  } = useCreative();
  
  const [showMediaTransform, setShowMediaTransform] = useState(false);

  // Handle drawing completion with context awareness
  const handleDrawingComplete = (dataUrl: string) => {
    // Add the drawing as an asset in our context
    const newAsset = addAsset("image", dataUrl, 
      currentIntent ? [currentIntent] : [], 
      { createdVia: "drawing" }
    );
    
    // Call the parent handler
    if (onDrawingComplete) {
      onDrawingComplete(dataUrl);
    }
    setActiveDrawing(false);
    
    // Trigger suggestion when drawing is complete
    if (currentIntent) {
      setTimeout(() => {
        setSuggestionsVisible(true);
      }, 1000);
    }
    
    // Show media transform options after drawing is complete
    setShowMediaTransform(true);
  };

  // Start drawing mode
  const handleStartDrawing = () => {
    setActiveDrawing(true);
  };

  if (children) {
    return <div className="creative-space-container">{children}</div>;
  }

  return (
    <div className="col-span-3 md:col-span-2 relative">
      {lastImage ? (
        <div className="aspect-video rounded-xl overflow-hidden flex items-center justify-center relative group">
          <img src={lastImage} alt="Your creation" className="max-w-full max-h-full" />
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="flex gap-2">
              <DrawingModule 
                onDrawingComplete={handleDrawingComplete} 
                triggerLabel="Continue Creating"
                initialImage={lastImage}
              />
              <Button 
                variant="outline" 
                className="border-white/20 text-white bg-black/30 backdrop-blur-sm gap-2"
                onClick={() => setShowMediaTransform(!showMediaTransform)}
              >
                <Wand2 size={16} />
                Transform Media
              </Button>
              <Button variant="outline" className="border-white/20 text-white bg-black/30 backdrop-blur-sm">
                Export
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="aspect-video rounded-xl flex items-center justify-center group hover:bg-[#1A1A2E]/20 transition-colors relative">
          {/* Subtle nascent form elements in the background */}
          <div className="absolute inset-0 overflow-hidden rounded-xl">
            <svg width="100%" height="100%" className="opacity-10">
              <defs>
                <linearGradient id="flow-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0.3" />
                </linearGradient>
              </defs>
              <path d="M0,50 Q250,150 500,50 T1000,50" stroke="url(#flow-gradient)" strokeWidth="1" fill="none" className="animate-pulse-slow" />
              <circle cx="30%" cy="40%" r="100" fill="#4F46E5" fillOpacity="0.05" />
              <circle cx="70%" cy="60%" r="120" fill="#0EA5E9" fillOpacity="0.05" />
            </svg>
          </div>
          
          <div className="text-center p-6 z-10">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-blue-500/30 flex items-center justify-center mx-auto mb-4 group-hover:border-blue-400/50 transition-colors">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/10 rounded-full animate-ping opacity-50"></div>
                <svg width="28" height="28" viewBox="0 0 24 24" className="text-blue-400 group-hover:text-blue-300 transition-colors">
                  <path fill="currentColor" d="M7 2c-1.3 0-2.4.8-2.8 2L3 7l5 1L8 3 7 2zm10 0l-1 1v5l5-1-1.2-3c-.4-1.2-1.5-2-2.8-2zM3 8v3c0 4.9 3.5 9.1 8 9.9V20H9v2h6v-2h-2v-.1c4.5-.8 8-5 8-9.9V8H3zm8 14c-5 0-9-4-9-9v-3h18v3c0 5-4 9-9 9z"/>
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-medium text-white mb-2">Begin your creative journey</h3>
            <p className="text-gray-400 mb-6 max-w-md">The canvas awaits your intention</p>
            <div className="flex gap-3 justify-center">
              <DrawingModule 
                onDrawingComplete={handleDrawingComplete} 
                triggerLabel="Start Creating"
              />
              <Button variant="outline" className="gap-2 bg-[#1A1A2E]/40 border-[#2A2A4A]/50 backdrop-blur-sm">
                <Layers size={16} className="text-blue-400" />
                Import Inspiration
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Media transformation panel */}
      {showMediaTransform && lastImage && (
        <div className="mt-4">
          <MediaTransform imageUrl={lastImage} />
        </div>
      )}
    </div>
  );
};

export default CreativeSpace;
