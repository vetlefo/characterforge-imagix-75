
import React, { useState } from 'react';
import { useStyleSystem } from './StyleSystemContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

interface StyleCommandParserProps {
  onApply?: (styles: Record<string, any>) => void;
}

export const StyleCommandParser: React.FC<StyleCommandParserProps> = ({ onApply }) => {
  const [command, setCommand] = useState('');
  const [processing, setProcessing] = useState(false);
  
  const { 
    colorPalette, 
    typography, 
    spacing, 
    updateColorPalette, 
    updateTypography, 
    updateSpacing
  } = useStyleSystem();

  const parseColorCommand = (cmd: string) => {
    // Match "primary to #ff0000" or "set background color to blue"
    const colorRegex = /(?:set\s+)?(?:the\s+)?(?<colorName>primary|secondary|accent|background|foreground|muted|border)\s+(?:color\s+)?(?:to\s+)(?<colorValue>#[0-9a-f]{3,6}|[a-z]+)/i;
    const match = cmd.match(colorRegex);
    
    if (match?.groups) {
      const { colorName, colorValue } = match.groups;
      
      updateColorPalette({
        colors: {
          ...colorPalette.colors,
          [colorName.toLowerCase()]: colorValue
        }
      });
      
      toast.success(`Updated ${colorName} color to ${colorValue}`);
      return true;
    }
    return false;
  };

  const parseFontCommand = (cmd: string) => {
    // Match "font to Arial" or "set font family to Roboto"
    const fontRegex = /(?:set\s+)?(?:the\s+)?font(?:\s+family)?\s+(?:to\s+)(?<fontValue>[A-Za-z\s,'-]+)/i;
    const match = cmd.match(fontRegex);
    
    if (match?.groups) {
      const { fontValue } = match.groups;
      
      updateTypography({
        fontFamily: fontValue
      });
      
      toast.success(`Updated font family to ${fontValue}`);
      return true;
    }
    
    // Match "heading font size to 24px" or "set body weight to bold"
    const typographyRegex = /(?:set\s+)?(?:the\s+)?(?<textType>heading|body)\s+(?<property>font size|weight|line height|letter spacing)\s+(?:to\s+)(?<value>[A-Za-z0-9.]+(?:px|rem|em|%)?)/i;
    const typeMatch = cmd.match(typographyRegex);
    
    if (typeMatch?.groups) {
      const { textType, property, value } = typeMatch.groups;
      const textTypeKey = textType.toLowerCase() as 'heading' | 'body';
      
      let propertyKey: string;
      switch (property.toLowerCase()) {
        case 'font size':
          // Handle font size updates for specific sizes
          const sizeMatch = cmd.match(/(?:set\s+)?(?:the\s+)?(?<sizeKey>xs|sm|base|lg|xl|2xl|3xl)\s+(?:font\s+)?size\s+(?:to\s+)(?<value>[A-Za-z0-9.]+(?:px|rem|em|%)?)/i);
          
          if (sizeMatch?.groups) {
            const { sizeKey, value } = sizeMatch.groups;
            updateTypography({
              sizes: {
                ...typography.sizes,
                [sizeKey]: value
              }
            });
            
            toast.success(`Updated ${sizeKey} font size to ${value}`);
            return true;
          }
          return false;
        case 'weight':
          propertyKey = 'fontWeight';
          break;
        case 'line height':
          propertyKey = 'lineHeight';
          break;
        case 'letter spacing':
          propertyKey = 'letterSpacing';
          break;
        default:
          return false;
      }
      
      updateTypography({
        [textTypeKey]: {
          ...typography[textTypeKey],
          [propertyKey]: value
        }
      });
      
      toast.success(`Updated ${textType} ${property} to ${value}`);
      return true;
    }
    
    return false;
  };

  const parseSpacingCommand = (cmd: string) => {
    // Match "spacing xs to 4px" or "set container sm to 640px"
    const spacingRegex = /(?:set\s+)?(?:the\s+)?(?<type>spacing|container)\s+(?<size>xs|sm|md|lg|xl|2xl)\s+(?:to\s+)(?<value>[A-Za-z0-9.]+(?:px|rem|em|%)?)/i;
    const match = cmd.match(spacingRegex);
    
    if (match?.groups) {
      const { type, size, value } = match.groups;
      
      if (type.toLowerCase() === 'spacing') {
        updateSpacing({
          scale: {
            ...spacing.scale,
            [size]: value
          }
        });
      } else if (type.toLowerCase() === 'container') {
        updateSpacing({
          containerWidth: {
            ...spacing.containerWidth,
            [size]: value
          }
        });
      }
      
      toast.success(`Updated ${type} ${size} to ${value}`);
      return true;
    }
    
    return false;
  };

  const parseCommand = () => {
    setProcessing(true);
    
    try {
      // Try each parser in sequence
      const parsed = 
        parseColorCommand(command) || 
        parseFontCommand(command) || 
        parseSpacingCommand(command);
      
      if (!parsed) {
        toast.error("I couldn't understand that style command. Try something like 'set primary to #3b82f6' or 'font family to Inter'");
      } else if (onApply) {
        // If a callback was provided, send the updated styles
        onApply({
          colorPalette,
          typography,
          spacing
        });
      }
    } catch (error) {
      console.error("Error parsing style command:", error);
      toast.error("There was an error processing your style command");
    } finally {
      setProcessing(false);
      setCommand('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    parseCommand();
  };

  return (
    <Card className="mb-4">
      <CardContent className="pt-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            placeholder="E.g., 'set primary to #3b82f6' or 'font family to Inter'"
            className="flex-1"
            disabled={processing}
          />
          <Button type="submit" disabled={!command || processing}>
            Apply
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

