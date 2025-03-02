
import { useEffect, useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { Button } from "../components/ui/button";
import { PlusIcon, ImageIcon, VideoIcon, Wand2Icon, HelpCircleIcon, SparklesIcon, Palette } from "lucide-react";
import DrawingModule from "../components/draw/DrawingModule";
import { Link } from "react-router-dom";

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
            setAssistantMessage("I notice you were working on a landscape image. Would you like to continue where you left off?");
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

  const CreationAction = ({ icon, title, description, isPro = false }: { 
    icon: React.ReactNode, 
    title: string, 
    description: string,
    isPro?: boolean
  }) => (
    <div className="bg-[#1A1A2E] rounded-xl p-5 flex items-center hover:bg-[#252547] transition-colors cursor-pointer group">
      <div className="mr-4 p-3.5 rounded-full bg-[#2A2A4A] text-blue-400 group-hover:text-blue-300 transition-colors">
        {icon}
      </div>
      <div className="flex-grow">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-white">{title}</h3>
          {isPro && (
            <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">
              PRO
            </span>
          )}
        </div>
        <p className="text-sm text-gray-400 mt-1">{description}</p>
      </div>
    </div>
  );

  const InspirationItem = ({ src }: { src: string }) => (
    <div className="rounded-lg overflow-hidden bg-[#1A1A2E] aspect-square relative group">
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
                  <Button variant="outline" className="gap-2">
                    <HelpCircleIcon size={18} />
                    Help
                  </Button>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 gap-2">
                    <SparklesIcon size={18} />
                    Upgrade to Pro
                  </Button>
                </div>
              </div>

              {/* Main Creation Area with Canvas Background */}
              <div className="mb-10 relative">
                <div className="bg-[#121230] rounded-2xl p-6 border border-[#2A2A4A] overflow-hidden">
                  {/* Background wave pattern */}
                  <div className="absolute inset-0 overflow-hidden opacity-20">
                    <svg width="100%" height="100%" viewBox="0 0 1000 200" preserveAspectRatio="none">
                      <path d="M0,100 C150,200 350,0 500,100 C650,200 850,0 1000,100 L1000,0 L0,0 Z" fill="url(#blue-gradient)" opacity="0.3"></path>
                      <defs>
                        <linearGradient id="blue-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#4F46E5"></stop>
                          <stop offset="100%" stopColor="#0EA5E9"></stop>
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>

                  {/* Content */}
                  <div className="relative z-10">
                    <h2 className="text-2xl font-medium text-white mb-4">What would you like to create today?</h2>
                    
                    {/* Canvas area or project workspace */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      {lastImage ? (
                        <div className="col-span-3 md:col-span-2 aspect-video bg-[#1A1A2E] rounded-xl overflow-hidden flex items-center justify-center relative group">
                          <img src={lastImage} alt="Your creation" className="max-w-full max-h-full" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <div className="flex gap-2">
                              <DrawingModule 
                                onDrawingComplete={handleDrawingComplete} 
                                triggerLabel="Edit"
                                initialImage={lastImage}
                              />
                              <Button variant="outline" className="border-white/20 text-white bg-black/30">
                                Export
                              </Button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="col-span-3 md:col-span-2 aspect-video bg-[#1A1A2E] rounded-xl flex items-center justify-center border-2 border-dashed border-[#2A2A4A] group hover:border-blue-500 transition-colors">
                          <div className="text-center p-6">
                            <div className="w-16 h-16 rounded-full bg-[#2A2A4A] flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-600 transition-colors">
                              <PlusIcon size={30} className="text-gray-400 group-hover:text-white transition-colors" />
                            </div>
                            <h3 className="text-xl font-medium text-white mb-2">Create something amazing</h3>
                            <p className="text-gray-400 mb-6 max-w-md">Start with a blank canvas or choose from our templates</p>
                            <div className="flex gap-3 justify-center">
                              <DrawingModule 
                                onDrawingComplete={handleDrawingComplete} 
                                triggerLabel="Start Drawing"
                              />
                              <Button variant="outline" className="gap-2">
                                <ImageIcon size={16} />
                                Upload Image
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Creative Assistant Panel */}
                      <div className="col-span-3 md:col-span-1 bg-[#1A1A2E] rounded-xl p-5 border border-[#2A2A4A] flex flex-col">
                        <h3 className="font-medium text-white flex items-center gap-2 mb-4">
                          <SparklesIcon size={18} className="text-blue-400" />
                          Creative Assistant
                        </h3>
                        
                        <div className="flex-grow mb-4">
                          {showAssistantSuggestion ? (
                            <div className="p-3 rounded-lg bg-[#2A2A4A] text-sm text-gray-300">
                              {assistantMessage}
                              <div className="mt-3 flex gap-2">
                                <Button size="sm" variant="default" className="bg-blue-600 hover:bg-blue-700 text-xs">Yes, continue</Button>
                                <Button size="sm" variant="outline" className="text-xs">No thanks</Button>
                              </div>
                            </div>
                          ) : (
                            <p className="text-gray-400 text-sm">Ask anything about your creative process...</p>
                          )}
                        </div>
                        
                        <div className="relative">
                          <input 
                            type="text" 
                            placeholder="Ask something..."
                            className="w-full bg-[#252547] border border-[#3A3A5A] rounded-lg py-2 pl-3 pr-10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <Button size="sm" className="absolute right-1 top-1 h-7 w-7 p-0 bg-blue-600">
                            <SparklesIcon size={14} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <h2 className="text-2xl font-medium text-white mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                <CreationAction 
                  icon={<ImageIcon size={22} />} 
                  title="Image to Video" 
                  description="Bring your creation to life"
                />
                <CreationAction 
                  icon={<Palette size={22} />} 
                  title="Style Transfer" 
                  description="Transform the aesthetic feel"
                />
                <CreationAction 
                  icon={<Wand2Icon size={22} />} 
                  title="Expand Canvas" 
                  description="Let AI extend your imagination"
                  isPro={true}
                />
              </div>

              {/* Recent Inspiration */}
              <h2 className="text-2xl font-medium text-white mb-4">Recent Inspiration</h2>
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
