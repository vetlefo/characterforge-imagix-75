
import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { defaultColorPalette, defaultTypography, defaultSpacing } from './defaultStyles';
import { ColorPalette, Typography, Spacing, Theme } from './types';
import { useCreative } from '../CreativeContext';
import { Asset } from '../types';

interface StyleSystemContextType {
  colorPalette: ColorPalette;
  typography: Typography;
  spacing: Spacing;
  updateColorPalette: (palette: Partial<ColorPalette>) => void;
  updateTypography: (typography: Partial<Typography>) => void;
  updateSpacing: (spacing: Partial<Spacing>) => void;
  saveTheme: (name: string) => void;
  loadTheme: (themeId: string) => void;
  availableThemes: Theme[];
}

const StyleSystemContext = createContext<StyleSystemContextType | undefined>(undefined);

export const StyleSystemProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { assets, addAsset, updateAsset, getAssetsByType } = useCreative();
  
  // Initialize state with defaults
  const [colorPalette, setColorPalette] = useState<ColorPalette>(defaultColorPalette);
  const [typography, setTypography] = useState<Typography>(defaultTypography);
  const [spacing, setSpacing] = useState<Spacing>(defaultSpacing);
  
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
      colorPalette: asset.metadata.colorPalette || defaultColorPalette,
      typography: asset.metadata.typography || defaultTypography,
      spacing: asset.metadata.spacing || defaultSpacing,
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
      updateAsset(existingTheme.id, {
        metadata: {
          title: name,
          assetSubtype: 'theme',
          colorPalette,
          typography,
          spacing
        }
      });
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
    }
  }, [availableThemes]);
  
  const value = {
    colorPalette,
    typography,
    spacing,
    updateColorPalette,
    updateTypography,
    updateSpacing,
    saveTheme,
    loadTheme,
    availableThemes
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
