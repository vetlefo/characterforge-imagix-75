
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useStyleSystem } from './StyleSystemContext';
import { Typography } from './types';
import { v4 as uuidv4 } from 'uuid';

export const TypographyControls: React.FC = () => {
  const { 
    activeTypography, 
    typographyOptions, 
    setActiveTypography, 
    addCustomTypography 
  } = useStyleSystem();

  const [isCreating, setIsCreating] = useState(false);
  const [newTypography, setNewTypography] = useState<Typography>({
    id: "",
    name: "New Typography",
    fontFamily: "Inter, sans-serif",
    heading: {
      fontWeight: "700",
      lineHeight: "1.2",
      letterSpacing: "-0.02em"
    },
    body: {
      fontWeight: "400",
      lineHeight: "1.6",
      letterSpacing: "0"
    },
    sizes: {
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "2rem"
    }
  });

  const handleSaveTypography = () => {
    const typographyToSave = {
      ...newTypography,
      id: uuidv4()
    };
    
    addCustomTypography(typographyToSave);
    setIsCreating(false);
    
    // Reset form
    setNewTypography({
      id: "",
      name: "New Typography",
      fontFamily: activeTypography.fontFamily,
      heading: { ...activeTypography.heading },
      body: { ...activeTypography.body },
      sizes: { ...activeTypography.sizes }
    });
  };

  const handleInputChange = (
    section: 'heading' | 'body' | 'sizes', 
    property: string, 
    value: string
  ) => {
    setNewTypography(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [property]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Typography</h3>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setIsCreating(!isCreating)}
        >
          {isCreating ? "Cancel" : "New Typography"}
        </Button>
      </div>

      {isCreating ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              <input
                type="text"
                value={newTypography.name}
                onChange={(e) => setNewTypography(prev => ({ ...prev, name: e.target.value }))}
                className="w-full bg-background px-3 py-2 rounded-md border border-input"
                placeholder="Typography Name"
              />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="mb-4">
              <Label htmlFor="fontFamily" className="block mb-2">Font Family</Label>
              <input
                id="fontFamily"
                type="text"
                value={newTypography.fontFamily}
                onChange={(e) => setNewTypography(prev => ({ ...prev, fontFamily: e.target.value }))}
                className="w-full bg-background px-3 py-2 rounded-md border border-input"
              />
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Headings</h4>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label htmlFor="headingWeight" className="block text-xs mb-1">Weight</Label>
                    <input
                      id="headingWeight"
                      type="text"
                      value={newTypography.heading.fontWeight}
                      onChange={(e) => handleInputChange('heading', 'fontWeight', e.target.value)}
                      className="w-full h-8 bg-background px-2 py-1 text-xs rounded-md border border-input"
                    />
                  </div>
                  <div>
                    <Label htmlFor="headingLineHeight" className="block text-xs mb-1">Line Height</Label>
                    <input
                      id="headingLineHeight"
                      type="text"
                      value={newTypography.heading.lineHeight}
                      onChange={(e) => handleInputChange('heading', 'lineHeight', e.target.value)}
                      className="w-full h-8 bg-background px-2 py-1 text-xs rounded-md border border-input"
                    />
                  </div>
                  <div>
                    <Label htmlFor="headingLetterSpacing" className="block text-xs mb-1">Letter Spacing</Label>
                    <input
                      id="headingLetterSpacing"
                      type="text"
                      value={newTypography.heading.letterSpacing}
                      onChange={(e) => handleInputChange('heading', 'letterSpacing', e.target.value)}
                      className="w-full h-8 bg-background px-2 py-1 text-xs rounded-md border border-input"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Body Text</h4>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label htmlFor="bodyWeight" className="block text-xs mb-1">Weight</Label>
                    <input
                      id="bodyWeight"
                      type="text"
                      value={newTypography.body.fontWeight}
                      onChange={(e) => handleInputChange('body', 'fontWeight', e.target.value)}
                      className="w-full h-8 bg-background px-2 py-1 text-xs rounded-md border border-input"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bodyLineHeight" className="block text-xs mb-1">Line Height</Label>
                    <input
                      id="bodyLineHeight"
                      type="text"
                      value={newTypography.body.lineHeight}
                      onChange={(e) => handleInputChange('body', 'lineHeight', e.target.value)}
                      className="w-full h-8 bg-background px-2 py-1 text-xs rounded-md border border-input"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bodyLetterSpacing" className="block text-xs mb-1">Letter Spacing</Label>
                    <input
                      id="bodyLetterSpacing"
                      type="text"
                      value={newTypography.body.letterSpacing}
                      onChange={(e) => handleInputChange('body', 'letterSpacing', e.target.value)}
                      className="w-full h-8 bg-background px-2 py-1 text-xs rounded-md border border-input"
                    />
                  </div>
                </div>
              </div>
            </div>

            <Button onClick={handleSaveTypography} className="w-full mt-4">
              Save Typography
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {typographyOptions.map((typography) => (
            <Card 
              key={typography.id}
              className={`transition-all cursor-pointer hover:shadow-md ${
                typography.id === activeTypography.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setActiveTypography(typography)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{typography.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">
                  {typography.fontFamily}
                </p>
                <div className="space-y-2">
                  <p className="text-xl" style={{ 
                    fontFamily: typography.fontFamily,
                    fontWeight: typography.heading.fontWeight,
                    lineHeight: typography.heading.lineHeight,
                    letterSpacing: typography.heading.letterSpacing
                  }}>
                    Heading Text
                  </p>
                  <p style={{ 
                    fontFamily: typography.fontFamily,
                    fontWeight: typography.body.fontWeight,
                    lineHeight: typography.body.lineHeight,
                    letterSpacing: typography.body.letterSpacing
                  }}>
                    Body text example
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
