
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import StyleExtractor from './StyleExtractor';
import CodeGenerator from './CodeGenerator';
import { AnimationGenerator } from './AnimationGenerator';
import { MediaTransformProvider } from './MediaTransformContext';
import { Card } from '../../ui/card';
import { Paintbrush, Code, Play } from 'lucide-react';

interface MediaTransformProps {
  imageUrl?: string;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const MediaTransform: React.FC<MediaTransformProps> = ({
  imageUrl,
  activeTab = 'style',
  onTabChange
}) => {
  const [internalActiveTab, setInternalActiveTab] = useState(activeTab);

  const handleTabChange = (value: string) => {
    setInternalActiveTab(value);
    if (onTabChange) {
      onTabChange(value);
    }
  };

  return (
    <MediaTransformProvider>
      <Card className="p-4 bg-muted/10">
        <Tabs 
          value={internalActiveTab} 
          onValueChange={handleTabChange}
          className="space-y-4"
        >
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="style" className="flex items-center gap-2">
              <Paintbrush size={16} />
              <span>Style Extraction</span>
            </TabsTrigger>
            <TabsTrigger value="code" className="flex items-center gap-2">
              <Code size={16} />
              <span>Code Generation</span>
            </TabsTrigger>
            <TabsTrigger value="animation" className="flex items-center gap-2">
              <Play size={16} />
              <span>Animation Generator</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="style">
            <StyleExtractor imageUrl={imageUrl} />
          </TabsContent>
          
          <TabsContent value="code">
            <CodeGenerator />
          </TabsContent>
          
          <TabsContent value="animation">
            <AnimationGenerator imageUrl={imageUrl} />
          </TabsContent>
        </Tabs>
      </Card>
    </MediaTransformProvider>
  );
};

export default MediaTransform;
