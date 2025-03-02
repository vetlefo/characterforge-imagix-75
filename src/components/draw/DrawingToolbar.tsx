
import { MousePointer, Pencil, Square, Circle, Minus, Trash2, Undo, Redo, Layers, Plus, Paintbrush, Eraser } from "lucide-react";
import { Button } from "../ui/button";
import { DrawingMode } from "./DrawingCanvas";
import { Slider } from "../ui/slider";
import { cn } from "@/lib/utils";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "../ui/dropdown-menu";

interface Layer {
  id: string;
  name: string;
  visible: boolean;
  active: boolean;
}

interface DrawingToolbarProps {
  activeMode: DrawingMode;
  onModeChange: (mode: DrawingMode) => void;
  color: string;
  onColorChange: (color: string) => void;
  brushSize: number;
  onBrushSizeChange: (size: number) => void;
  onClear: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onAddLayer: () => void;
  layers: Layer[];
  activeLayerId: string;
  onSwitchLayer: (layerId: string) => void;
}

const colorOptions = [
  "#ffffff", // white
  "#ff3b30", // red
  "#ff9500", // orange
  "#ffcc00", // yellow
  "#4cd964", // green
  "#5ac8fa", // blue
  "#007aff", // dark blue
  "#5856d6", // purple
  "#ff2d55", // pink
];

const DrawingToolbar = ({
  activeMode,
  onModeChange,
  color,
  onColorChange,
  brushSize,
  onBrushSizeChange,
  onClear,
  onUndo,
  onRedo,
  onAddLayer,
  layers,
  activeLayerId,
  onSwitchLayer
}: DrawingToolbarProps) => {
  return (
    <div className="flex gap-4 p-2 rounded-lg border border-border bg-muted flex-wrap items-center">
      <div className="flex gap-1">
        <Button
          size="icon"
          variant={activeMode === "select" ? "default" : "outline"}
          onClick={() => onModeChange("select")}
          className="h-9 w-9"
          type="button"
          title="Select"
        >
          <MousePointer size={16} />
        </Button>
        <Button
          size="icon"
          variant={activeMode === "pencil" ? "default" : "outline"}
          onClick={() => onModeChange("pencil")}
          className="h-9 w-9"
          type="button"
          title="Pencil"
        >
          <Pencil size={16} />
        </Button>
        <Button
          size="icon"
          variant={activeMode === "spray" ? "default" : "outline"}
          onClick={() => onModeChange("spray")}
          className="h-9 w-9"
          type="button"
          title="Spray Brush"
        >
          <Paintbrush size={16} />
        </Button>
        <Button
          size="icon"
          variant={activeMode === "eraser" ? "default" : "outline"}
          onClick={() => onModeChange("eraser")}
          className="h-9 w-9"
          type="button"
          title="Eraser"
        >
          <Eraser size={16} />
        </Button>
        <Button
          size="icon"
          variant={activeMode === "line" ? "default" : "outline"}
          onClick={() => onModeChange("line")}
          className="h-9 w-9"
          type="button"
          title="Line"
        >
          <Minus size={16} />
        </Button>
        <Button
          size="icon"
          variant={activeMode === "rectangle" ? "default" : "outline"}
          onClick={() => onModeChange("rectangle")}
          className="h-9 w-9"
          type="button"
          title="Rectangle"
        >
          <Square size={16} />
        </Button>
        <Button
          size="icon"
          variant={activeMode === "circle" ? "default" : "outline"}
          onClick={() => onModeChange("circle")}
          className="h-9 w-9"
          type="button"
          title="Circle"
        >
          <Circle size={16} />
        </Button>
      </div>

      <div className="h-8 w-px bg-border mx-1" />

      <div className="flex gap-1">
        {colorOptions.map((c) => (
          <button
            key={c}
            onClick={() => onColorChange(c)}
            className={cn(
              "w-6 h-6 rounded-full border transition-transform",
              color === c ? "border-white scale-110" : "border-transparent"
            )}
            style={{ backgroundColor: c }}
            title={`Color: ${c}`}
          />
        ))}
      </div>

      <div className="h-8 w-px bg-border mx-1" />

      <div className="flex items-center gap-2">
        <span className="text-xs">Size:</span>
        <Slider
          className="w-24"
          value={[brushSize]}
          min={1}
          max={50}
          step={1}
          onValueChange={(value) => onBrushSizeChange(value[0])}
        />
        <span className="text-xs w-6">{brushSize}px</span>
      </div>

      <div className="h-8 w-px bg-border mx-1" />
      
      <div className="flex gap-1">
        <Button
          size="icon"
          variant="outline"
          onClick={onUndo}
          className="h-9 w-9"
          type="button"
          title="Undo (Ctrl+Z)"
        >
          <Undo size={16} />
        </Button>
        <Button
          size="icon"
          variant="outline"
          onClick={onRedo}
          className="h-9 w-9"
          type="button"
          title="Redo (Ctrl+Shift+Z)"
        >
          <Redo size={16} />
        </Button>
      </div>

      <div className="h-8 w-px bg-border mx-1" />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center gap-2 h-9"
            type="button"
            title="Layers"
          >
            <Layers size={16} />
            <span className="text-xs">Layers</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Manage Layers</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={activeLayerId} onValueChange={onSwitchLayer}>
            {layers.map(layer => (
              <DropdownMenuRadioItem key={layer.id} value={layer.id} className="flex items-center justify-between">
                {layer.name}
                {layer.active && <span className="text-xs text-blue-500 font-medium">Active</span>}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
          <DropdownMenuSeparator />
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-2 text-sm h-8" 
            onClick={onAddLayer}
          >
            <Plus size={14} />
            Add New Layer
          </Button>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="h-8 w-px bg-border mx-1" />

      <Button
        size="icon"
        variant="destructive"
        onClick={onClear}
        className="h-9 w-9"
        type="button"
        title="Clear Canvas"
      >
        <Trash2 size={16} />
      </Button>
    </div>
  );
};

export default DrawingToolbar;
