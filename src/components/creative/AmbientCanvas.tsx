
import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { Paintbrush, Eraser, Square, Circle, MousePointer, Check, X } from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from 'sonner';

interface AmbientCanvasProps {
  onDrawingActivate: (dataUrl: string) => void;
}

type DrawingMode = "select" | "draw" | "eraser" | "rectangle" | "circle";

const AmbientCanvas: React.FC<AmbientCanvasProps> = ({ onDrawingActivate }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas | null>(null);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [drawingMode, setDrawingMode] = useState<DrawingMode>("draw");
  const [color, setColor] = useState('#ffffff');
  const [brushSize, setBrushSize] = useState(3);
  const [hasContent, setHasContent] = useState(false);
  const [isActivating, setIsActivating] = useState(false);
  
  // Set up the canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    
    // Get window dimensions
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    const canvas = new fabric.Canvas(canvasRef.current, {
      width,
      height,
      backgroundColor: 'transparent',
      isDrawingMode: false,
    });
    
    // Set initial brush
    canvas.freeDrawingBrush.color = color;
    canvas.freeDrawingBrush.width = brushSize;
    
    setFabricCanvas(canvas);
    
    // Track objects added to canvas
    canvas.on('object:added', () => {
      setHasContent(true);
    });
    
    // Resize listener
    const handleResize = () => {
      canvas.setWidth(window.innerWidth);
      canvas.setHeight(window.innerHeight);
      canvas.renderAll();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      canvas.dispose();
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Update canvas modes and settings
  useEffect(() => {
    if (!fabricCanvas) return;
    
    // Set drawing mode
    fabricCanvas.isDrawingMode = isDrawingMode && drawingMode === "draw";
    
    // Configure brush
    if (fabricCanvas.freeDrawingBrush) {
      fabricCanvas.freeDrawingBrush.color = color;
      fabricCanvas.freeDrawingBrush.width = brushSize;
    }
    
    // Set mode-specific behavior
    if (drawingMode === "eraser" && isDrawingMode) {
      // Create eraser brush
      fabricCanvas.freeDrawingBrush = new fabric.EraserBrush(fabricCanvas);
      fabricCanvas.freeDrawingBrush.width = brushSize * 2;
      fabricCanvas.isDrawingMode = true;
    } else if (drawingMode === "draw" && isDrawingMode) {
      // Reset to pencil brush
      fabricCanvas.freeDrawingBrush = new fabric.PencilBrush(fabricCanvas);
      fabricCanvas.freeDrawingBrush.color = color;
      fabricCanvas.freeDrawingBrush.width = brushSize;
      fabricCanvas.isDrawingMode = true;
    }
  }, [fabricCanvas, isDrawingMode, drawingMode, color, brushSize]);
  
  // Handle tool selection
  const handleToolSelect = (mode: DrawingMode) => {
    setDrawingMode(mode);
    
    if (!fabricCanvas) return;
    
    if (mode === "rectangle" && isDrawingMode) {
      fabricCanvas.isDrawingMode = false;
      addShape("rectangle");
    } else if (mode === "circle" && isDrawingMode) {
      fabricCanvas.isDrawingMode = false;
      addShape("circle");
    } else if (mode === "select") {
      fabricCanvas.isDrawingMode = false;
    }
  };
  
  // Add shape to canvas
  const addShape = (shapeType: "rectangle" | "circle") => {
    if (!fabricCanvas) return;
    
    // Create shape at pointer position
    const pointer = fabricCanvas.getPointer(fabricCanvas.getEvent());
    
    if (shapeType === "rectangle") {
      const rect = new fabric.Rect({
        left: pointer.x - 50,
        top: pointer.y - 50,
        fill: 'transparent',
        stroke: color,
        strokeWidth: 2,
        width: 100,
        height: 100,
      });
      fabricCanvas.add(rect);
    } else {
      const circle = new fabric.Circle({
        left: pointer.x - 50,
        top: pointer.y - 50,
        fill: 'transparent',
        stroke: color,
        strokeWidth: 2,
        radius: 50,
      });
      fabricCanvas.add(circle);
    }
  };
  
  // Toggle drawing mode
  const toggleDrawingMode = () => {
    setIsDrawingMode(!isDrawingMode);
    
    if (!isDrawingMode) {
      toast.success("Drawing mode activated. Sketch anywhere on the page.");
    } else {
      toast.info("Drawing mode deactivated.");
    }
  };
  
  // Handle activation of drawing
  const handleActivate = () => {
    if (!fabricCanvas || !hasContent) return;
    
    setIsActivating(true);
    
    // Create a temporary canvas with just the drawing area
    const objects = fabricCanvas.getObjects();
    if (objects.length === 0) {
      toast.error("No drawing to activate.");
      setIsActivating(false);
      return;
    }
    
    // Get bounding box of all objects
    const allCoords = objects.map(obj => {
      const bound = obj.getBoundingRect();
      return {
        left: bound.left,
        top: bound.top,
        right: bound.left + bound.width,
        bottom: bound.top + bound.height
      };
    });
    
    // Calculate total bounds
    const left = Math.max(0, Math.min(...allCoords.map(c => c.left)) - 20);
    const top = Math.max(0, Math.min(...allCoords.map(c => c.top)) - 20);
    const right = Math.min(fabricCanvas.width || window.innerWidth, Math.max(...allCoords.map(c => c.right)) + 20);
    const bottom = Math.min(fabricCanvas.height || window.innerHeight, Math.max(...allCoords.map(c => c.bottom)) + 20);
    
    const width = right - left;
    const height = bottom - top;
    
    // Create dataURL of just that region
    const dataUrl = fabricCanvas.toDataURL({
      left,
      top,
      width,
      height,
      format: 'png'
    });
    
    // Activate the drawing
    onDrawingActivate(dataUrl);
    
    // Clear canvas or reset drawing mode
    setIsDrawingMode(false);
    setIsActivating(false);
    
    toast.success("Drawing activated! Now you can bring it to life.");
  };
  
  // Clear the canvas
  const handleClear = () => {
    if (!fabricCanvas) return;
    
    fabricCanvas.clear();
    fabricCanvas.backgroundColor = 'transparent';
    fabricCanvas.renderAll();
    setHasContent(false);
    
    toast.info("Canvas cleared.");
  };
  
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Main canvas - covers entire viewport */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 z-0"
      />
      
      {/* Floating drawing controls */}
      {isDrawingMode && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-20 bg-black/60 backdrop-blur-md rounded-full px-4 py-3 flex items-center gap-3 border border-white/10 shadow-xl">
          <Button 
            variant="ghost" 
            size="icon" 
            className={`rounded-full ${drawingMode === 'draw' ? 'bg-white/20' : ''}`} 
            onClick={() => handleToolSelect('draw')}
            title="Draw"
          >
            <Paintbrush size={18} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className={`rounded-full ${drawingMode === 'eraser' ? 'bg-white/20' : ''}`}
            onClick={() => handleToolSelect('eraser')}
            title="Eraser"
          >
            <Eraser size={18} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className={`rounded-full ${drawingMode === 'rectangle' ? 'bg-white/20' : ''}`}
            onClick={() => handleToolSelect('rectangle')}
            title="Rectangle"
          >
            <Square size={18} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className={`rounded-full ${drawingMode === 'circle' ? 'bg-white/20' : ''}`}
            onClick={() => handleToolSelect('circle')}
            title="Circle"
          >
            <Circle size={18} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className={`rounded-full ${drawingMode === 'select' ? 'bg-white/20' : ''}`}
            onClick={() => handleToolSelect('select')}
            title="Select"
          >
            <MousePointer size={18} />
          </Button>
          
          <div className="h-6 w-px bg-white/20 mx-1"></div>
          
          <input 
            type="color" 
            value={color} 
            onChange={e => setColor(e.target.value)} 
            className="w-8 h-8 rounded-full overflow-hidden cursor-pointer"
            title="Color picker"
          />
          
          <input 
            type="range" 
            min="1" 
            max="10" 
            value={brushSize} 
            onChange={e => setBrushSize(parseInt(e.target.value))} 
            className="w-20"
            title="Brush size"
          />
          
          <div className="h-6 w-px bg-white/20 mx-1"></div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full text-green-400 hover:text-green-300 hover:bg-green-900/20"
            onClick={handleActivate}
            disabled={!hasContent || isActivating}
            title="Activate drawing"
          >
            <Check size={18} />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full text-red-400 hover:text-red-300 hover:bg-red-900/20"
            onClick={handleClear}
            title="Clear canvas"
          >
            <X size={18} />
          </Button>
        </div>
      )}
      
      {/* Toggle drawing mode button */}
      <div className="fixed bottom-4 right-4 z-20">
        <Button 
          variant={isDrawingMode ? "default" : "outline"} 
          size="sm" 
          className={`gap-2 ${isDrawingMode ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-black/60 backdrop-blur-md hover:bg-black/80'}`}
          onClick={toggleDrawingMode}
        >
          <Paintbrush size={16} />
          {isDrawingMode ? "Drawing Mode: ON" : "Start Drawing"}
        </Button>
      </div>
    </div>
  );
};

export default AmbientCanvas;
