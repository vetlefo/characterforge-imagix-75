
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Asset } from '../types';
import { ExtractedStyle, GeneratedCode, GeneratedAnimation } from './types';

interface MediaTransformContextType {
  // Style extraction
  extractedStyles: ExtractedStyle[];
  extractStyleFromImage: (imageUrl: string) => Promise<ExtractedStyle>;
  applyExtractedStyle: (style: ExtractedStyle) => void;
  
  // Code generation
  generatedCode: GeneratedCode[];
  generateCodeFromVisual: (asset: Asset) => Promise<GeneratedCode>;
  
  // Animation generation
  generatedAnimations: GeneratedAnimation[];
  generateAnimationFromImage: (imageUrl: string) => Promise<GeneratedAnimation>;
  
  // General state
  isProcessing: boolean;
  processingError: string | null;
}

const MediaTransformContext = createContext<MediaTransformContextType | undefined>(undefined);

export const MediaTransformProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [extractedStyles, setExtractedStyles] = useState<ExtractedStyle[]>([]);
  const [generatedCode, setGeneratedCode] = useState<GeneratedCode[]>([]);
  const [generatedAnimations, setGeneratedAnimations] = useState<GeneratedAnimation[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingError, setProcessingError] = useState<string | null>(null);

  const extractStyleFromImage = async (imageUrl: string): Promise<ExtractedStyle> => {
    setIsProcessing(true);
    setProcessingError(null);
    
    try {
      // Simulate style extraction with dominant colors and patterns
      const newStyle: ExtractedStyle = {
        id: `style-${Date.now()}`,
        sourceImageUrl: imageUrl,
        colors: {
          dominant: '#3b82f6',
          palette: ['#3b82f6', '#1e40af', '#dbeafe', '#172554', '#f8fafc'],
          background: '#f8fafc',
          text: '#172554',
          accent: '#3b82f6'
        },
        typography: {
          fontFamily: 'Inter, sans-serif',
          headingSize: '1.875rem',
          bodySize: '1rem',
          lineHeight: 1.5
        },
        spacing: {
          padding: '1rem',
          margin: '1rem',
          gap: '0.5rem'
        },
        extractedAt: new Date()
      };
      
      setExtractedStyles(prev => [...prev, newStyle]);
      return newStyle;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error during style extraction';
      setProcessingError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const applyExtractedStyle = (style: ExtractedStyle) => {
    // In a real implementation, this would update the application's theme
    console.log('Applying extracted style:', style);
  };

  const generateCodeFromVisual = async (asset: Asset): Promise<GeneratedCode> => {
    setIsProcessing(true);
    setProcessingError(null);
    
    try {
      // Simulate code generation based on visual elements
      const newCode: GeneratedCode = {
        id: `code-${Date.now()}`,
        sourceAssetId: asset.id,
        html: `<div class="card">
  <div class="card-header">
    <h2>Generated Component</h2>
  </div>
  <div class="card-body">
    <p>This component was generated from the image.</p>
    <button class="btn">Learn More</button>
  </div>
</div>`,
        css: `.card {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background-color: white;
}
.card-header {
  background-color: #3b82f6;
  color: white;
  padding: 1rem;
}
.card-body {
  padding: 1rem;
}
.btn {
  background-color: #3b82f6;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  cursor: pointer;
}`,
        generatedAt: new Date()
      };
      
      setGeneratedCode(prev => [...prev, newCode]);
      return newCode;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error during code generation';
      setProcessingError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const generateAnimationFromImage = async (imageUrl: string): Promise<GeneratedAnimation> => {
    setIsProcessing(true);
    setProcessingError(null);
    
    try {
      // Simulate animation generation from static image
      const newAnimation: GeneratedAnimation = {
        id: `animation-${Date.now()}`,
        sourceImageUrl: imageUrl,
        keyframes: [
          {
            id: '1',
            time: 0,
            properties: {
              opacity: '0',
              transform: 'translateY(20px)'
            }
          },
          {
            id: '2',
            time: 100,
            properties: {
              opacity: '1',
              transform: 'translateY(0)'
            }
          }
        ],
        duration: 1000,
        timingFunction: 'ease-out',
        css: `@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animated-element {
  animation: fadeIn 1s ease-out;
}`,
        generatedAt: new Date()
      };
      
      setGeneratedAnimations(prev => [...prev, newAnimation]);
      return newAnimation;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error during animation generation';
      setProcessingError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <MediaTransformContext.Provider
      value={{
        extractedStyles,
        extractStyleFromImage,
        applyExtractedStyle,
        generatedCode,
        generateCodeFromVisual,
        generatedAnimations,
        generateAnimationFromImage,
        isProcessing,
        processingError
      }}
    >
      {children}
    </MediaTransformContext.Provider>
  );
};

export const useMediaTransform = () => {
  const context = useContext(MediaTransformContext);
  if (context === undefined) {
    throw new Error('useMediaTransform must be used within a MediaTransformProvider');
  }
  return context;
};
