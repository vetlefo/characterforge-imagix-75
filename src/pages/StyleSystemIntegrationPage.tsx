
import React from 'react';
import { StyleSystemProvider } from '../components/creative/StyleSystem/StyleSystemContext';
import { StyleSystemIntegration } from '../components/creative/StyleSystem/StyleSystemIntegration';
import CreativeSpace from '../components/creative/CreativeSpace';

const StyleSystemIntegrationPage: React.FC = () => {
  return (
    <CreativeSpace>
      <div className="container mx-auto py-6 px-4">
        <h1 className="text-2xl font-bold mb-6">Style System Integration</h1>
        
        <StyleSystemProvider>
          <StyleSystemIntegration />
        </StyleSystemProvider>
      </div>
    </CreativeSpace>
  );
};

export default StyleSystemIntegrationPage;
