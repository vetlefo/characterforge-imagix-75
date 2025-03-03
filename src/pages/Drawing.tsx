
import React from 'react';
import DrawingModule from '../components/draw/DrawingModule';

// Add a placeholder implementation to satisfy TypeScript
interface DrawingModuleProps {
  onDrawingComplete: (dataUrl: string) => void;
}

const Drawing = () => {
  const handleDrawingComplete = (dataUrl: string) => {
    console.log('Drawing completed:', dataUrl);
  };

  return <DrawingModule onDrawingComplete={handleDrawingComplete} />;
};

export default Drawing;
