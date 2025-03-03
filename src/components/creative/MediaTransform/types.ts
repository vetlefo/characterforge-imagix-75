
export interface MediaTransformProps {
  className?: string;
  imageUrl?: string;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export interface MediaPreviewProps {
  imageUrl: string;
}
