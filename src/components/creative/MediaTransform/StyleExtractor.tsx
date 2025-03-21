
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface StyleExtractorProps {
  imageUrl: string;
}

const StyleExtractor: React.FC<StyleExtractorProps> = ({ imageUrl }) => {
  return (
    <div className="space-y-4">
      <Card className="p-4 bg-card/50 border-border/50">
        <h3 className="text-lg font-medium mb-2">Style Extraction</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Extract color palettes, typography styles, and design elements from your image.
        </p>
        
        {imageUrl && (
          <div className="mb-4">
            <img src={imageUrl} alt="Selected for style extraction" className="w-full h-32 object-contain rounded-md bg-background/50" />
          </div>
        )}
        
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">Color Palette</Button>
          <Button variant="outline" size="sm">Typography</Button>
          <Button variant="outline" size="sm">Components</Button>
        </div>
      </Card>
    </div>
  );
};

export default StyleExtractor;
