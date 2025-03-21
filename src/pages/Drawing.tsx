
import React, { useState } from 'react';
import Layout from '../components/Layout';
import AmbientCanvas from '../components/creative/AmbientCanvas';
import MakeRealDrawing from '../components/creative/MakeReal/MakeRealDrawing';
import { Button } from '../components/ui/button';
import { MagicWand, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

const Drawing = () => {
  const [activeSketch, setActiveSketch] = useState<string | null>(null);
  const [showMakeReal, setShowMakeReal] = useState(false);

  const handleDrawingActivate = (dataUrl: string) => {
    setActiveSketch(dataUrl);
    toast.success("Sketch activated! Now you can bring it to life.");
  };

  const handleMakeRealToggle = () => {
    if (activeSketch) {
      setShowMakeReal(!showMakeReal);
    } else {
      toast.info("Draw something first, then activate it to make it real");
    }
  };

  return (
    <Layout>
      <div className="relative min-h-screen">
        {/* Ambient Canvas that covers the entire page */}
        <AmbientCanvas onDrawingActivate={handleDrawingActivate} />
        
        {/* Content that floats above the canvas */}
        <div className="relative z-10 p-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-white">Creative Canvas</h1>
            <p className="text-gray-300 mb-8">
              Sketch anywhere on this page. When you're ready to bring your ideas to life, 
              activate your drawing and use the tools below.
            </p>
            
            {activeSketch && (
              <div className="flex gap-4 mb-6">
                <Button 
                  variant="default" 
                  className="gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  onClick={handleMakeRealToggle}
                >
                  <Sparkles size={16} className="text-white" />
                  {showMakeReal ? "Hide Make Real" : "Make Real"}
                </Button>
                <Button 
                  variant="outline" 
                  className="gap-2"
                  onClick={() => setActiveSketch(null)}
                >
                  Start New Sketch
                </Button>
              </div>
            )}
            
            {showMakeReal && activeSketch && (
              <div className="mt-6 bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <MakeRealDrawing 
                  initialImage={activeSketch} 
                  onComplete={(generatedComponent) => {
                    console.log("Generated component:", generatedComponent);
                    // Here we would integrate the generated component
                  }} 
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Drawing;
