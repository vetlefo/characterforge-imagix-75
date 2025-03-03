import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCreative } from "./CreativeContext";
import { Link } from "react-router-dom";
import { X, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Settings, Layers, PanelLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

interface UnifiedLayoutProps {
  children: React.ReactNode;
  contextualTools?: React.ReactNode;
  mode?: "drawing" | "animation" | "style" | "website" | "transform";
  toolbarPosition?: "left" | "right" | "bottom";
  showToolbar?: boolean;
  title?: string;
}

export const UnifiedLayout = ({
  children,
  contextualTools,
  mode = "drawing",
  toolbarPosition = "left",
  showToolbar = true,
  title = "Creative Canvas"
}: UnifiedLayoutProps) => {
  const { currentIntent } = useCreative();
  const [isToolbarCollapsed, setIsToolbarCollapsed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Resize handler for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768 && !isToolbarCollapsed) {
        setIsToolbarCollapsed(true);
      }
    };
    
    window.addEventListener("resize", handleResize);
    handleResize(); // Check on initial render
    
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isToolbarCollapsed]);

  // Toggle toolbar visibility
  const toggleToolbar = () => {
    setIsToolbarCollapsed(!isToolbarCollapsed);
  };

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Get background color based on creative mode
  const getModeBgColor = () => {
    switch (mode) {
      case "drawing": return "bg-gradient-to-br from-[#0F0F23] to-[#1A1A2E]";
      case "animation": return "bg-gradient-to-br from-[#0F1623] to-[#1A253E]";
      case "style": return "bg-gradient-to-br from-[#0F2316] to-[#1A3E2E]";
      case "website": return "bg-gradient-to-br from-[#23170F] to-[#3E291A]";
      case "transform": return "bg-gradient-to-br from-[#1F0F23] to-[#352A3E]";
      default: return "bg-[#0F0F23]";
    }
  };

  // Toolbar class based on position
  const getToolbarClassName = () => {
    const baseClasses = cn(
      "transition-all duration-300 bg-[#0A0A1B] border-[#1A1A2E] z-10",
      isToolbarCollapsed ? "w-16" : "w-72"
    );
    
    switch (toolbarPosition) {
      case "left": return cn(baseClasses, "h-full border-r");
      case "right": return cn(baseClasses, "h-full border-l"); 
      case "bottom": return cn(
        "transition-all duration-300 bg-[#0A0A1B] border-t border-[#1A1A2E] z-10",
        isToolbarCollapsed ? "h-16" : "h-72", 
        "w-full"
      );
      default: return baseClasses;
    }
  };

  return (
    <div className={cn(
      "min-h-screen flex flex-col", 
      getModeBgColor(),
      isFullscreen ? "fixed inset-0 z-50" : ""
    )}>
      {/* Header */}
      <header className="bg-[#0A0A1B]/80 backdrop-blur-sm border-b border-[#1A1A2E] p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild className="rounded-full">
            <Link to="/">
              <ChevronLeft size={18} />
            </Link>
          </Button>
          <h1 className="text-xl font-medium text-white">{title}</h1>
          {currentIntent && (
            <div className="badge badge-purple ml-2">
              {currentIntent}
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={toggleFullscreen} 
            className="rounded-full"
          >
            {isFullscreen ? (
              <X size={18} />
            ) : (
              <div className="w-4 h-4 border-2 border-current" />
            )}
          </Button>
          
          <Button 
            variant="outline" 
            size="icon" 
            onClick={toggleToolbar} 
            className="rounded-full md:hidden"
          >
            <PanelLeft size={18} />
          </Button>
        </div>
      </header>
      
      <div className={cn(
        "flex flex-1 relative",
        toolbarPosition === "bottom" && "flex-col"
      )}>
        {/* Toolbar - positioned based on toolbarPosition */}
        {showToolbar && toolbarPosition === "left" && (
          <motion.div 
            className={getToolbarClassName()}
            initial={{ width: isToolbarCollapsed ? 64 : 288 }}
            animate={{ width: isToolbarCollapsed ? 64 : 288 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-4 flex justify-end">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleToolbar} 
                className="rounded-full"
              >
                {isToolbarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
              </Button>
            </div>
            
            <AnimatePresence mode="wait">
              {!isToolbarCollapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="p-4"
                >
                  {contextualTools}
                </motion.div>
              )}
            </AnimatePresence>
            
            {isToolbarCollapsed && (
              <div className="flex flex-col items-center gap-4 p-2">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Layers size={18} />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Settings size={18} />
                </Button>
              </div>
            )}
          </motion.div>
        )}
        
        {/* Similar sections for right and bottom toolbar positions */}
        {showToolbar && toolbarPosition === "right" && (
          <motion.div 
            className={getToolbarClassName()}
            initial={{ width: isToolbarCollapsed ? 64 : 288 }}
            animate={{ width: isToolbarCollapsed ? 64 : 288 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-4 flex justify-start">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleToolbar} 
                className="rounded-full"
              >
                {isToolbarCollapsed ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
              </Button>
            </div>
            
            <AnimatePresence mode="wait">
              {!isToolbarCollapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="p-4"
                >
                  {contextualTools}
                </motion.div>
              )}
            </AnimatePresence>
            
            {isToolbarCollapsed && (
              <div className="flex flex-col items-center gap-4 p-2">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Layers size={18} />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Settings size={18} />
                </Button>
              </div>
            )}
          </motion.div>
        )}
        
        {showToolbar && toolbarPosition === "bottom" && (
          <motion.div 
            className={getToolbarClassName()}
            initial={{ height: isToolbarCollapsed ? 64 : 288 }}
            animate={{ height: isToolbarCollapsed ? 64 : 288 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-4 flex justify-center">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleToolbar} 
                className="rounded-full"
              >
                {isToolbarCollapsed ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </Button>
            </div>
            
            <AnimatePresence mode="wait">
              {!isToolbarCollapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="p-4"
                >
                  {contextualTools}
                </motion.div>
              )}
            </AnimatePresence>
            
            {isToolbarCollapsed && (
              <div className="flex justify-center gap-4 p-2">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Layers size={18} />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Settings size={18} />
                </Button>
              </div>
            )}
          </motion.div>
        )}
        
        {/* Main content area with canvas and workspace */}
        <motion.main 
          className="flex-1 p-6 transition-all duration-300"
          layout
        >
          <motion.div 
            className="w-full h-full"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </motion.main>
      </div>
    </div>
  );
};

export default UnifiedLayout;
