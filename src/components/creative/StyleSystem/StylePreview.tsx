import React, { useState, useEffect, useRef } from 'react';
import { useStyleSystem } from './StyleSystemContext';
import { MediaType } from './types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface StylePreviewProps {
  mediaType: MediaType;
}

export const StylePreview: React.FC<StylePreviewProps> = ({ mediaType }) => {
  const { colorPalette, typography, spacing, applyStylesToElement } = useStyleSystem();
  const [elementId, setElementId] = useState('preview-element');
  const [customStyles, setCustomStyles] = useState('');
  const previewRef = useRef<HTMLDivElement>(null);
  
  const [elementColor, setElementColor] = useState('');
  const [elementBackgroundColor, setElementBackgroundColor] = useState('');
  const [elementFontFamily, setElementFontFamily] = useState('');
  const [elementFontSize, setElementFontSize] = useState('');
  const [elementFontWeight, setElementFontWeight] = useState('');
  const [elementPadding, setElementPadding] = useState('');
  const [elementMargin, setElementMargin] = useState('');

  useEffect(() => {
    // Apply initial styles based on context
    applyStyles();
  }, [colorPalette, typography, spacing, mediaType]);

  const applyStyles = () => {
    if (!previewRef.current) return;

    const element = previewRef.current;
    element.style.color = colorPalette.colors.foreground;
    element.style.backgroundColor = colorPalette.colors.background;
    element.style.fontFamily = typography.fontFamily;
    element.style.fontSize = typography.sizes.base;
    
    // Apply custom styles
    if (customStyles) {
      try {
        const parsedStyles = JSON.parse(customStyles);
        Object.assign(element.style, parsedStyles);
      } catch (e) {
        console.error("Invalid JSON:", e);
      }
    }
  };

  const handleApplyCustomStyle = () => {
    try {
      const parsedStyles = JSON.parse(customStyles);
      applyStylesToElement(elementId, parsedStyles);
    } catch (e) {
      console.error("Invalid JSON:", e);
    }
  };
  
  const handleApplyIndividualStyles = () => {
    applyStylesToElement(elementId, {
      color: elementColor,
      backgroundColor: elementBackgroundColor,
      fontFamily: elementFontFamily,
      fontSize: elementFontSize,
      fontWeight: elementFontWeight,
      padding: elementPadding,
      margin: elementMargin,
    });
  };

  const generateCSS = () => {
    const styles = {
      '--background': colorPalette.colors.background,
      '--foreground': colorPalette.colors.foreground,
      '--primary': colorPalette.colors.primary,
      '--secondary': colorPalette.colors.secondary,
      '--accent': colorPalette.colors.accent,
      '--muted': colorPalette.colors.muted,
      '--border': colorPalette.colors.border,
      '--font-family': typography.fontFamily,
      '--heading-font-weight': typography.heading.fontWeight,
      '--body-font-weight': typography.body.fontWeight,
      '--font-size-base': typography.sizes.base,
      '--line-height-base': typography.body.lineHeight,
      '--spacing-xs': spacing.scale.xs,
      '--spacing-sm': spacing.scale.sm,
      '--spacing-md': spacing.scale.md,
      '--spacing-lg': spacing.scale.lg,
      '--spacing-xl': spacing.scale.xl,
      '--spacing-2xl': spacing.scale['2xl'],
    };

    let cssContent = `:root {\n`;
    for (const key in styles) {
      if (styles.hasOwnProperty(key)) {
        cssContent += `  ${key}: ${styles[key]};\n`;
      }
    }
    cssContent += `}\n\nbody {\n  font-family: var(--font-family);\n  color: var(--foreground);\n  background-color: var(--background);\n}`;

    return cssContent;
  };

  const cssContent = generateCSS();

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Style Preview</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="element-id" className="mb-2 block">Element ID</Label>
            <Input 
              id="element-id" 
              type="text" 
              value={elementId} 
              onChange={(e) => setElementId(e.target.value)} 
              placeholder="Enter element ID"
            />
          </div>
          
          <div>
            <Label htmlFor="media-type" className="mb-2 block">Media Type</Label>
            <Select 
              defaultValue={mediaType} 
              onValueChange={(value) => console.log("Selected media type:", value)}
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="element-color" className="mb-2 block">Color</Label>
            <Input 
              id="element-color" 
              type="color" 
              value={elementColor} 
              onChange={(e) => setElementColor(e.target.value)} 
            />
          </div>
          
          <div>
            <Label htmlFor="element-bg-color" className="mb-2 block">Background Color</Label>
            <Input 
              id="element-bg-color" 
              type="color" 
              value={elementBackgroundColor} 
              onChange={(e) => setElementBackgroundColor(e.target.value)} 
            />
          </div>
          
          <div>
            <Label htmlFor="element-font-family" className="mb-2 block">Font Family</Label>
            <Input 
              id="element-font-family" 
              type="text" 
              value={elementFontFamily} 
              onChange={(e) => setElementFontFamily(e.target.value)} 
              placeholder="Font Family"
            />
          </div>
          
          <div>
            <Label htmlFor="element-font-size" className="mb-2 block">Font Size</Label>
            <Input 
              id="element-font-size" 
              type="text" 
              value={elementFontSize} 
              onChange={(e) => setElementFontSize(e.target.value)} 
              placeholder="Font Size"
            />
          </div>
          
          <div>
            <Label htmlFor="element-font-weight" className="mb-2 block">Font Weight</Label>
            <Input 
              id="element-font-weight" 
              type="text" 
              value={elementFontWeight} 
              onChange={(e) => setElementFontWeight(e.target.value)} 
              placeholder="Font Weight"
            />
          </div>
          
          <div>
            <Label htmlFor="element-padding" className="mb-2 block">Padding</Label>
            <Input 
              id="element-padding" 
              type="text" 
              value={elementPadding} 
              onChange={(e) => setElementPadding(e.target.value)} 
              placeholder="Padding"
            />
          </div>
          
          <div>
            <Label htmlFor="element-margin" className="mb-2 block">Margin</Label>
            <Input 
              id="element-margin" 
              type="text" 
              value={elementMargin} 
              onChange={(e) => setElementMargin(e.target.value)} 
              placeholder="Margin"
            />
          </div>
        </div>
        
        <Button onClick={handleApplyIndividualStyles}>Apply Individual Styles</Button>

        <div>
          <Label htmlFor="custom-styles" className="mb-2 block">Custom Styles (JSON)</Label>
          <Textarea
            id="custom-styles"
            value={customStyles}
            onChange={(e) => setCustomStyles(e.target.value)}
            placeholder='Enter JSON styles, e.g., {"color": "red", "fontSize": "20px"}'
            className="resize-none"
          />
        </div>
        <Button onClick={handleApplyCustomStyle}>Apply Custom Style</Button>

        <div className="border rounded-md p-4">
          <div id={elementId} ref={previewRef} className="p-4">
            <h1>Heading</h1>
            <p>
              This is a preview of the current style system. You can modify the
              styles using the controls above.
            </p>
          </div>
        </div>
        
        <details className="mt-4">
          <summary className="font-medium cursor-pointer">Show CSS Variables</summary>
          <pre className="bg-muted p-4 rounded-md text-xs overflow-x-auto">
            {cssContent}
          </pre>
        </details>
        
        <style dangerouslySetInnerHTML={{ __html: cssContent }} />
      </CardContent>
    </Card>
  );
};
