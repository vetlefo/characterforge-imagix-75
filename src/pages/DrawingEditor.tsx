
import { useState, useRef } from "react";
import DrawingCanvas from "../components/draw/DrawingCanvas";
import { Button } from "../components/ui/button";
import { ArrowLeft, Upload, Download, Share2 } from "lucide-react";
import { Link } from "react-router-dom";

const DrawingEditor = () => {
  const [canvasImage, setCanvasImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleSave = (dataUrl: string) => {
    setCanvasImage(dataUrl);
    console.log("Canvas saved:", dataUrl);
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setCanvasImage(result);
    };
    reader.readAsDataURL(file);
  };

  const handleDownload = () => {
    if (!canvasImage) return;
    
    const link = document.createElement('a');
    link.href = canvasImage;
    link.download = 'drawing.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#0F0F23] flex flex-col">
      {/* Header */}
      <header className="bg-[#0A0A1B] border-b border-[#1A1A2E] p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="outline" size="icon" className="rounded-full">
                <ArrowLeft size={18} />
              </Button>
            </Link>
            <h1 className="text-xl font-medium text-white">Drawing Editor</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={handleUploadClick}
            >
              <Upload size={16} />
              Upload
            </Button>
            
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={handleDownload}
              disabled={!canvasImage}
            >
              <Download size={16} />
              Download
            </Button>
            
            <Button className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Share2 size={16} />
              Share
            </Button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-[#1A1A2E] rounded-xl p-6 shadow-lg border border-[#2A2A4A]">
            <DrawingCanvas 
              width={1024}
              height={576}
              onSave={handleSave}
              initialImage={canvasImage}
            />
          </div>
        </div>
      </main>
      
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept="image/*"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default DrawingEditor;
