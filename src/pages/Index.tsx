
import { useEffect, useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { Button } from "../components/ui/button";
import { 
  Sparkles, 
  HelpCircleIcon, 
  Layers, 
  Orbit, 
  Lightbulb, 
  Combine
} from "lucide-react";
import DrawingModule from "../components/draw/DrawingModule";
import { Link } from "react-router-dom";

const Index = () => {
  const [lastImage, setLastImage] = useState<string | null>(null);
  const [assistantMessage, setAssistantMessage] = useState<string>("What would you like to create today?");
  const [showAssistantSuggestion, setShowAssistantSuggestion] = useState<boolean>(false);
  const [isAssistantMinimized, setIsAssistantMinimized] = useState<boolean>(false);

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
  };

  // Refined from isolated "actions" to conceptual creative possibilities
  const CreativePossibility = ({ icon, title, description, isPro = false }: { 
    icon: React.ReactNode, 
    title: string, 
    description: string,
    isPro?: boolean
  }) => (
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

  const InspirationItem = ({ src }: { src: string }) => (
    <div className="rounded-lg overflow-hidden aspect-square relative group">
      <img src={src} alt="Inspiration" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3">
        <span className="text-white text-sm font-medium">AI Generated</span>
        <Button variant="outline" size="sm" className="bg-black/50 border-white/30 text-white">
          Use
        </Button>
      </div>
    </div>
  );

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

              {/* Main Creation Area - Reimagined as a boundless space */}
              <div className="mb-10 relative">
                <div className="bg-[#0A0A1B]/70 backdrop-blur-md rounded-2xl p-6 border border-[#2A2A4A]/30 overflow-hidden">
                  {/* Ambient ethereal background instead of rigid patterns */}
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
                    
                    {/* Fluid workspace area - no more rigid dotted borders */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      {lastImage ? (
                        <div className="col-span-3 md:col-span-2 aspect-video rounded-xl overflow-hidden flex items-center justify-center relative group">
                          <img src={lastImage} alt="Your creation" className="max-w-full max-h-full" />
                          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <div className="flex gap-2">
                              <DrawingModule 
                                onDrawingComplete={handleDrawingComplete} 
                                triggerLabel="Continue Creating"
                                initialImage={lastImage}
                              />
                              <Button variant="outline" className="border-white/20 text-white bg-black/30 backdrop-blur-sm">
                                Export
                              </Button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="col-span-3 md:col-span-2 aspect-video rounded-xl flex items-center justify-center group hover:bg-[#1A1A2E]/20 transition-colors relative">
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
                              <Sparkles size={28} className="text-blue-400 group-hover:text-blue-300 transition-colors" />
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
                      
                      {/* Creative Assistant - Reimagined as a collaborative entity */}
                      <div className={`col-span-3 md:col-span-1 transition-all duration-300 ${isAssistantMinimized ? 'h-16' : ''}`}>
                        <div className={`h-full bg-[#1A1A2E]/40 backdrop-blur-sm rounded-xl border border-[#2A2A4A]/30 flex flex-col transition-all ${isAssistantMinimized ? 'p-3' : 'p-5'}`}>
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium text-white flex items-center gap-2">
                              <Sparkles size={18} className="text-blue-400" />
                              Creative Partner
                            </h3>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => setIsAssistantMinimized(!isAssistantMinimized)}
                            >
                              {isAssistantMinimized ? '+' : '−'}
                            </Button>
                          </div>
                          
                          {!isAssistantMinimized && (
                            <>
                              <div className="flex-grow mb-4">
                                {showAssistantSuggestion ? (
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
                    </div>
                  </div>
                </div>
              </div>

              {/* Creative Possibilities - Reimagined from "Quick Actions" */}
              <h2 className="text-2xl font-medium text-white mb-4">Creative Possibilities</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
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
                  icon={<Lightbulb size={22} />} 
                  title="Expand" 
                  description="Let your ideas grow beyond boundaries"
                  isPro={true}
                />
              </div>

              {/* Inspirational Echoes - Reimagined from "Recent Inspiration" */}
              <h2 className="text-2xl font-medium text-white mb-4">Inspirational Echoes</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <InspirationItem src="/lovable-uploads/22f4141e-f83e-4b85-8c93-672e181d999b.png" />
                <InspirationItem src="/lovable-uploads/e565a3ea-dc96-4344-a533-62026d4245e1.png" />
                <InspirationItem src="/lovable-uploads/e9db2be9-f0a3-4506-b387-ce20bea67ba9.png" />
                <InspirationItem src="/lovable-uploads/fa140a1b-cb9d-457c-a7ca-e630a9052d31.png" />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Index;
