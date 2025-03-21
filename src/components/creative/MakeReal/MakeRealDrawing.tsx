
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Wand2, RefreshCw, Code, Download, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface MakeRealDrawingProps {
  initialImage?: string | null;
  onComplete?: (generatedComponent: string) => void;
}

type GeneratedOutput = {
  html: string;
  css: string;
  js: string;
  preview: string | null;
}

const MakeRealDrawing: React.FC<MakeRealDrawingProps> = ({ 
  initialImage,
  onComplete 
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedOutput, setGeneratedOutput] = useState<GeneratedOutput | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState('preview');
  const [drawingMode, setDrawingMode] = useState<'free' | 'ui'>('ui');

  // This would be replaced with actual tldraw integration
  useEffect(() => {
    if (canvasRef.current) {
      // Here we would initialize tldraw
      console.log("TLDraw would be initialized here");
      
      // If we have an initial image, we could add it to the canvas
      if (initialImage) {
        console.log("Would add initial image to tldraw canvas");
      }
    }
  }, [initialImage]);

  const handleMakeReal = async () => {
    setIsGenerating(true);
    
    try {
      // This would be replaced with actual API call to generate component
      // from the current tldraw sketch
      setTimeout(() => {
        // Simulated response
        const mockOutput: GeneratedOutput = {
          html: '<div class="cube-controller">\n  <h2>3D Cube Rotation Controller</h2>\n  <div class="control-group">\n    <label>Rotate X: <span id="x-value">15°</span></label>\n    <input type="range" id="rotate-x" min="0" max="360" value="15">\n  </div>\n  <div class="control-group">\n    <label>Rotate Y: <span id="y-value">30°</span></label>\n    <input type="range" id="rotate-y" min="0" max="360" value="30">\n  </div>\n  <div class="control-group">\n    <label>Rotate Z: <span id="z-value">0°</span></label>\n    <input type="range" id="rotate-z" min="0" max="360" value="0">\n  </div>\n  <button id="reset">Reset Rotation</button>\n  <div id="cube-container"></div>\n</div>',
          css: '.cube-controller {\n  font-family: system-ui, sans-serif;\n  max-width: 500px;\n  margin: 2rem auto;\n  padding: 2rem;\n  border-radius: 8px;\n  box-shadow: 0 4px 20px rgba(0,0,0,0.1);\n  background: white;\n}\n\nh2 {\n  margin-top: 0;\n  margin-bottom: 1.5rem;\n  text-align: center;\n}\n\n.control-group {\n  margin-bottom: 1rem;\n}\n\nlabel {\n  display: block;\n  margin-bottom: 0.5rem;\n}\n\ninput[type="range"] {\n  width: 100%;\n  margin-bottom: 1rem;\n}\n\nbutton {\n  background: #4f46e5;\n  border: none;\n  padding: 0.5rem 1rem;\n  color: white;\n  border-radius: 4px;\n  cursor: pointer;\n  font-weight: bold;\n  margin-bottom: 1.5rem;\n}\n\nbutton:hover {\n  background: #4338ca;\n}\n\n#cube-container {\n  width: 200px;\n  height: 200px;\n  perspective: 600px;\n  margin: 0 auto;\n}',
          js: 'document.addEventListener("DOMContentLoaded", function() {\n  // DOM elements\n  const xSlider = document.getElementById("rotate-x");\n  const ySlider = document.getElementById("rotate-y");\n  const zSlider = document.getElementById("rotate-z");\n  const xValue = document.getElementById("x-value");\n  const yValue = document.getElementById("y-value");\n  const zValue = document.getElementById("z-value");\n  const resetBtn = document.getElementById("reset");\n  const container = document.getElementById("cube-container");\n  \n  // Create cube\n  const cube = document.createElement("div");\n  cube.style.width = "100%";\n  cube.style.height = "100%";\n  cube.style.transformStyle = "preserve-3d";\n  cube.style.transition = "transform 0.5s";\n  container.appendChild(cube);\n  \n  // Add faces\n  const faces = ["front", "back", "right", "left", "top", "bottom"];\n  const colors = ["#f87171", "#a78bfa", "#60a5fa", "#34d399", "#fbbf24", "#f472b6"];\n  const positions = [\n    "translateZ(100px)",\n    "rotateY(180deg) translateZ(100px)",\n    "rotateY(90deg) translateZ(100px)",\n    "rotateY(-90deg) translateZ(100px)",\n    "rotateX(90deg) translateZ(100px)",\n    "rotateX(-90deg) translateZ(100px)"\n  ];\n  \n  faces.forEach((face, i) => {\n    const element = document.createElement("div");\n    element.style.position = "absolute";\n    element.style.width = "100%";\n    element.style.height = "100%";\n    element.style.background = colors[i];\n    element.style.transform = positions[i];\n    element.style.display = "flex";\n    element.style.alignItems = "center";\n    element.style.justifyContent = "center";\n    element.style.fontSize = "24px";\n    element.style.fontWeight = "bold";\n    element.style.color = "white";\n    element.innerText = face.charAt(0).toUpperCase() + face.slice(1);\n    cube.appendChild(element);\n  });\n  \n  // Update rotation\n  function updateRotation() {\n    const x = xSlider.value;\n    const y = ySlider.value;\n    const z = zSlider.value;\n    \n    cube.style.transform = `rotateX(${x}deg) rotateY(${y}deg) rotateZ(${z}deg)`;\n    xValue.textContent = `${x}°`;\n    yValue.textContent = `${y}°`;\n    zValue.textContent = `${z}°`;\n  }\n  \n  // Event listeners\n  xSlider.addEventListener("input", updateRotation);\n  ySlider.addEventListener("input", updateRotation);\n  zSlider.addEventListener("input", updateRotation);\n  \n  resetBtn.addEventListener("click", function() {\n    xSlider.value = 0;\n    ySlider.value = 0;\n    zSlider.value = 0;\n    updateRotation();\n  });\n  \n  // Initial rotation\n  updateRotation();\n});',
          preview: '/lovable-uploads/b6ea219b-cc42-493d-a6b8-38227026c8a0.png'
        };
        
        setGeneratedOutput(mockOutput);
        if (onComplete) {
          onComplete(mockOutput.html);
        }
        toast.success("Component generated successfully!");
      }, 2000);
    } catch (error) {
      console.error("Error generating component:", error);
      toast.error("Failed to generate component. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyCode = (code: string, type: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`${type} code copied to clipboard!`);
  };

  const handleDownload = () => {
    if (!generatedOutput) return;
    
    // Create a zip file with the generated code
    // For now, we'll just download the HTML file
    const blob = new Blob([generatedOutput.html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated-component.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Component downloaded successfully!");
  };

  return (
    <Card className="bg-[#0A0A1B] border-[#2A2A4A]">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Make Real Drawing</span>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setDrawingMode('ui')}
              className={drawingMode === 'ui' ? 'bg-blue-600/20' : ''}
            >
              UI Components
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setDrawingMode('free')}
              className={drawingMode === 'free' ? 'bg-blue-600/20' : ''}
            >
              Free Drawing
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!generatedOutput ? (
          <div className="flex flex-col gap-4">
            {/* This div would be replaced with actual tldraw canvas */}
            <div 
              ref={canvasRef} 
              className="w-full aspect-video bg-black/30 border border-[#2A2A4A]/50 rounded-md overflow-hidden relative"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-gray-400">TLDraw would be embedded here</p>
                {initialImage && (
                  <img 
                    src={initialImage} 
                    alt="Reference" 
                    className="absolute inset-0 w-full h-full object-contain opacity-30" 
                  />
                )}
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Button 
                  onClick={handleMakeReal} 
                  disabled={isGenerating}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw size={16} className="mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 size={16} className="mr-2" />
                      Make Real
                    </>
                  )}
                </Button>
                <Button variant="outline" size="icon">
                  <RefreshCw size={16} />
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                Draw UI components and click "Make Real" to generate code
              </p>
            </div>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="html">HTML</TabsTrigger>
              <TabsTrigger value="css">CSS</TabsTrigger>
              <TabsTrigger value="js">JavaScript</TabsTrigger>
            </TabsList>
            
            <TabsContent value="preview" className="m-0">
              {generatedOutput.preview ? (
                <div className="aspect-video bg-white rounded-md overflow-hidden flex items-center justify-center">
                  <img 
                    src={generatedOutput.preview} 
                    alt="Generated component preview" 
                    className="max-w-full max-h-full" 
                  />
                </div>
              ) : (
                <div className="aspect-video bg-white rounded-md p-4 overflow-auto">
                  <div dangerouslySetInnerHTML={{ __html: generatedOutput.html }} />
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="html" className="m-0">
              <div className="relative">
                <pre className="p-4 bg-[#1A1A2E] rounded-md overflow-auto max-h-[400px] text-xs">
                  <code className="text-gray-300">{generatedOutput.html}</code>
                </pre>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute top-2 right-2"
                  onClick={() => handleCopyCode(generatedOutput.html, 'HTML')}
                >
                  <Copy size={16} />
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="css" className="m-0">
              <div className="relative">
                <pre className="p-4 bg-[#1A1A2E] rounded-md overflow-auto max-h-[400px] text-xs">
                  <code className="text-gray-300">{generatedOutput.css}</code>
                </pre>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute top-2 right-2"
                  onClick={() => handleCopyCode(generatedOutput.css, 'CSS')}
                >
                  <Copy size={16} />
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="js" className="m-0">
              <div className="relative">
                <pre className="p-4 bg-[#1A1A2E] rounded-md overflow-auto max-h-[400px] text-xs">
                  <code className="text-gray-300">{generatedOutput.js}</code>
                </pre>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute top-2 right-2"
                  onClick={() => handleCopyCode(generatedOutput.js, 'JavaScript')}
                >
                  <Copy size={16} />
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
      
      {generatedOutput && (
        <CardFooter className="justify-between">
          <Button variant="outline" onClick={() => setGeneratedOutput(null)}>
            Start Over
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleDownload}>
              <Download size={16} className="mr-2" />
              Download
            </Button>
            <Button variant="default" onClick={() => {}}>
              <Code size={16} className="mr-2" />
              Use Component
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default MakeRealDrawing;
