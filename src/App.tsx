
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import DrawingEditor from './pages/DrawingEditor';
import WebsitePreviewDemo from './pages/WebsitePreviewDemo';
import AssetLibraryPage from './pages/AssetLibraryPage';
import AnimationPreviewPage from './pages/AnimationPreviewPage';
import NotFound from './pages/NotFound';
import StyleSystemPage from './pages/StyleSystemPage';
import StyleSystemIntegrationPage from './pages/StyleSystemIntegrationPage';
import MediaTransformPage from './pages/MediaTransformPage';

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/drawing" element={<DrawingEditor />} />
        <Route path="/website-preview" element={<WebsitePreviewDemo />} />
        <Route path="/assets" element={<AssetLibraryPage />} />
        <Route path="/animation" element={<AnimationPreviewPage />} />
        <Route path="/style-system" element={<StyleSystemPage />} />
        <Route path="/style-system-integration" element={<StyleSystemIntegrationPage />} />
        <Route path="/media-transform" element={<MediaTransformPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
