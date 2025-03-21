
import React from 'react';
import WebsitePreview from '../components/preview/WebsitePreview';
import Layout from '../components/Layout';
import SimpleCollaborationVisualizer from '../components/creative/SimpleCollaborationVisualizer';

const Website = () => {
  return (
    <Layout>
      <div className="p-8 bg-[#0F0F23] min-h-screen">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-white">Website Preview</h1>
          <WebsitePreview html="<h1>Website Preview</h1>" css="" js="" />
        </div>
      </div>
      <SimpleCollaborationVisualizer />
    </Layout>
  );
};

export default Website;
