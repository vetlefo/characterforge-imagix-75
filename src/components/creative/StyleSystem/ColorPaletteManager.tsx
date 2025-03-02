
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useStyleSystem } from './StyleSystemContext';
import { ColorPalette } from './types';
import { v4 as uuidv4 } from 'uuid';

const ColorPicker: React.FC<{
  label: string;
  color: string;
  onChange: (color: string) => void;
}> = ({ label, color, onChange }) => (
  <div className="mb-4">
    <Label htmlFor={`color-${label}`} className="block mb-2">{label}</Label>
    <div className="flex items-center gap-2">
      <input
        id={`color-${label}`}
        type="color"
        value={color}
        onChange={(e) => onChange(e.target.value)}
        className="w-8 h-8 rounded overflow-hidden"
      />
      <input
        type="text"
        value={color}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 h-9 px-3 py-2 bg-background rounded-md border border-input"
      />
    </div>
  </div>
);

export const ColorPaletteManager: React.FC = () => {
  const { 
    activePalette, 
    palettes, 
    setActivePalette, 
    addCustomPalette 
  } = useStyleSystem();

  const [isCreating, setIsCreating] = useState(false);
  const [newPalette, setNewPalette] = useState<ColorPalette>({
    id: "",
    name: "New Palette",
    colors: {
      primary: "#3b82f6",
      secondary: "#1e293b",
      accent: "#8b5cf6",
      background: "#0F0F23",
      foreground: "#ffffff",
      muted: "#334155",
      border: "#1e293b"
    }
  });

  const handleColorChange = (key: keyof ColorPalette['colors'], value: string) => {
    setNewPalette(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        [key]: value
      }
    }));
  };

  const handleSavePalette = () => {
    const paletteToSave = {
      ...newPalette,
      id: uuidv4()
    };
    
    addCustomPalette(paletteToSave);
    setIsCreating(false);
    
    // Reset form
    setNewPalette({
      id: "",
      name: "New Palette",
      colors: { ...activePalette.colors }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Color Palette</h3>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setIsCreating(!isCreating)}
        >
          {isCreating ? "Cancel" : "New Palette"}
        </Button>
      </div>

      {isCreating ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              <input
                type="text"
                value={newPalette.name}
                onChange={(e) => setNewPalette(prev => ({ ...prev, name: e.target.value }))}
                className="w-full bg-background px-3 py-2 rounded-md border border-input"
                placeholder="Palette Name"
              />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ColorPicker 
              label="Primary" 
              color={newPalette.colors.primary}
              onChange={(color) => handleColorChange('primary', color)}
            />
            <ColorPicker 
              label="Secondary" 
              color={newPalette.colors.secondary}
              onChange={(color) => handleColorChange('secondary', color)}
            />
            <ColorPicker 
              label="Accent" 
              color={newPalette.colors.accent}
              onChange={(color) => handleColorChange('accent', color)}
            />
            <ColorPicker 
              label="Background" 
              color={newPalette.colors.background}
              onChange={(color) => handleColorChange('background', color)}
            />
            <ColorPicker 
              label="Foreground" 
              color={newPalette.colors.foreground}
              onChange={(color) => handleColorChange('foreground', color)}
            />
            <ColorPicker 
              label="Muted" 
              color={newPalette.colors.muted}
              onChange={(color) => handleColorChange('muted', color)}
            />
            <ColorPicker 
              label="Border" 
              color={newPalette.colors.border}
              onChange={(color) => handleColorChange('border', color)}
            />

            <Button onClick={handleSavePalette} className="w-full">
              Save Palette
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {palettes.map((palette) => (
            <Card 
              key={palette.id}
              className={`transition-all cursor-pointer hover:shadow-md ${
                palette.id === activePalette.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setActivePalette(palette)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{palette.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <div 
                    className="w-8 h-8 rounded-full" 
                    style={{ backgroundColor: palette.colors.primary }}
                    title="Primary"
                  />
                  <div 
                    className="w-8 h-8 rounded-full" 
                    style={{ backgroundColor: palette.colors.secondary }}
                    title="Secondary"
                  />
                  <div 
                    className="w-8 h-8 rounded-full" 
                    style={{ backgroundColor: palette.colors.accent }}
                    title="Accent"
                  />
                  <div 
                    className="w-8 h-8 rounded-full border border-white/20" 
                    style={{ backgroundColor: palette.colors.background }}
                    title="Background"
                  />
                  <div 
                    className="w-8 h-8 rounded-full border border-white/20" 
                    style={{ backgroundColor: palette.colors.foreground }}
                    title="Foreground"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
