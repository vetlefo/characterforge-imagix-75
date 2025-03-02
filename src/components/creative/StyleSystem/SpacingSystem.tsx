
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useStyleSystem } from './StyleSystemContext';
import { Spacing } from './types';
import { v4 as uuidv4 } from 'uuid';

export const SpacingSystem: React.FC = () => {
  const { 
    activeSpacing, 
    spacingOptions, 
    setActiveSpacing, 
    addCustomSpacing 
  } = useStyleSystem();

  const [isCreating, setIsCreating] = useState(false);
  const [newSpacing, setNewSpacing] = useState<Spacing>({
    id: "",
    name: "New Spacing",
    scale: {
      xs: "0.25rem",
      sm: "0.5rem",
      md: "0.75rem",
      lg: "1rem",
      xl: "1.5rem",
      "2xl": "2rem"
    },
    containerWidth: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px"
    }
  });

  const handleSaveSpacing = () => {
    const spacingToSave = {
      ...newSpacing,
      id: uuidv4()
    };
    
    addCustomSpacing(spacingToSave);
    setIsCreating(false);
    
    // Reset form
    setNewSpacing({
      id: "",
      name: "New Spacing",
      scale: { ...activeSpacing.scale },
      containerWidth: { ...activeSpacing.containerWidth }
    });
  };

  const handleInputChange = (
    section: 'scale' | 'containerWidth', 
    property: string, 
    value: string
  ) => {
    setNewSpacing(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [property]: value
      }
    }));
  };

  const renderSpacingPreview = (spacing: Spacing) => {
    return (
      <div className="space-y-2">
        <div className="flex gap-2 items-end">
          <div 
            className="bg-primary rounded" 
            style={{ width: spacing.scale.xs, height: spacing.scale.xs }}
            title="xs"
          />
          <div 
            className="bg-primary rounded" 
            style={{ width: spacing.scale.sm, height: spacing.scale.sm }}
            title="sm"
          />
          <div 
            className="bg-primary rounded" 
            style={{ width: spacing.scale.md, height: spacing.scale.md }}
            title="md"
          />
          <div 
            className="bg-primary rounded" 
            style={{ width: spacing.scale.lg, height: spacing.scale.lg }}
            title="lg"
          />
          <div 
            className="bg-primary rounded" 
            style={{ width: spacing.scale.xl, height: spacing.scale.xl }}
            title="xl"
          />
        </div>
        <div className="text-xs text-muted-foreground">
          Containers: {spacing.containerWidth.sm} / {spacing.containerWidth.md} / {spacing.containerWidth.lg}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Spacing System</h3>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setIsCreating(!isCreating)}
        >
          {isCreating ? "Cancel" : "New Spacing"}
        </Button>
      </div>

      {isCreating ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              <input
                type="text"
                value={newSpacing.name}
                onChange={(e) => setNewSpacing(prev => ({ ...prev, name: e.target.value }))}
                className="w-full bg-background px-3 py-2 rounded-md border border-input"
                placeholder="Spacing Name"
              />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Spacing Scale</h4>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(newSpacing.scale).map(([key, value]) => (
                  <div key={key}>
                    <Label htmlFor={`scale-${key}`} className="block text-xs mb-1">{key}</Label>
                    <input
                      id={`scale-${key}`}
                      type="text"
                      value={value}
                      onChange={(e) => handleInputChange('scale', key, e.target.value)}
                      className="w-full h-8 bg-background px-2 py-1 text-xs rounded-md border border-input"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Container Widths</h4>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(newSpacing.containerWidth).map(([key, value]) => (
                  <div key={key}>
                    <Label htmlFor={`container-${key}`} className="block text-xs mb-1">{key}</Label>
                    <input
                      id={`container-${key}`}
                      type="text"
                      value={value}
                      onChange={(e) => handleInputChange('containerWidth', key, e.target.value)}
                      className="w-full h-8 bg-background px-2 py-1 text-xs rounded-md border border-input"
                    />
                  </div>
                ))}
              </div>
            </div>

            <Button onClick={handleSaveSpacing} className="w-full mt-4">
              Save Spacing System
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {spacingOptions.map((spacing) => (
            <Card 
              key={spacing.id}
              className={`transition-all cursor-pointer hover:shadow-md ${
                spacing.id === activeSpacing.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setActiveSpacing(spacing)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{spacing.name}</CardTitle>
              </CardHeader>
              <CardContent>
                {renderSpacingPreview(spacing)}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
