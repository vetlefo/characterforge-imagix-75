
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { ColorPaletteManager } from './ColorPaletteManager';
import { TypographyControls } from './TypographyControls';
import { SpacingSystem } from './SpacingSystem';

export const StyleSystem: React.FC = () => {
  return (
    <Card className="p-4">
      <Tabs defaultValue="colors">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="colors" className="flex-1">Colors</TabsTrigger>
          <TabsTrigger value="typography" className="flex-1">Typography</TabsTrigger>
          <TabsTrigger value="spacing" className="flex-1">Spacing</TabsTrigger>
        </TabsList>
        
        <TabsContent value="colors">
          <ColorPaletteManager />
        </TabsContent>
        
        <TabsContent value="typography">
          <TypographyControls />
        </TabsContent>
        
        <TabsContent value="spacing">
          <SpacingSystem />
        </TabsContent>
      </Tabs>
    </Card>
  );
};
