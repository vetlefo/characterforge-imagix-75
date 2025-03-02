import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import DrawingEditor from './pages/DrawingEditor';
import StyleSystem from './components/creative/StyleSystem/StyleSystem';
import { StyleSystemProvider } from './components/creative/StyleSystem/StyleSystemContext';
import CreativeSandbox from './pages/CreativeSandbox';
import AnimationPreviewPage from './pages/AnimationPreviewPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CreativeSandbox />} />
        <Route path="/drawing" element={<DrawingEditor />} />
        <Route path="/style-system" element={
          <StyleSystemProvider>
            <StyleSystem />
          </StyleSystemProvider>
        } />
        
        {/* Update the routes to include the AnimationPreviewPage */}
        <Route path="/animation" element={<AnimationPreviewPage />} />
      </Routes>
    </Router>
  );
}

export default App;
