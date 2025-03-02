
import { useEffect, useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { Button } from "../components/ui/button";
import { Sparkles, HelpCircleIcon } from "lucide-react";
import CreativeWorkspace from "../components/creative/CreativeWorkspace";
import CreativePossibilities from "../components/creative/CreativePossibilities";
import InspirationalEchoes from "../components/creative/InspirationalEchoes";

const Index = () => {
  const [lastImage, setLastImage] = useState<string | null>(null);
  const [assistantMessage, setAssistantMessage] = useState<string>("What would you like to create today?");
  const [showAssistantSuggestion, setShowAssistantSuggestion] = useState<boolean>(false);

  useEffect(() => {
    // Initialize any necessary startup checks
    const checkForPreviousWork = async () => {
      try {
        // This would normally check local storage or API for recent user work
        const hasRecentWork = Math.random() > 0.5; // Simulating a check
        
        if (hasRecentWork) {
          setTimeout(() => {
            setShowAssistantSuggestion(true);
            setAssistantMessage("I notice your creative energy aligns with fluid landscapes. Would you like to continue this exploration?");
          }, 3000);
        }
      } catch (error) {
        console.log('Error checking for previous work:', error);
      }
    };
    
    checkForPreviousWork();
  }, []);

  const handleDrawingComplete = (dataUrl: string) => {
    setLastImage(dataUrl);
    // In a real app, we would save this to the user's history or projects
    
    // Show a relevant suggestion after drawing is complete
    setTimeout(() => {
      setShowAssistantSuggestion(true);
      setAssistantMessage("Your creation has beautiful organic elements. Would you like to explore similar textures or try a different direction?");
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0F0F23]">
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <main className="flex-1 overflow-auto">
            <div className="max-w-6xl mx-auto px-6 py-8">
              {/* Project Header */}
              <div className="mb-8 flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">Untitled Project</h1>
                <div className="flex gap-3">
                  <Button variant="outline" className="gap-2 bg-[#1A1A2E]/30 border-[#2A2A4A]/50 backdrop-blur-sm">
                    <HelpCircleIcon size={18} />
                    Help
                  </Button>
                  <Button className="bg-gradient-to-r from-blue-600/80 to-purple-600/80 hover:from-blue-600 hover:to-purple-600 gap-2 backdrop-blur-sm border border-purple-500/20">
                    <Sparkles size={18} />
                    Upgrade to Pro
                  </Button>
                </div>
              </div>

              {/* Main Creation Area */}
              <CreativeWorkspace 
                lastImage={lastImage}
                onDrawingComplete={handleDrawingComplete}
                assistantMessage={assistantMessage}
                showAssistantSuggestion={showAssistantSuggestion}
              />

              {/* Creative Possibilities */}
              <div className="mb-10">
                <CreativePossibilities />
              </div>

              {/* Inspirational Echoes */}
              <InspirationalEchoes />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Index;
