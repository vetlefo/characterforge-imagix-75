
import { useState } from "react";
import DrawingCanvas from "./DrawingCanvas";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { Sparkles } from "lucide-react";

interface DrawingModuleProps {
  onDrawingComplete: (dataUrl: string) => void;
  triggerLabel?: string;
  modalTitle?: string;
  width?: number;
  height?: number;
  initialImage?: string | null;
  // Internal state management only - not exposed in props
}

const DrawingModule = ({
  onDrawingComplete,
  triggerLabel = "Open Drawing Canvas",
  modalTitle = "Create Your Drawing",
  width = 512,
  height = 512,
  initialImage = null
}: DrawingModuleProps) => {
  const [open, setOpen] = useState(false);

  const handleSave = (dataUrl: string) => {
    onDrawingComplete(dataUrl);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 bg-opacity-20 border-blue-500/30 hover:border-blue-400/50 backdrop-blur-sm">
          <Sparkles size={16} className="text-blue-400" />
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl bg-[#0A0A1B]/90 backdrop-blur-lg border-blue-900/30">
        <DialogHeader>
          <DialogTitle>{modalTitle}</DialogTitle>
        </DialogHeader>
        <DrawingCanvas 
          width={width} 
          height={height} 
          onSave={handleSave}
          initialImage={initialImage}
        />
      </DialogContent>
    </Dialog>
  );
};

export default DrawingModule;
