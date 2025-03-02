
export type ColorPalette = {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
    muted: string;
    border: string;
  };
};

export type Typography = {
  id: string;
  name: string;
  fontFamily: string;
  heading: {
    fontWeight: string;
    lineHeight: string;
    letterSpacing: string;
  };
  body: {
    fontWeight: string;
    lineHeight: string;
    letterSpacing: string;
  };
  sizes: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
  };
};

export type Spacing = {
  id: string;
  name: string;
  scale: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
  };
  containerWidth: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
};

export type Theme = {
  id: string;
  name: string;
  colorPalette: ColorPalette;
  typography: Typography;
  spacing: Spacing;
  createdAt: Date;
  updatedAt: Date;
};

export interface StyleSystemContextType {
  colorPalette: ColorPalette;
  typography: Typography;
  spacing: Spacing;
  updateColorPalette: (palette: Partial<ColorPalette>) => void;
  updateTypography: (typography: Partial<Typography>) => void;
  updateSpacing: (spacing: Partial<Spacing>) => void;
  saveTheme: (name: string) => void;
  loadTheme: (themeId: string) => void;
  availableThemes: Theme[];
  
  // Properties used by components
  activePalette: ColorPalette;
  palettes: ColorPalette[];
  setActivePalette: (palette: ColorPalette) => void;
  addCustomPalette: (palette: ColorPalette) => void;
  
  activeTypography: Typography;
  typographyOptions: Typography[];
  setActiveTypography: (typography: Typography) => void;
  addCustomTypography: (typography: Typography) => void;
  
  activeSpacing: Spacing;
  spacingOptions: Spacing[];
  setActiveSpacing: (spacing: Spacing) => void;
  addCustomSpacing: (spacing: Spacing) => void;
  
  applyStylesToElement: (elementId: string, styles: Partial<{
    color: string;
    backgroundColor: string;
    fontFamily: string;
    fontSize: string;
    fontWeight: string;
    padding: string;
    margin: string;
  }>) => void;
}
