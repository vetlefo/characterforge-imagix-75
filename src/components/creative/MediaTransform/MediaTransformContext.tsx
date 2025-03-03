
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AnimationKeyframe {
  id: string;
  time: number;
  properties: Record<string, string>;
}

interface GeneratedAnimation {
  id: string;
  css: string;
  duration: number;
  timingFunction: string;
  keyframes: AnimationKeyframe[];
}

interface MediaTransformContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  imageUrl: string | null;
  setImageUrl: (url: string | null) => void;
  extractedStyles: any | null;
  setExtractedStyles: (styles: any) => void;
  generatedCode: { html: string; css: string; js: string } | null;
  setGeneratedCode: (code: { html: string; css: string; js: string } | null) => void;
  generatedAnimation: string | null;
  setGeneratedAnimation: (animation: string | null) => void;
  // Adding new properties for AnimationGenerator
  isProcessing: boolean;
  generatedAnimations: GeneratedAnimation[];
  generateAnimationFromImage: (imageUrl: string) => Promise<GeneratedAnimation>;
}

export const MediaTransformContext = createContext<MediaTransformContextType | undefined>(undefined);

export const MediaTransformProvider = ({ children }: { children: ReactNode }) => {
  const [activeTab, setActiveTab] = useState('style');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [extractedStyles, setExtractedStyles] = useState<any | null>(null);
  const [generatedCode, setGeneratedCode] = useState<{ html: string; css: string; js: string } | null>(null);
  const [generatedAnimation, setGeneratedAnimation] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedAnimations, setGeneratedAnimations] = useState<GeneratedAnimation[]>([]);

  // Mock function to generate animation
  const generateAnimationFromImage = async (imageUrl: string): Promise<GeneratedAnimation> => {
    setIsProcessing(true);
    
    // Simulate API call with timeout
    return new Promise((resolve) => {
      setTimeout(() => {
        const newAnimation: GeneratedAnimation = {
          id: `animation-${Date.now()}`,
          css: `@keyframes fadeIn {
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
}

.animated-element {
  animation: fadeIn 1.5s ease-out forwards;
}`,
          duration: 1500,
          timingFunction: 'ease-out',
          keyframes: [
            {
              id: 'keyframe-1',
              time: 0,
              properties: { opacity: '0', transform: 'translateY(20px)' }
            },
            {
              id: 'keyframe-2',
              time: 100,
              properties: { opacity: '1', transform: 'translateY(0)' }
            }
          ]
        };
        
        setGeneratedAnimations(prev => [newAnimation, ...prev]);
        setIsProcessing(false);
        resolve(newAnimation);
      }, 2000);
    });
  };

  return (
    <MediaTransformContext.Provider
      value={{
        activeTab,
        setActiveTab,
        imageUrl,
        setImageUrl,
        extractedStyles,
        setExtractedStyles,
        generatedCode,
        setGeneratedCode,
        generatedAnimation,
        setGeneratedAnimation,
        isProcessing,
        generatedAnimations,
        generateAnimationFromImage
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

export default MediaTransformContext;
