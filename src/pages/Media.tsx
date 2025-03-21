
import React from 'react';
import { MediaTransform } from '../components/creative/MediaTransform';
import Layout from '../components/Layout';
import SimpleCollaborationVisualizer from '../components/creative/SimpleCollaborationVisualizer';

const Media = () => {
  return (
    <Layout>
      <div className="p-8 bg-[#0F0F23] min-h-screen">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-white">Media Studio</h1>
          <MediaTransform />
        </div>
      </div>
      <SimpleCollaborationVisualizer />
    </Layout>
  );
};

export default Media;
