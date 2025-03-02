
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  ColorPalette, 
  Typography, 
  SpacingSystem, 
  StyleSystemContextType 
} from './types';
import { 
  defaultPalettes, 
  defaultTypography, 
  defaultSpacing 
} from './defaultStyles';
import { useCreative } from '../CreativeContext';

const StyleSystemContext = createContext<StyleSystemContextType | undefined>(undefined);

export const useStyleSystem = () => {
  const context = useContext(StyleSystemContext);
  if (context === undefined) {
    throw new Error('useStyleSystem must be used within a StyleSystemProvider');
  }
  return context;
};

export const StyleSystemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { updateAsset } = useCreative();
  
  const [activePalette, setActivePalette] = useState<ColorPalette>(defaultPalettes[0]);
  const [palettes, setPalettes] = useState<ColorPalette[]>(defaultPalettes);
  
  const [activeTypography, setActiveTypography] = useState<Typography>(defaultTypography[0]);
  const [typographyOptions, setTypographyOptions] = useState<Typography[]>(defaultTypography);
  
  const [activeSpacing, setActiveSpacing] = useState<SpacingSystem>(defaultSpacing[0]);
  const [spacingOptions, setSpacingOptions] = useState<SpacingSystem[]>(defaultSpacing);

  // Load saved styles from localStorage on mount
  useEffect(() => {
    const savedStyles = localStorage.getItem('styleSystem');
    if (savedStyles) {
      try {
        const { 
          activePalette: savedPalette,
          palettes: savedPalettes,
          activeTypography: savedTypography,
          typographyOptions: savedTypographyOptions,
          activeSpacing: savedSpacing,
          spacingOptions: savedSpacingOptions
        } = JSON.parse(savedStyles);

        if (savedPalette) setActivePalette(savedPalette);
        if (savedPalettes) setPalettes(savedPalettes);
        if (savedTypography) setActiveTypography(savedTypography);
        if (savedTypographyOptions) setTypographyOptions(savedTypographyOptions);
        if (savedSpacing) setActiveSpacing(savedSpacing);
        if (savedSpacingOptions) setSpacingOptions(savedSpacingOptions);
      } catch (error) {
        console.error('Failed to parse saved styles:', error);
      }
    }
  }, []);

  // Save styles to localStorage when they change
  useEffect(() => {
    localStorage.setItem('styleSystem', JSON.stringify({
      activePalette,
      palettes,
      activeTypography,
      typographyOptions,
      activeSpacing,
      spacingOptions
    }));
  }, [
    activePalette, 
    palettes, 
    activeTypography, 
    typographyOptions, 
    activeSpacing, 
    spacingOptions
  ]);

  const addCustomPalette = (palette: ColorPalette) => {
    setPalettes(prev => [...prev, palette]);
    setActivePalette(palette);
  };

  const addCustomTypography = (typography: Typography) => {
    setTypographyOptions(prev => [...prev, typography]);
    setActiveTypography(typography);
  };

  const addCustomSpacing = (spacing: SpacingSystem) => {
    setSpacingOptions(prev => [...prev, spacing]);
    setActiveSpacing(spacing);
  };

  const applyStylesToElement = (elementId: string, styles: Partial<{
    color: string;
    backgroundColor: string;
    fontFamily: string;
    fontSize: string;
    fontWeight: string;
    padding: string;
    margin: string;
  }>) => {
    updateAsset(elementId, prevAsset => {
      if (!prevAsset) return prevAsset;
      
      return {
        ...prevAsset,
        styles: {
          ...prevAsset.styles,
          ...styles
        }
      };
    });
  };

  const value = {
    activePalette,
    palettes,
    activeTypography,
    typographyOptions,
    activeSpacing,
    spacingOptions,
    setActivePalette,
    setActiveTypography,
    setActiveSpacing,
    addCustomPalette,
    addCustomTypography,
    addCustomSpacing,
    applyStylesToElement
  };

  return (
    <StyleSystemContext.Provider value={value}>
      {children}
    </StyleSystemContext.Provider>
  );
};
