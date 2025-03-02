
import { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import DrawingToolbar from "./DrawingToolbar";
import { Button } from "../ui/button";

export type DrawingMode = "pencil" | "line" | "rectangle" | "circle" | "select";

interface DrawingCanvasProps {
  width?: number;
  height?: number;
  onSave?: (dataUrl: string) => void;
  className?: string;
}

const DrawingCanvas = ({ 
  width = 512, 
  height = 512, 
  onSave,
  className 
}: DrawingCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
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

    return () => {
      canvas.dispose();
    };
  }, [width, height]);

  useEffect(() => {
    if (!fabricCanvas) return;

    fabricCanvas.isDrawingMode = drawingMode === "pencil";
    
    if (fabricCanvas.isDrawingMode) {
      fabricCanvas.freeDrawingBrush.color = color;
      fabricCanvas.freeDrawingBrush.width = brushSize;
    }
  }, [drawingMode, color, brushSize, fabricCanvas]);

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
