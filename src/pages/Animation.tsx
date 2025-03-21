
import React from 'react';
import { AnimationSystem } from '../components/creative/AnimationSystem';
import Layout from '../components/Layout';
import SimpleCollaborationVisualizer from '../components/creative/SimpleCollaborationVisualizer';

const Animation = () => {
  return (
    <Layout>
      <div className="p-8 bg-[#0F0F23] min-h-screen">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-white">Animation Studio</h1>
          <AnimationSystem />
        </div>
      </div>
      <SimpleCollaborationVisualizer />
    </Layout>
  );
};

export default Animation;
