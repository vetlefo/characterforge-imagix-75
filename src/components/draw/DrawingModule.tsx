
import { useState } from "react";
import DrawingCanvas from "./DrawingCanvas";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { PencilRuler } from "lucide-react";

interface DrawingModuleProps {
  onDrawingComplete: (dataUrl: string) => void;
  triggerLabel?: string;
  modalTitle?: string;
  width?: number;
  height?: number;
}

const DrawingModule = ({
  onDrawingComplete,
  triggerLabel = "Open Drawing Canvas",
  modalTitle = "Create Your Drawing",
  width = 512,
  height = 512
}: DrawingModuleProps) => {
  const [open, setOpen] = useState(false);

  const handleSave = (dataUrl: string) => {
    onDrawingComplete(dataUrl);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <PencilRuler size={16} />
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{modalTitle}</DialogTitle>
        </DialogHeader>
        <DrawingCanvas 
          width={width} 
          height={height} 
          onSave={handleSave} 
        />
      </DialogContent>
    </Dialog>
  );
};

export default DrawingModule;
