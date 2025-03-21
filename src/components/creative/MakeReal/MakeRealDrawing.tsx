
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Button } from '../../ui/button';
import { CodeIcon, Download, Copy, ExternalLink, RotateCcw, Eye } from 'lucide-react';
import { toast } from 'sonner';
import EmptyState from '../../dependency-visualizer/visualizations/EmptyState';

interface MakeRealDrawingProps {
  initialImage: string | null;
  onComplete?: (generatedComponent: string) => void;
}

const MakeRealDrawing: React.FC<MakeRealDrawingProps> = ({ initialImage, onComplete }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewTab, setPreviewTab] = useState<'sketch' | 'component' | 'code'>('sketch');
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [generatedComponent, setGeneratedComponent] = useState<string | null>(null);
  
  // Simulate the "Make Real" process
  const handleMakeReal = () => {
    if (!initialImage) {
      toast.error("No sketch to process");
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate processing delay
    setTimeout(() => {
      // This is where we would integrate with the actual Make Real AI
      // For now, we'll simulate the response with a basic component
      
      const mockGeneratedComponent = `
<div className="p-4 bg-white rounded-lg shadow-md">
  <h2 className="text-lg font-semibold mb-2">User Dashboard</h2>
  <div className="flex gap-4 mb-4">
    <div className="w-1/3 p-3 bg-blue-100 rounded-md text-center">
      <p className="text-sm text-gray-500">Total Users</p>
      <p className="text-xl font-bold">1,234</p>
    </div>
    <div className="w-1/3 p-3 bg-green-100 rounded-md text-center">
      <p className="text-sm text-gray-500">Active Now</p>
      <p className="text-xl font-bold">789</p>
    </div>
    <div className="w-1/3 p-3 bg-purple-100 rounded-md text-center">
      <p className="text-sm text-gray-500">New Today</p>
      <p className="text-xl font-bold">56</p>
    </div>
  </div>
  <div className="h-40 bg-gray-100 rounded-md mb-4 flex items-center justify-center">
    <p className="text-gray-400">Chart Placeholder</p>
  </div>
  <div className="flex justify-end">
    <button className="px-4 py-2 bg-blue-500 text-white rounded-md">
      View Details
    </button>
  </div>
</div>
      `;
      
      setGeneratedCode(mockGeneratedComponent);
      setGeneratedComponent(mockGeneratedComponent);
      setPreviewTab('component');
      setIsProcessing(false);
      
      // Call the onComplete callback
      if (onComplete) {
        onComplete(mockGeneratedComponent);
      }
      
      toast.success("Your sketch was successfully transformed into a component!");
    }, 2500);
  };
  
  const handleCopyCode = () => {
    if (!generatedCode) return;
    
    navigator.clipboard.writeText(generatedCode);
    toast.success("Code copied to clipboard");
  };
  
  const handleDownloadComponent = () => {
    if (!generatedCode) return;
    
    // Create a blob from the code
    const blob = new Blob([generatedCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    // Create a temporary link and trigger the download
    const a = document.createElement('a');
    a.href = url;
    a.download = 'GeneratedComponent.tsx';
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Component downloaded");
  };
  
  const handleReset = () => {
    setGeneratedCode(null);
    setGeneratedComponent(null);
    setPreviewTab('sketch');
  };
  
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white mb-1">Make Real Drawing</h2>
          <p className="text-sm text-gray-400">Transform your sketch into a real component</p>
        </div>
        
        {generatedComponent && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={handleReset}
            >
              <RotateCcw size={16} />
              Reset
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={handleCopyCode}
            >
              <Copy size={16} />
              Copy Code
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={handleDownloadComponent}
            >
              <Download size={16} />
              Download
            </Button>
          </div>
        )}
      </div>
      
      <Tabs value={previewTab} onValueChange={(value) => setPreviewTab(value as any)}>
        <TabsList className="bg-black/30">
          <TabsTrigger value="sketch">Original Sketch</TabsTrigger>
          <TabsTrigger value="component" disabled={!generatedComponent}>Component Preview</TabsTrigger>
          <TabsTrigger value="code" disabled={!generatedCode}>
            <div className="flex items-center gap-1">
              <CodeIcon size={14} />
              Code
            </div>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="sketch" className="relative">
          {initialImage ? (
            <div className="rounded-md border border-white/10 overflow-hidden bg-black/20 backdrop-blur-sm">
              <img 
                src={initialImage} 
                alt="Your sketch" 
                className="max-w-full object-contain mx-auto" 
                style={{ maxHeight: '400px' }}
              />
            </div>
          ) : (
            <div className="h-64 rounded-md border border-white/10">
              <EmptyState message="No sketch available" />
            </div>
          )}
          
          <div className="mt-4 flex justify-center">
            <Button
              onClick={handleMakeReal}
              disabled={!initialImage || isProcessing}
              className="gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {isProcessing ? (
                <>
                  <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-white animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Eye size={16} />
                  Make Real
                </>
              )}
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="component">
          {generatedComponent ? (
            <div className="rounded-md border border-white/10 overflow-hidden bg-white p-4">
              <div dangerouslySetInnerHTML={{ __html: `
                <div class="p-4 bg-white rounded-lg shadow-md">
                  <h2 class="text-lg font-semibold mb-2">User Dashboard</h2>
                  <div class="flex gap-4 mb-4">
                    <div class="w-1/3 p-3 bg-blue-100 rounded-md text-center">
                      <p class="text-sm text-gray-500">Total Users</p>
                      <p class="text-xl font-bold">1,234</p>
                    </div>
                    <div class="w-1/3 p-3 bg-green-100 rounded-md text-center">
                      <p class="text-sm text-gray-500">Active Now</p>
                      <p class="text-xl font-bold">789</p>
                    </div>
                    <div class="w-1/3 p-3 bg-purple-100 rounded-md text-center">
                      <p class="text-sm text-gray-500">New Today</p>
                      <p class="text-xl font-bold">56</p>
                    </div>
                  </div>
                  <div class="h-40 bg-gray-100 rounded-md mb-4 flex items-center justify-center">
                    <p class="text-gray-400">Chart Placeholder</p>
                  </div>
                  <div class="flex justify-end">
                    <button class="px-4 py-2 bg-blue-500 text-white rounded-md">
                      View Details
                    </button>
                  </div>
                </div>
              ` }} />
            </div>
          ) : (
            <div className="h-64 rounded-md border border-white/10">
              <EmptyState message="No component generated yet" />
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="code">
          {generatedCode ? (
            <div className="rounded-md border border-white/10 overflow-hidden bg-black/50 p-4">
              <pre className="text-sm text-white overflow-auto p-4 font-mono">
                {generatedCode}
              </pre>
            </div>
          ) : (
            <div className="h-64 rounded-md border border-white/10">
              <EmptyState message="No code generated yet" />
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <div className="mt-2 text-sm text-gray-400 flex items-center gap-2">
        <p>Powered by Make Real AI</p>
        <Button variant="link" size="sm" className="h-auto p-0" asChild>
          <a href="https://github.com/tldraw/make-real-starter" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
            Learn more 
            <ExternalLink size={12} />
          </a>
        </Button>
      </div>
    </div>
  );
};

export default MakeRealDrawing;
