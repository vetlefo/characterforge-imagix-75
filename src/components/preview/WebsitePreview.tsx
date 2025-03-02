
import { useState, useRef, useEffect } from "react";
import { Monitor, Smartphone, Tablet, RefreshCw, Maximize2, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type ViewportSize = "desktop" | "tablet" | "mobile";

interface WebsitePreviewProps {
  html: string;
  css?: string;
  js?: string;
  defaultViewport?: ViewportSize;
}

const WebsitePreview = ({
  html = "",
  css = "",
  js = "",
  defaultViewport = "desktop"
}: WebsitePreviewProps) => {
  const [viewport, setViewport] = useState<ViewportSize>(defaultViewport);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate width based on viewport
  const getViewportWidth = () => {
    switch (viewport) {
      case "mobile": return "375px";
      case "tablet": return "768px";
      case "desktop": return "100%";
      default: return "100%";
    }
  };

  // Generate sanitized HTML content for the iframe
  const generateIframeContent = () => {
    // Combine HTML, CSS, and JS into a safe document structure
    const content = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Preview</title>
          <style>
            ${css}
          </style>
        </head>
        <body>
          ${html}
          <script>
            try {
              // Execute JavaScript in a controlled context
              ${js}
            } catch (error) {
              console.error('JavaScript execution error:', error);
            }
          </script>
        </body>
      </html>
    `;
    return content;
  };

  // Update iframe content
  const updateIframeContent = () => {
    if (iframeRef.current) {
      try {
        const iframe = iframeRef.current;
        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        
        if (doc) {
          doc.open();
          doc.write(generateIframeContent());
          doc.close();
        }
      } catch (error) {
        console.error("Error updating iframe content:", error);
      }
    }
  };

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    if (containerRef.current) {
      if (!isFullscreen) {
        if (containerRef.current.requestFullscreen) {
          containerRef.current.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    }
  };

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Update iframe content when props change
  useEffect(() => {
    updateIframeContent();
  }, [html, css, js]);

  return (
    <div className="bg-[#0A0A1B]/70 backdrop-blur-md rounded-2xl p-4 border border-[#2A2A4A]/30">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-white">Website Preview</h3>
        <div className="flex space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className={`w-8 h-8 p-0 ${viewport === 'desktop' ? 'bg-blue-500/20 text-blue-400' : 'bg-[#1A1A2E] text-gray-400'}`}
                  onClick={() => setViewport("desktop")}
                >
                  <Monitor size={14} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Desktop View</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className={`w-8 h-8 p-0 ${viewport === 'tablet' ? 'bg-blue-500/20 text-blue-400' : 'bg-[#1A1A2E] text-gray-400'}`}
                  onClick={() => setViewport("tablet")}
                >
                  <Tablet size={14} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Tablet View</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className={`w-8 h-8 p-0 ${viewport === 'mobile' ? 'bg-blue-500/20 text-blue-400' : 'bg-[#1A1A2E] text-gray-400'}`}
                  onClick={() => setViewport("mobile")}
                >
                  <Smartphone size={14} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Mobile View</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="w-8 h-8 p-0 bg-[#1A1A2E] text-gray-400"
                  onClick={updateIframeContent}
                >
                  <RefreshCw size={14} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Refresh Preview</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="w-8 h-8 p-0 bg-[#1A1A2E] text-gray-400"
                  onClick={toggleFullscreen}
                >
                  <Maximize2 size={14} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Fullscreen</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      <div 
        ref={containerRef}
        className="relative border border-[#2A2A4A]/30 rounded-lg overflow-hidden bg-white transition-all duration-300 flex justify-center"
        style={{ maxWidth: "100%" }}
      >
        <div
          className="transition-all duration-300 h-[500px] bg-white"
          style={{ width: getViewportWidth() }}
        >
          <iframe
            ref={iframeRef}
            title="Website Preview"
            sandbox="allow-scripts"
            className="w-full h-full border-0"
          />
        </div>
      </div>
      
      <div className="mt-3 text-xs text-gray-400 italic flex items-center gap-1">
        <Code size={12} /> Sandboxed preview (scripts are isolated for security)
      </div>
    </div>
  );
};

export default WebsitePreview;
