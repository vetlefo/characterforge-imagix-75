
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const Documentation: React.FC = () => {
  return (
    <Alert className="mt-6">
      <AlertTitle>Command Parser Documentation</AlertTitle>
      <AlertDescription>
        <p className="mb-2">The enhanced Command Parser system supports the following features:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Natural language command parsing</li>
          <li>Intent classification with confidence scores</li>
          <li>Parameter extraction (colors, sizes, shapes, etc.)</li>
          <li>Domain detection (drawing, styling, animation, etc.)</li>
          <li>Confirmation with command preview</li>
          <li>Clarification requests for ambiguous commands</li>
        </ul>
      </AlertDescription>
    </Alert>
  );
};

export default Documentation;
