
import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { defaultPalettes, defaultTypography, defaultSpacing } from './defaultStyles';
import { ColorPalette, Typography, Spacing, Theme, StyleSystemContextType } from './types';
import { useCreative } from '../CreativeContext';
import { Asset, AssetUpdateData } from '../types';

const StyleSystemContext = createContext<StyleSystemContextType | undefined>(undefined);

export const StyleSystemProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { assets, addAsset, updateAsset, getAssetsByType } = useCreative();
  
  // Initialize state with defaults
  const [colorPalette, setColorPalette] = useState<ColorPalette>(defaultPalettes[0]);
  const [typography, setTypography] = useState<Typography>(defaultTypography[0]);
  const [spacing, setSpacing] = useState<Spacing>(defaultSpacing[0]);
  
  // Initialize component-specific states
  const [activePalette, setActivePalette] = useState<ColorPalette>(defaultPalettes[0]);
  const [palettes, setPalettes] = useState<ColorPalette[]>(defaultPalettes);
  
  const [activeTypography, setActiveTypography] = useState<Typography>(defaultTypography[0]);
  const [typographyOptions, setTypographyOptions] = useState<Typography[]>(defaultTypography);
  
  const [activeSpacing, setActiveSpacing] = useState<Spacing>(defaultSpacing[0]);
  const [spacingOptions, setSpacingOptions] = useState<Spacing[]>(defaultSpacing);
  
  // Load themes from assets
  const [availableThemes, setAvailableThemes] = useState<Theme[]>([]);
  
  // Load saved themes on mount
  useEffect(() => {
    const themeAssets = getAssetsByType('other').filter(asset => 
      asset.metadata.assetSubtype === 'theme'
    );
    
    const themes: Theme[] = themeAssets.map(asset => ({
      id: asset.id,
      name: asset.metadata.title || 'Untitled Theme',
      colorPalette: asset.metadata.colorPalette || defaultPalettes[0],
      typography: asset.metadata.typography || defaultTypography[0],
      spacing: asset.metadata.spacing || defaultSpacing[0],
      createdAt: asset.createdAt,
      updatedAt: asset.updatedAt
    }));
    
    setAvailableThemes(themes);
  }, [assets, getAssetsByType]);
  
  // Update handlers with memoization
  const updateColorPalette = useCallback((update: Partial<ColorPalette>) => {
    setColorPalette(current => ({ ...current, ...update }));
  }, []);
  
  const updateTypography = useCallback((update: Partial<Typography>) => {
    setTypography(current => ({ ...current, ...update }));
  }, []);
  
  const updateSpacing = useCallback((update: Partial<Spacing>) => {
    setSpacing(current => ({ ...current, ...update }));
  }, []);
  
  // Save current theme
  const saveTheme = useCallback((name: string) => {
    const themeData = {
      colorPalette,
      typography,
      spacing
    };
    
    // Check if we're updating an existing theme with this name
    const existingTheme = availableThemes.find(theme => theme.name === name);
    
    if (existingTheme) {
      // Update existing theme
      const updateData: AssetUpdateData = {
        metadata: {
          title: name,
          assetSubtype: 'theme',
          colorPalette,
          typography,
          spacing
        }
      };
      
      updateAsset(existingTheme.id, updateData);
    } else {
      // Create new theme
      addAsset(
        'other',
        JSON.stringify(themeData),
        ['theme', 'style'],
        {
          title: name,
          assetSubtype: 'theme',
          colorPalette,
          typography,
          spacing
        }
      );
    }
  }, [colorPalette, typography, spacing, availableThemes, updateAsset, addAsset]);
  
  // Load a theme
  const loadTheme = useCallback((themeId: string) => {
    const theme = availableThemes.find(t => t.id === themeId);
    
    if (theme) {
      setColorPalette(theme.colorPalette);
      setTypography(theme.typography);
      setSpacing(theme.spacing);
      
      // Also update active states
      setActivePalette(theme.colorPalette);
      setActiveTypography(theme.typography);
      setActiveSpacing(theme.spacing);
    }
  }, [availableThemes]);
  
  // Component-specific methods
  const addCustomPalette = useCallback((palette: ColorPalette) => {
    setPalettes(prev => [...prev, palette]);
    setActivePalette(palette);
  }, []);
  
  const addCustomTypography = useCallback((typography: Typography) => {
    setTypographyOptions(prev => [...prev, typography]);
    setActiveTypography(typography);
  }, []);
  
  const addCustomSpacing = useCallback((spacing: Spacing) => {
    setSpacingOptions(prev => [...prev, spacing]);
    setActiveSpacing(spacing);
  }, []);
  
  // Apply styles to an element (placeholder for future functionality)
  const applyStylesToElement = useCallback((elementId: string, styles: Partial<{
    color: string;
    backgroundColor: string;
    fontFamily: string;
    fontSize: string;
    fontWeight: string;
    padding: string;
    margin: string;
  }>) => {
    console.log(`Applying styles to element ${elementId}:`, styles);
    // Implementation would go here
  }, []);
  
  const value: StyleSystemContextType = {
    colorPalette,
    typography,
    spacing,
    updateColorPalette,
    updateTypography,
    updateSpacing,
    saveTheme,
    loadTheme,
    availableThemes,
    
    // Component-specific properties
    activePalette,
    palettes,
    setActivePalette,
    addCustomPalette,
    
    activeTypography,
    typographyOptions,
    setActiveTypography,
    addCustomTypography,
    
    activeSpacing,
    spacingOptions,
    setActiveSpacing,
    addCustomSpacing,
    
    applyStylesToElement
  };
  
  return (
    <StyleSystemContext.Provider value={value}>
      {children}
    </StyleSystemContext.Provider>
  );
};

export const useStyleSystem = () => {
  const context = useContext(StyleSystemContext);
  if (!context) {
    throw new Error('useStyleSystem must be used within a StyleSystemProvider');
  }
  return context;
};
