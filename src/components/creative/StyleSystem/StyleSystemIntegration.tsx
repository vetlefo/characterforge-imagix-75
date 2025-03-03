
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useStyleSystem } from './StyleSystemContext';
import { StyleAdapter, MediaType } from './StyleAdapter';
import { StyleCommandParser } from './StyleCommandParser';
import { StylePreview } from './StylePreview';
import { StyleSystem } from './StyleSystem';

export const StyleSystemIntegration: React.FC = () => {
  const [selectedMediaType, setSelectedMediaType] = useState<MediaType>('website');
  const { saveTheme, loadTheme, availableThemes } = useStyleSystem();
  const [selectedThemeId, setSelectedThemeId] = useState<string>('');
  const [themeName, setThemeName] = useState('');

  const handleSaveTheme = () => {
    if (themeName.trim()) {
      saveTheme(themeName);
      setThemeName('');
    }
  };

  const handleLoadTheme = (themeId: string) => {
    setSelectedThemeId(themeId);
    loadTheme(themeId);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Style System Integration</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="command">
          <TabsList className="mb-4">
            <TabsTrigger value="command">Natural Language</TabsTrigger>
            <TabsTrigger value="editor">Style Editor</TabsTrigger>
            <TabsTrigger value="themes">Theme Manager</TabsTrigger>
          </TabsList>
          
          <TabsContent value="command">
            <div className="space-y-4">
              <StyleCommandParser />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="media-type" className="mb-2 block">Preview Media Type</Label>
                  <Select 
                    value={selectedMediaType} 
                    onValueChange={(value) => setSelectedMediaType(value as MediaType)}
                  >
                    <SelectTrigger id="media-type" className="w-full">
                      <SelectValue placeholder="Select media type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="drawing">Drawing</SelectItem>
                      <SelectItem value="animation">Animation</SelectItem>
                      <SelectItem value="website">Website</SelectItem>
                      <SelectItem value="text">Text</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <StyleAdapter mediaType={selectedMediaType}>
                <StylePreview mediaType={selectedMediaType} />
              </StyleAdapter>
            </div>
          </TabsContent>
          
          <TabsContent value="editor">
            <StyleSystem />
          </TabsContent>
          
          <TabsContent value="themes">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="theme-selector" className="mb-2 block">Load Theme</Label>
                  <Select 
                    value={selectedThemeId} 
                    onValueChange={handleLoadTheme}
                  >
                    <SelectTrigger id="theme-selector" className="w-full">
                      <SelectValue placeholder="Select a theme" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableThemes.map(theme => (
                        <SelectItem key={theme.id} value={theme.id}>
                          {theme.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="theme-name" className="mb-2 block">Save Current Theme</Label>
                  <div className="flex gap-2">
                    <input
                      id="theme-name"
                      type="text"
                      value={themeName}
                      onChange={(e) => setThemeName(e.target.value)}
                      placeholder="Theme name"
                      className="flex-1 px-3 py-2 bg-background border border-input rounded-md"
                    />
                    <button
                      onClick={handleSaveTheme}
                      disabled={!themeName.trim()}
                      className="px-3 py-2 bg-primary text-primary-foreground rounded-md disabled:opacity-50"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
              
              {selectedThemeId && (
                <div className="pt-4">
                  <StylePreview mediaType={selectedMediaType} />
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

