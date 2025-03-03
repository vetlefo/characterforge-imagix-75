
import React, { createContext, useContext, useState, ReactNode } from 'react';

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
}

export const MediaTransformContext = createContext<MediaTransformContextType | undefined>(undefined);

export const MediaTransformProvider = ({ children }: { children: ReactNode }) => {
  const [activeTab, setActiveTab] = useState('style');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [extractedStyles, setExtractedStyles] = useState<any | null>(null);
  const [generatedCode, setGeneratedCode] = useState<{ html: string; css: string; js: string } | null>(null);
  const [generatedAnimation, setGeneratedAnimation] = useState<string | null>(null);

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
