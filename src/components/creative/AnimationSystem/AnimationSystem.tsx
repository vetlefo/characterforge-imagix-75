
import React from 'react';
import { AnimationProvider } from './AnimationContext';
import AnimationPreview from './AnimationPreview';
import AnimationEditor from './AnimationEditor';

const AnimationSystem: React.FC = () => {
  return (
    <AnimationProvider>
      <div className="space-y-6">
        <AnimationPreview />
        <AnimationEditor />
      </div>
    </AnimationProvider>
  );
};

export default AnimationSystem;
