
export interface ColorPalette {
  dominant: string;
  palette: string[];
  background: string;
  text: string;
  accent: string;
}

export interface TypographyStyle {
  fontFamily: string;
  headingSize: string;
  bodySize: string;
  lineHeight: number;
}

export interface SpacingStyle {
  padding: string;
  margin: string;
  gap: string;
}

export interface ExtractedStyle {
  id: string;
  sourceImageUrl: string;
  colors: ColorPalette;
  typography: TypographyStyle;
  spacing: SpacingStyle;
  extractedAt: Date;
}

export interface GeneratedCode {
  id: string;
  sourceAssetId: string;
  html: string;
  css: string;
  js?: string;
  generatedAt: Date;
}

export interface AnimationKeyframe {
  id: string;
  time: number; // 0-100 percentage
  properties: Record<string, string>;
}

export interface GeneratedAnimation {
  id: string;
  sourceImageUrl: string;
  keyframes: AnimationKeyframe[];
  duration: number;
  timingFunction: string;
  css: string;
  generatedAt: Date;
}
