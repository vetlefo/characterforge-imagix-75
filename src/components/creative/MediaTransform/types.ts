
export interface MediaTransformProps {
  className?: string;
  imageUrl?: string;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export interface MediaPreviewProps {
  imageUrl: string;
}

export interface StyleExtractorProps {
  imageUrl: string;
}

export interface AnimationGeneratorProps {
  imageUrl: string;
}

export interface CodeGeneratorProps {
  imageUrl: string;
}
