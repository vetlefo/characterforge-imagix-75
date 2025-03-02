
import { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import DrawingToolbar from "./DrawingToolbar";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { Upload, Clipboard } from "lucide-react";

export type DrawingMode = "pencil" | "line" | "rectangle" | "circle" | "select";

interface DrawingCanvasProps {
  width?: number;
  height?: number;
  onSave?: (dataUrl: string) => void;
  className?: string;
  initialImage?: string | null;
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
  const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas | null>(null);
  const [drawingMode, setDrawingMode] = useState<DrawingMode>("pencil");
  const [color, setColor] = useState("#ffffff");
  const [brushSize, setBrushSize] = useState(5);

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

    // Load initial image if provided
    if (initialImage) {
      loadImageToCanvas(canvas, initialImage);
    }

    return () => {
      canvas.dispose();
      document.removeEventListener('paste', handlePaste);
    };
  }, [width, height, initialImage]);

  useEffect(() => {
    if (!fabricCanvas) return;

    fabricCanvas.isDrawingMode = drawingMode === "pencil";
    
    if (fabricCanvas.isDrawingMode) {
      fabricCanvas.freeDrawingBrush.color = color;
      fabricCanvas.freeDrawingBrush.width = brushSize;
    }
  }, [drawingMode, color, brushSize, fabricCanvas]);

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

    if (mode === "select") {
      fabricCanvas.isDrawingMode = false;
    } else if (mode === "pencil") {
      fabricCanvas.isDrawingMode = true;
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
      };

      addShape();
    }
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
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          className="hidden" 
        />
      </div>
      
      <div className="rounded-lg border border-border overflow-hidden bg-black">
        <canvas ref={canvasRef} />
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
