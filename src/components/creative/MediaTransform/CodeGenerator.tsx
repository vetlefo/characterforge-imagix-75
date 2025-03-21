
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface CodeGeneratorProps {
  imageUrl?: string;
}

const CodeGenerator: React.FC<CodeGeneratorProps> = ({ imageUrl }) => {
  return (
    <div className="space-y-4">
      <Card className="p-4 bg-card/50 border-border/50">
        <h3 className="text-lg font-medium mb-2">Code Generation</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Generate HTML, CSS, React or Tailwind code from your selected image.
        </p>
        
        {imageUrl && (
          <div className="mb-4">
            <img src={imageUrl} alt="Selected for code generation" className="w-full h-32 object-contain rounded-md bg-background/50" />
          </div>
        )}
        
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">HTML/CSS</Button>
          <Button variant="outline" size="sm">React</Button>
          <Button variant="outline" size="sm">Tailwind</Button>
        </div>
      </Card>
    </div>
  );
};

export default CodeGenerator;
