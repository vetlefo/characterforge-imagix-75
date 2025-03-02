
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DrawingEditor from './pages/DrawingEditor';
import { StyleSystem } from './components/creative/StyleSystem/StyleSystem';
import { StyleSystemProvider } from './components/creative/StyleSystem/StyleSystemContext';
import AnimationPreviewPage from './pages/AnimationPreviewPage';
import Index from './pages/Index';
import WebsitePreviewDemo from './pages/WebsitePreviewDemo';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/drawing" element={<DrawingEditor />} />
        <Route path="/style-system" element={
          <StyleSystemProvider>
            <StyleSystem />
          </StyleSystemProvider>
        } />
        <Route path="/animation" element={<AnimationPreviewPage />} />
        <Route path="/website-preview" element={<WebsitePreviewDemo />} />
      </Routes>
    </Router>
  );
}

export default App;
