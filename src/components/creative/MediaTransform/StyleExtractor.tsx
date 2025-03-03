
import React, { useState } from 'react';
import { useMediaTransform } from './MediaTransformContext';
import { Button } from '../../ui/button';
import { Progress } from '../../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Eyedropper, Copy, Check, Paintbrush } from 'lucide-react';
import { toast } from 'sonner';
import { useCreative } from '../CreativeContext';

interface StyleExtractorProps {
  imageUrl?: string;
  onStyleExtracted?: (styleId: string) => void;
}

export const StyleExtractor: React.FC<StyleExtractorProps> = ({ 
  imageUrl,
  onStyleExtracted
}) => {
  const { extractStyleFromImage, extractedStyles, isProcessing, applyExtractedStyle } = useMediaTransform();
  const { assets, selectedAssetId } = useCreative();
  const [activeTab, setActiveTab] = useState('palette');
  const [progress, setProgress] = useState(0);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  // Get the image URL from the selected asset or use the provided imageUrl
  const selectedAsset = selectedAssetId 
    ? assets.find(asset => asset.id === selectedAssetId)
    : null;
  
  const effectiveImageUrl = imageUrl || (selectedAsset?.type === 'image' ? selectedAsset.content : '');
  
  const handleExtractStyle = async () => {
    if (!effectiveImageUrl) {
      toast.error('No image selected for style extraction');
      return;
    }
    
    // Simulate progress updates
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return prev;
        }
        return prev + 5;
      });
    }, 100);
    
    try {
      const extractedStyle = await extractStyleFromImage(effectiveImageUrl);
      setProgress(100);
      
      toast.success('Style extracted successfully');
      
      if (onStyleExtracted) {
        onStyleExtracted(extractedStyle.id);
      }
      
      // Reset progress after a delay
      setTimeout(() => setProgress(0), 1000);
    } catch (error) {
      toast.error('Failed to extract style');
      setProgress(0);
    } finally {
      clearInterval(interval);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedColor(text);
    toast.success(`Copied ${text} to clipboard`);
    
    setTimeout(() => {
      setCopiedColor(null);
    }, 2000);
  };

  const handleApplyStyle = (styleId: string) => {
    const style = extractedStyles.find(s => s.id === styleId);
    if (style) {
      applyExtractedStyle(style);
      toast.success('Style applied to the current theme');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        {effectiveImageUrl ? (
          <div className="rounded-lg overflow-hidden border border-border w-24 h-24 flex-shrink-0">
            <img 
              src={effectiveImageUrl} 
              alt="Source image" 
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="rounded-lg border border-border bg-muted w-24 h-24 flex items-center justify-center flex-shrink-0">
            <Paintbrush className="text-muted-foreground" size={24} />
          </div>
        )}
        
        <div className="flex-1 space-y-2">
          <h3 className="text-lg font-medium">Style Extractor</h3>
          <p className="text-sm text-muted-foreground">
            Extract color palettes, typography, and spacing information from images
          </p>
          
          {progress > 0 && (
            <Progress value={progress} className="h-2" />
          )}
        </div>
        
        <Button
          onClick={handleExtractStyle}
          disabled={isProcessing || !effectiveImageUrl}
          className="gap-2"
        >
          <Eyedropper size={16} />
          Extract Style
        </Button>
      </div>
      
      {extractedStyles.length > 0 && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="mb-4">
            <TabsTrigger value="palette">Color Palette</TabsTrigger>
            <TabsTrigger value="typography">Typography</TabsTrigger>
            <TabsTrigger value="spacing">Spacing</TabsTrigger>
          </TabsList>
          
          <TabsContent value="palette" className="space-y-4">
            {extractedStyles.map(style => (
              <Card key={style.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center justify-between">
                    <span>Extracted Colors</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleApplyStyle(style.id)}
                    >
                      Apply Theme
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-5 gap-2">
                      {style.colors.palette.map((color, index) => (
                        <div 
                          key={index} 
                          className="flex flex-col items-center"
                          onClick={() => copyToClipboard(color)}
                        >
                          <div 
                            className="w-12 h-12 rounded-full cursor-pointer relative flex items-center justify-center"
                            style={{ backgroundColor: color }}
                          >
                            {copiedColor === color && (
                              <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center">
                                <Check size={16} className="text-white" />
                              </div>
                            )}
                          </div>
                          <span className="text-xs mt-1">{color}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <div className="text-xs text-muted-foreground">Background</div>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-8 h-8 rounded cursor-pointer border border-border"
                            style={{ backgroundColor: style.colors.background }}
                            onClick={() => copyToClipboard(style.colors.background)}
                          />
                          <span className="text-sm">{style.colors.background}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="text-xs text-muted-foreground">Text</div>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-8 h-8 rounded cursor-pointer border border-border"
                            style={{ backgroundColor: style.colors.text }}
                            onClick={() => copyToClipboard(style.colors.text)}
                          />
                          <span className="text-sm">{style.colors.text}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="text-xs text-muted-foreground">Accent</div>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-8 h-8 rounded cursor-pointer border border-border"
                            style={{ backgroundColor: style.colors.accent }}
                            onClick={() => copyToClipboard(style.colors.accent)}
                          />
                          <span className="text-sm">{style.colors.accent}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
          
          <TabsContent value="typography" className="space-y-4">
            {extractedStyles.map(style => (
              <Card key={style.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Typography Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <div className="text-xs text-muted-foreground">Font Family</div>
                        <div className="flex items-center gap-2">
                          <span 
                            className="text-sm font-medium truncate cursor-pointer"
                            style={{ fontFamily: style.typography.fontFamily }}
                            onClick={() => copyToClipboard(style.typography.fontFamily)}
                          >
                            {style.typography.fontFamily}
                          </span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6"
                            onClick={() => copyToClipboard(style.typography.fontFamily)}
                          >
                            <Copy size={14} />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="text-xs text-muted-foreground">Line Height</div>
                        <div className="text-sm font-medium">
                          {style.typography.lineHeight}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-xs text-muted-foreground">Font Size Preview</div>
                      <div 
                        className="text-2xl font-bold"
                        style={{ 
                          fontSize: style.typography.headingSize,
                          fontFamily: style.typography.fontFamily,
                          lineHeight: style.typography.lineHeight
                        }}
                      >
                        Heading Text
                      </div>
                      <div 
                        className="text-base"
                        style={{ 
                          fontSize: style.typography.bodySize,
                          fontFamily: style.typography.fontFamily,
                          lineHeight: style.typography.lineHeight
                        }}
                      >
                        This is a paragraph of text that demonstrates the body font size and style that was extracted from the image. The text should be readable and correctly spaced.
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
          
          <TabsContent value="spacing" className="space-y-4">
            {extractedStyles.map(style => (
              <Card key={style.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Spacing System</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <div className="text-xs text-muted-foreground">Padding</div>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 flex items-center justify-center border border-border bg-background">
                            <div className="w-6 h-6 bg-muted"></div>
                          </div>
                          <span 
                            className="text-sm cursor-pointer"
                            onClick={() => copyToClipboard(style.spacing.padding)}
                          >
                            {style.spacing.padding}
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="text-xs text-muted-foreground">Margin</div>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 flex items-center justify-center relative">
                            <div className="absolute inset-1 border border-dashed border-muted-foreground"></div>
                            <div className="w-4 h-4 bg-muted"></div>
                          </div>
                          <span 
                            className="text-sm cursor-pointer"
                            onClick={() => copyToClipboard(style.spacing.margin)}
                          >
                            {style.spacing.margin}
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="text-xs text-muted-foreground">Gap</div>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 flex items-center justify-between">
                            <div className="w-3 h-3 bg-muted"></div>
                            <div className="w-3 h-3 bg-muted"></div>
                          </div>
                          <span 
                            className="text-sm cursor-pointer"
                            onClick={() => copyToClipboard(style.spacing.gap)}
                          >
                            {style.spacing.gap}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 border border-border rounded-lg bg-muted/20">
                      <div 
                        className="p-4 bg-background border border-border rounded flex flex-col"
                        style={{ padding: style.spacing.padding }}
                      >
                        <div className="text-sm font-medium mb-2">Spacing Preview</div>
                        <div 
                          className="flex"
                          style={{ gap: style.spacing.gap }}
                        >
                          <div className="w-8 h-8 bg-primary/20 border border-primary/30 rounded"></div>
                          <div className="w-8 h-8 bg-primary/20 border border-primary/30 rounded"></div>
                          <div className="w-8 h-8 bg-primary/20 border border-primary/30 rounded"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};
