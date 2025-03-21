
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
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const DrawingModule = ({
  onDrawingComplete,
  triggerLabel = "Open Drawing Canvas",
  modalTitle = "Create Your Drawing",
  width = 512,
  height = 512,
  initialImage = null,
  open: controlledOpen,
  onOpenChange
}: DrawingModuleProps) => {
  const [internalOpen, setInternalOpen] = useState(false);

  // Use either controlled or uncontrolled state
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = (value: boolean) => {
    if (onOpenChange) {
      onOpenChange(value);
    } else {
      setInternalOpen(value);
    }
  };

  const handleSave = (dataUrl: string) => {
    onDrawingComplete(dataUrl);
    setOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm">
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl bg-[#0A0A1B]/90 backdrop-blur-lg border-blue-900/30">
        <DialogHeader>
          <DialogTitle>{modalTitle}</DialogTitle>
        </DialogHeader>
        <DrawingCanvas width={width} height={height} onSave={handleSave} initialImage={initialImage} />
      </DialogContent>
    </Dialog>
  );
};

export default DrawingModule;
