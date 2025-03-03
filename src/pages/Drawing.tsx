
import React from 'react';
import DrawingModule from '../components/draw/DrawingModule';

const Drawing = () => {
  const handleDrawingComplete = (dataUrl: string) => {
    console.log('Drawing completed:', dataUrl);
  };

  return <DrawingModule onDrawingComplete={handleDrawingComplete} />;
};

export default Drawing;
