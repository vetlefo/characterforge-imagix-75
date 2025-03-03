
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
    stroke?: string;
    fill?: string;
    background?: string;
    duration?: string;
    delay?: string;
    distance?: string;
    gap?: string;
    ['--font-family']?: string;
    ['--heading-font-weight']?: string;
    ['--body-font-weight']?: string;
    ['--font-size-base']?: string;
    ['--line-height-base']?: string;
    [key: string]: string | undefined;
  }>) => void;
}

// Add new types for the StyleAdapter integration
export type MediaType = 'drawing' | 'animation' | 'website' | 'text';

export interface StyleAdapterOptions {
  mediaType: MediaType;
  elementId?: string;
  styles?: Record<string, any>;
}

export interface StyleCommandResult {
  success: boolean;
  message: string;
  appliedStyles?: Record<string, any>;
}

// Extend the context type with new adapter methods
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
    stroke?: string;
    fill?: string;
    background?: string;
    duration?: string;
    delay?: string;
    distance?: string;
    gap?: string;
    ['--font-family']?: string;
    ['--heading-font-weight']?: string;
    ['--body-font-weight']?: string;
    ['--font-size-base']?: string;
    ['--line-height-base']?: string;
    [key: string]: string | undefined;
  }>) => void;
  
  // Add methods for natural language interface
  parseStyleCommand?: (command: string) => StyleCommandResult;
  
  // Add methods for adapter integration
  getMediaTypeStyles?: (options: StyleAdapterOptions) => Record<string, any>;
  
  // Add methods for visualization components
  generatePreviewStyles?: (mediaType: StyleAdapterOptions['mediaType']) => Record<string, any>;
}

// Animation system types
export type KeyframeType = {
  id: string;
  time: number; // Percentage (0-100)
  properties: {
    transform?: string;
    opacity?: string;
    backgroundColor?: string;
    color?: string;
    [key: string]: string | undefined;
  };
};

export type AnimationDefinition = {
  id: string;
  name: string;
  element: string;
  duration: number;
  delay: number;
  timingFunction: string;
  iterationCount: string;
  direction: "normal" | "reverse" | "alternate" | "alternate-reverse";
  fillMode: "none" | "forwards" | "backwards" | "both";
  keyframes: KeyframeType[];
};

export type TimelineMarker = {
  id: string;
  time: number;
  label: string;
  color?: string;
};

export interface AnimationContextType {
  animations: AnimationDefinition[];
  selectedAnimationId: string | null;
  previewElement: string;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  markers: TimelineMarker[];
  
  // Actions
  addAnimation: (animation: Omit<AnimationDefinition, "id">) => string;
  updateAnimation: (id: string, updates: Partial<Omit<AnimationDefinition, "id">>) => void;
  deleteAnimation: (id: string) => void;
  selectAnimation: (id: string | null) => void;
  setPreviewElement: (elementType: string) => void;
  addKeyframe: (animationId: string, keyframe: Omit<KeyframeType, "id">) => string;
  updateKeyframe: (animationId: string, keyframeId: string, updates: Partial<Omit<KeyframeType, "id">>) => void;
  deleteKeyframe: (animationId: string, keyframeId: string) => void;
  playAnimation: () => void;
  pauseAnimation: () => void;
  seekAnimation: (time: number) => void;
  addMarker: (marker: Omit<TimelineMarker, "id">) => string;
  updateMarker: (id: string, updates: Partial<Omit<TimelineMarker, "id">>) => void;
  deleteMarker: (id: string) => void;
  exportAnimationCSS: (id: string) => string;
  exportAnimationReact: (id: string) => string;
}
