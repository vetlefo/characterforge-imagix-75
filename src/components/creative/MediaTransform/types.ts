
export interface StyleExtractorProps {
  imageUrl?: string;
}

export interface CodeGeneratorProps {
  imageUrl?: string;
}

export interface AnimationGeneratorProps {
  imageUrl?: string;
}

export interface MediaTransformContextType {
  extractedStyles: any;
  setExtractedStyles: (styles: any) => void;
  generatedCode: string;
  setGeneratedCode: (code: string) => void;
  animationSettings: any;
  setAnimationSettings: (settings: any) => void;
}
