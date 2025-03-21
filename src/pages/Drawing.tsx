
import React from 'react';
import DrawingModule from '../components/draw/DrawingModule';
import Layout from '../components/Layout';
import SimpleCollaborationVisualizer from '../components/creative/SimpleCollaborationVisualizer';

const Drawing = () => {
  const handleDrawingComplete = (dataUrl: string) => {
    console.log('Drawing completed:', dataUrl);
  };

  return (
    <Layout>
      <div className="p-8 bg-[#0F0F23] min-h-screen">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-white">Drawing Studio</h1>
          <DrawingModule onDrawingComplete={handleDrawingComplete} />
        </div>
      </div>
      <SimpleCollaborationVisualizer />
    </Layout>
  );
};

export default Drawing;
