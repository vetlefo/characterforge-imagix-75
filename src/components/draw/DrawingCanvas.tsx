import { useEffect, useRef, useState, useCallback } from "react";
import { fabric } from "fabric";
import DrawingToolbar from "./DrawingToolbar";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { Upload, Clipboard, Redo, Undo } from "lucide-react";

export type DrawingMode = "pencil" | "line" | "rectangle" | "circle" | "select" | "spray" | "eraser";
export type BrushType = "pencil" | "spray" | "eraser";

interface DrawingCanvasProps {
  width?: number;
  height?: number;
  onSave?: (dataUrl: string) => void;
  className?: string;
  initialImage?: string | null;
}

interface HistoryState {
  canvasState: string;
  activeLayerId: string;
}

interface Layer {
  id: string;
  name: string;
  visible: boolean;
  canvas: fabric.Canvas;
  active: boolean;
}

const DrawingCanvas = ({ 
  width = 512, 
  height = 512, 
  onSave,
  className,
  initialImage = null
}: DrawingCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const etherealCanvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas | null>(null);
  const [drawingMode, setDrawingMode] = useState<DrawingMode>("pencil");
  const [brushType, setBrushType] = useState<BrushType>("pencil");
  const [color, setColor] = useState("#ffffff");
  const [brushSize, setBrushSize] = useState(5);
  const [cursorPosition, setCursorPosition] = useState({ x: -100, y: -100 });
  const animationFrameId = useRef<number | null>(null);
  
  // Undo/Redo system
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isUndoRedoAction, setIsUndoRedoAction] = useState(false);
  
  // Layer management
  const [layers, setLayers] = useState<Layer[]>([]);
  const [activeLayerId, setActiveLayerId] = useState<string>("");

  // Debounce function for saving states
  const saveDebounceRef = useRef<NodeJS.Timeout | null>(null);

  // Setup main drawing canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      backgroundColor: "#000000",
      width,
      height,
      isDrawingMode: true,
    });

    canvas.freeDrawingBrush.color = color;
    canvas.freeDrawingBrush.width = brushSize;

    setFabricCanvas(canvas);

    // Initialize the first layer
    const initialLayerId = "layer-1";
    setLayers([{
      id: initialLayerId,
      name: "Layer 1",
      visible: true,
      canvas,
      active: true
    }]);
    setActiveLayerId(initialLayerId);

    // Set up paste event listener
    const handlePaste = (e: ClipboardEvent) => {
      if (e.clipboardData && e.clipboardData.items) {
        const items = e.clipboardData.items;
        for (let i = 0; i < items.length; i++) {
          if (items[i].type.indexOf('image') !== -1) {
            const blob = items[i].getAsFile();
            if (blob) {
              const reader = new FileReader();
              reader.onload = (event) => {
                if (event.target?.result && canvas) {
                  loadImageToCanvas(canvas, event.target.result as string);
                }
              };
              reader.readAsDataURL(blob);
            }
          }
        }
      }
    };

    document.addEventListener('paste', handlePaste);

    // Track cursor position for ethereal effects
    const handleCanvasMouseMove = (e: fabric.IEvent) => {
      const pointer = canvas.getPointer(e.e);
      setCursorPosition({ x: pointer.x, y: pointer.y });
    };

    canvas.on('mouse:move', handleCanvasMouseMove);
    
    // Set up undo/redo keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        if (e.shiftKey) {
          // Ctrl/Cmd + Shift + Z = Redo
          handleRedo();
        } else {
          // Ctrl/Cmd + Z = Undo
          handleUndo();
        }
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);

    // Object added/modified event for history
    canvas.on('object:added', saveToHistory);
    canvas.on('object:modified', saveToHistory);
    canvas.on('object:removed', saveToHistory);
    canvas.on('path:created', saveToHistory);

    // Initialize history
    saveToHistory();

    // Load initial image if provided
    if (initialImage) {
      loadImageToCanvas(canvas, initialImage);
    }

    return () => {
      canvas.dispose();
      document.removeEventListener('paste', handlePaste);
      document.removeEventListener('keydown', handleKeyDown);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      if (saveDebounceRef.current) {
        clearTimeout(saveDebounceRef.current);
      }
    };
  }, [width, height, initialImage]);

  // Save to history function
  const saveToHistory = useCallback(() => {
    if (!fabricCanvas || isUndoRedoAction) return;
    
    // Debounce to prevent too many state saves during drawing
    if (saveDebounceRef.current) {
      clearTimeout(saveDebounceRef.current);
    }
    
    saveDebounceRef.current = setTimeout(() => {
      const canvasState = JSON.stringify(fabricCanvas.toJSON());
      const newHistoryState: HistoryState = {
        canvasState,
        activeLayerId
      };
      
      // If we're in the middle of the history stack, truncate the future states
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(newHistoryState);
      
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }, 300);
  }, [fabricCanvas, history, historyIndex, isUndoRedoAction, activeLayerId]);

  // Setup ethereal background canvas
  useEffect(() => {
    if (!etherealCanvasRef.current) return;
    
    const canvas = etherealCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = width;
    canvas.height = height;
    
    const particles: {x: number, y: number, size: number, speed: number, hue: number}[] = [];
    for (let i = 0; i < 30; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 3 + 0.5,
        speed: Math.random() * 0.2 + 0.1,
        hue: Math.random() * 60 + 200, // Blues and purples
      });
    }
    
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Draw particles
      particles.forEach(particle => {
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 2
        );
        gradient.addColorStop(0, `hsla(${particle.hue}, 100%, 70%, 0.3)`);
        gradient.addColorStop(1, `hsla(${particle.hue}, 100%, 70%, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Move particles slowly
        particle.y -= particle.speed;
        
        // Reset particles at bottom
        if (particle.y < 0) {
          particle.y = height;
          particle.x = Math.random() * width;
        }
        
        // Attract particles to cursor
        const distX = cursorPosition.x - particle.x;
        const distY = cursorPosition.y - particle.y;
        const dist = Math.sqrt(distX * distX + distY * distY);
        
        if (dist < 100) {
          particle.x += distX * 0.02;
          particle.y += distY * 0.02;
        }
      });
      
      // Draw cursor glow
      if (cursorPosition.x > 0 && cursorPosition.y > 0) {
        const gradient = ctx.createRadialGradient(
          cursorPosition.x, cursorPosition.y, 0,
          cursorPosition.x, cursorPosition.y, 80
        );
        gradient.addColorStop(0, `rgba(62, 116, 245, 0.2)`);
        gradient.addColorStop(1, `rgba(62, 116, 245, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(cursorPosition.x, cursorPosition.y, 80, 0, Math.PI * 2);
        ctx.fill();
      }
      
      animationFrameId.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [width, height, cursorPosition]);

  useEffect(() => {
    if (!fabricCanvas) return;

    // Set drawing mode based on tool or brush selection
    if (drawingMode === "pencil" || drawingMode === "spray" || drawingMode === "eraser") {
      fabricCanvas.isDrawingMode = true;
      
      // Apply the brush type
      if (drawingMode === "spray") {
        const sprayBrush = new fabric.SprayBrush(fabricCanvas);
        sprayBrush.color = color;
        sprayBrush.width = brushSize * 2;
        sprayBrush.density = brushSize * 2;
        fabricCanvas.freeDrawingBrush = sprayBrush;
      } else if (drawingMode === "eraser") {
        // Create an eraser brush (essentially a white/background colored brush)
        fabricCanvas.freeDrawingBrush = new fabric.EraserBrush(fabricCanvas);
        fabricCanvas.freeDrawingBrush.width = brushSize;
      } else {
        // Default pencil brush
        fabricCanvas.freeDrawingBrush = new fabric.PencilBrush(fabricCanvas);
        fabricCanvas.freeDrawingBrush.color = color;
        fabricCanvas.freeDrawingBrush.width = brushSize;
      }
    } else {
      fabricCanvas.isDrawingMode = false;
    }
  }, [drawingMode, brushType, color, brushSize, fabricCanvas]);

  const loadImageToCanvas = (canvas: fabric.Canvas, url: string) => {
    fabric.Image.fromURL(url, (img) => {
      // Scale image to fit canvas while maintaining aspect ratio
      const canvasWidth = canvas.getWidth();
      const canvasHeight = canvas.getHeight();
      
      const imgRatio = img.width! / img.height!;
      const canvasRatio = canvasWidth / canvasHeight;
      
      let scaleFactor;
      if (imgRatio > canvasRatio) {
        // Image is wider than canvas
        scaleFactor = canvasWidth / img.width!;
      } else {
        // Image is taller than canvas
        scaleFactor = canvasHeight / img.height!;
      }
      
      img.scale(scaleFactor * 0.9); // Scale to 90% of max to leave space around
      
      // Center the image
      canvas.centerObject(img);
      
      // Add the image to the canvas
      canvas.add(img);
      canvas.sendToBack(img);
      canvas.renderAll();
      
      toast.success("Image loaded successfully");
    }, { crossOrigin: 'Anonymous' });
  };

  const handleDrawingModeChange = (mode: DrawingMode) => {
    setDrawingMode(mode);

    if (!fabricCanvas) return;

    if (mode === "spray" || mode === "eraser" || mode === "pencil") {
      setBrushType(mode);
    } else if (mode === "select") {
      fabricCanvas.isDrawingMode = false;
    } else {
      fabricCanvas.isDrawingMode = false;
      const addShape = () => {
        let shape: fabric.Object;

        if (mode === "rectangle") {
          shape = new fabric.Rect({
            left: 100,
            top: 100,
            fill: color,
            width: 100,
            height: 100,
            stroke: color,
            strokeWidth: 2,
          });
        } else if (mode === "circle") {
          shape = new fabric.Circle({
            left: 100,
            top: 100,
            fill: color,
            radius: 50,
            stroke: color,
            strokeWidth: 2,
          });
        } else { // line
          shape = new fabric.Line([50, 50, 200, 200], {
            stroke: color,
            strokeWidth: brushSize,
          });
        }

        fabricCanvas.add(shape);
        fabricCanvas.setActiveObject(shape);
        saveToHistory();
      };

      addShape();
    }
  };

  // Function to handle the Undo action
  const handleUndo = () => {
    if (historyIndex > 0 && fabricCanvas) {
      setIsUndoRedoAction(true);
      const prevState = history[historyIndex - 1];
      fabricCanvas.loadFromJSON(JSON.parse(prevState.canvasState), () => {
        setHistoryIndex(historyIndex - 1);
        setActiveLayerId(prevState.activeLayerId);
        fabricCanvas.renderAll();
        setIsUndoRedoAction(false);
      });
    } else {
      toast.info("Nothing to undo");
    }
  };

  // Function to handle the Redo action
  const handleRedo = () => {
    if (historyIndex < history.length - 1 && fabricCanvas) {
      setIsUndoRedoAction(true);
      const nextState = history[historyIndex + 1];
      fabricCanvas.loadFromJSON(JSON.parse(nextState.canvasState), () => {
        setHistoryIndex(historyIndex + 1);
        setActiveLayerId(nextState.activeLayerId);
        fabricCanvas.renderAll();
        setIsUndoRedoAction(false);
      });
    } else {
      toast.info("Nothing to redo");
    }
  };

  // Function to add a new layer
  const handleAddLayer = () => {
    if (!fabricCanvas) return;
    
    const newLayerId = `layer-${layers.length + 1}`;
    const newLayer = {
      id: newLayerId,
      name: `Layer ${layers.length + 1}`,
      visible: true,
      canvas: fabricCanvas,
      active: true
    };
    
    // Update all existing layers to be inactive
    const updatedLayers = layers.map(layer => ({
      ...layer,
      active: false
    }));
    
    // Add the new layer
    setLayers([...updatedLayers, newLayer]);
    setActiveLayerId(newLayerId);
    
    // Clear canvas for the new layer
    fabricCanvas.clear();
    fabricCanvas.backgroundColor = "#000000";
    fabricCanvas.renderAll();
    
    saveToHistory();
    
    toast.success(`Added new Layer ${layers.length + 1}`);
  };

  // Function to switch between layers
  const handleSwitchLayer = (layerId: string) => {
    if (!fabricCanvas) return;
    
    // Save current state before switching
    saveToHistory();
    
    // Find the layer to switch to
    const targetLayer = layers.find(layer => layer.id === layerId);
    if (!targetLayer) return;
    
    // Update active state for all layers
    const updatedLayers = layers.map(layer => ({
      ...layer,
      active: layer.id === layerId
    }));
    
    setLayers(updatedLayers);
    setActiveLayerId(layerId);
    
    // Need to implement actual layer switching with appropriate data
    // For now, just a notification
    toast.info(`Switched to ${targetLayer.name}`);
  };

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target?.result && fabricCanvas) {
          loadImageToCanvas(fabricCanvas, event.target.result as string);
          saveToHistory();
        }
      };
      
      reader.readAsDataURL(file);
    }
  };

  const handleClear = () => {
    if (!fabricCanvas) return;
    fabricCanvas.clear();
    fabricCanvas.backgroundColor = "#000000";
    fabricCanvas.renderAll();
    saveToHistory();
  };

  const handleSave = () => {
    if (!fabricCanvas || !onSave) return;
    const dataUrl = fabricCanvas.toDataURL({
      format: 'png',
      quality: 1
    });
    onSave(dataUrl);
  };

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <DrawingToolbar 
        activeMode={drawingMode} 
        onModeChange={handleDrawingModeChange}
        color={color}
        onColorChange={setColor}
        brushSize={brushSize}
        onBrushSizeChange={setBrushSize}
        onClear={handleClear}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onAddLayer={handleAddLayer}
        layers={layers}
        activeLayerId={activeLayerId}
        onSwitchLayer={handleSwitchLayer}
      />
      
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleImageUpload}
          className="flex items-center gap-2"
        >
          <Upload size={16} />
          Upload Image
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2"
          onClick={() => toast.info("You can also paste images from clipboard (Ctrl+V / Cmd+V)")}
        >
          <Clipboard size={16} />
          Paste Image (Ctrl+V)
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleUndo}
          className="flex items-center gap-2"
          title="Undo (Ctrl+Z)"
        >
          <Undo size={16} />
          Undo
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRedo}
          className="flex items-center gap-2"
          title="Redo (Ctrl+Shift+Z)"
        >
          <Redo size={16} />
          Redo
        </Button>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          className="hidden" 
        />
      </div>
      
      <div className="rounded-lg border border-border overflow-hidden bg-black relative">
        {/* Ethereal animated background */}
        <canvas 
          ref={etherealCanvasRef} 
          className="absolute inset-0 pointer-events-none z-0 opacity-60"
        />
        
        {/* Main fabric.js canvas */}
        <div className="relative z-10">
          <canvas ref={canvasRef} />
        </div>
      </div>
      
      {onSave && (
        <div className="flex justify-end mt-2">
          <Button onClick={handleSave}>
            Use Drawing
          </Button>
        </div>
      )}
    </div>
  );
};

export default DrawingCanvas;
