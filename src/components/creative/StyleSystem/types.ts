
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

export type SpacingSystem = {
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

export type StyleSystemContextType = {
  activePalette: ColorPalette;
  palettes: ColorPalette[];
  activeTypography: Typography;
  typographyOptions: Typography[];
  activeSpacing: SpacingSystem;
  spacingOptions: SpacingSystem[];
  setActivePalette: (palette: ColorPalette) => void;
  setActiveTypography: (typography: Typography) => void;
  setActiveSpacing: (spacing: SpacingSystem) => void;
  addCustomPalette: (palette: ColorPalette) => void;
  addCustomTypography: (typography: Typography) => void;
  addCustomSpacing: (spacing: SpacingSystem) => void;
  applyStylesToElement: (elementId: string, styles: Partial<{
    color: string;
    backgroundColor: string;
    fontFamily: string;
    fontSize: string;
    fontWeight: string;
    padding: string;
    margin: string;
  }>) => void;
};
