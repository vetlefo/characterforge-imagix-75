
import { useState } from "react";
import { PromoBar } from "../components/PromoBar";
import { Sidebar } from "../components/Sidebar";
import Header from "../components/Header";
import DrawingCanvas from "../components/draw/DrawingCanvas";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Upload } from "lucide-react";

const DrawingEditor = () => {
  const [savedDrawing, setSavedDrawing] = useState<string | null>(null);
  const [initialImage, setInitialImage] = useState<string | null>(null);
  const fileInputRef = useState<HTMLInputElement | null>(null);

  const handleSaveDrawing = (dataUrl: string) => {
    setSavedDrawing(dataUrl);
    toast.success("Drawing saved successfully!");
  };

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target?.result) {
          setInitialImage(event.target.result as string);
          toast.success("Image loaded! You can now draw on top of it.");
        }
      };
      
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <PromoBar />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <div className="flex-1 overflow-auto">
            <main className="py-8 px-12">
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white">Drawing Editor</h1>
                {savedDrawing && (
                  <Button 
                    onClick={() => window.open(savedDrawing, '_blank')}
                    variant="outline"
                  >
                    View Saved Drawing
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <DrawingCanvas 
                    width={800} 
                    height={600} 
                    onSave={handleSaveDrawing}
                    initialImage={initialImage}
                  />
                </div>
                <div className="bg-card rounded-lg p-6 border border-border">
                  <h2 className="text-xl font-semibold text-white mb-4">Drawing Tools</h2>
                  <p className="text-muted-foreground mb-4">
                    Use the drawing tools to create your sketch. Once complete, click "Use Drawing" to save your creation.
                  </p>
                  
                  <div className="mb-6">
                    <h3 className="font-medium text-white mb-2">Start with an image</h3>
                    <p className="text-muted-foreground mb-4 text-sm">
                      Upload an image to sketch on top of it, or paste (Ctrl+V) an image directly into the canvas.
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={handleImageUpload}
                      className="flex items-center gap-2 w-full justify-center"
                    >
                      <Upload size={16} />
                      Upload Base Image
                    </Button>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileChange} 
                      accept="image/*" 
                      className="hidden" 
                    />
                  </div>
                  
                  <h3 className="font-medium text-white mt-6 mb-2">Available Tools</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <span className="w-6 h-6 flex items-center justify-center bg-primary/10 rounded-full">
                        <span className="text-xs">1</span>
                      </span>
                      <span>Select tool to move and resize objects</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-6 h-6 flex items-center justify-center bg-primary/10 rounded-full">
                        <span className="text-xs">2</span>
                      </span>
                      <span>Pencil tool for freehand drawing</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-6 h-6 flex items-center justify-center bg-primary/10 rounded-full">
                        <span className="text-xs">3</span>
                      </span>
                      <span>Shape tools for creating geometric elements</span>
                    </li>
                  </ul>
                  
                  {savedDrawing && (
                    <div className="mt-8">
                      <h3 className="font-medium text-white mb-4">Your Drawing</h3>
                      <div className="border border-border rounded-lg overflow-hidden">
                        <img 
                          src={savedDrawing} 
                          alt="Your saved drawing" 
                          className="w-full h-auto"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrawingEditor;
