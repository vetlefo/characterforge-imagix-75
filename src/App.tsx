
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import DrawingEditor from './pages/DrawingEditor';
import { StyleSystem } from './components/creative/StyleSystem/StyleSystem';
import { StyleSystemProvider } from './components/creative/StyleSystem/StyleSystemContext';
import AnimationPreviewPage from './pages/AnimationPreviewPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AnimationPreviewPage />} />
        <Route path="/drawing" element={<DrawingEditor />} />
        <Route path="/style-system" element={
          <StyleSystemProvider>
            <StyleSystem />
          </StyleSystemProvider>
        } />
        <Route path="/animation" element={<AnimationPreviewPage />} />
      </Routes>
    </Router>
  );
}

export default App;
