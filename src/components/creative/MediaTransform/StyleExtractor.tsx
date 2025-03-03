
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Wand2, Copy, Check, Palette } from 'lucide-react';
import { useMediaTransform } from './MediaTransformContext';

const StyleExtractor = () => {
  const { imageUrl, setExtractedStyles } = useMediaTransform();
  const [extracting, setExtracting] = useState(false);
  const [extracted, setExtracted] = useState(false);
  const [styles, setStyles] = useState<any>(null);
  const [copied, setCopied] = useState<{ [key: string]: boolean }>({});

  const handleExtractStyles = async () => {
    if (!imageUrl) return;
    
    setExtracting(true);
    
    // Simulate extraction with a delay
    setTimeout(() => {
      // Mock extracted styles
      const extractedData = {
        colors: {
          dominant: "#4A90E2",
          palette: ["#4A90E2", "#FFFFFF", "#333333", "#F5F5F5", "#E74C3C"],
          background: "#FFFFFF",
          text: "#333333",
          accent: "#E74C3C"
        },
        typography: {
          fontFamily: "Roboto, sans-serif",
          headingSize: "32px",
          bodySize: "16px",
          lineHeight: 1.5
        },
        spacing: {
          padding: "16px",
          margin: "24px",
          gap: "8px"
        }
      };
      
      setStyles(extractedData);
      setExtractedStyles(extractedData);
      setExtracting(false);
      setExtracted(true);
    }, 2000);
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied({ ...copied, [key]: true });
    setTimeout(() => {
      setCopied({ ...copied, [key]: false });
    }, 2000);
  };

  if (!imageUrl) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 bg-[#1A1A2E] rounded-full flex items-center justify-center mb-4">
          <Wand2 size={24} className="text-blue-400" />
        </div>
        <h3 className="text-xl font-medium mb-2">No Image Selected</h3>
        <p className="text-gray-400 mb-4">Select or upload an image to extract styles from</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-medium">Style Extraction</h3>
        <Button 
          onClick={handleExtractStyles} 
          disabled={extracting || !imageUrl}
          className="gap-2"
        >
          <Wand2 size={16} />
          {extracting ? "Extracting..." : extracted ? "Re-Extract" : "Extract Styles"}
        </Button>
      </div>
      
      {extracting && (
        <div className="flex flex-col items-center justify-center p-8">
          <div className="w-16 h-16 border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-300">Analyzing image and extracting styles...</p>
        </div>
      )}
      
      {styles && !extracting && (
        <Tabs defaultValue="colors" className="w-full">
          <TabsList className="w-full mb-4 bg-[#1A1A2E]">
            <TabsTrigger value="colors" className="flex-1">Colors</TabsTrigger>
            <TabsTrigger value="typography" className="flex-1">Typography</TabsTrigger>
            <TabsTrigger value="spacing" className="flex-1">Spacing</TabsTrigger>
          </TabsList>
          
          <TabsContent value="colors" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4 bg-[#1A1A2E]">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">Dominant Color</h4>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleCopy(styles.colors.dominant, 'dominant')} 
                    className="h-6 w-6"
                  >
                    {copied.dominant ? <Check size={14} /> : <Copy size={14} />}
                  </Button>
                </div>
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-md border border-white/10" 
                    style={{ backgroundColor: styles.colors.dominant }}
                  ></div>
                  <span className="font-mono text-sm">{styles.colors.dominant}</span>
                </div>
              </Card>
              
              <Card className="p-4 bg-[#1A1A2E]">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">Background</h4>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleCopy(styles.colors.background, 'background')} 
                    className="h-6 w-6"
                  >
                    {copied.background ? <Check size={14} /> : <Copy size={14} />}
                  </Button>
                </div>
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-md border border-white/10" 
                    style={{ backgroundColor: styles.colors.background }}
                  ></div>
                  <span className="font-mono text-sm">{styles.colors.background}</span>
                </div>
              </Card>
            </div>
            
            <Card className="p-4 bg-[#1A1A2E]">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">Color Palette</h4>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleCopy(styles.colors.palette.join(', '), 'palette')} 
                  className="h-6 w-6"
                >
                  {copied.palette ? <Check size={14} /> : <Copy size={14} />}
                </Button>
              </div>
              <div className="flex gap-2 flex-wrap">
                {styles.colors.palette.map((color: string, index: number) => (
                  <div key={index} className="flex flex-col items-center">
                    <div 
                      className="w-12 h-12 rounded-md border border-white/10" 
                      style={{ backgroundColor: color }}
                    ></div>
                    <span className="font-mono text-xs mt-1">{color}</span>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="typography" className="space-y-4">
            <Card className="p-4 bg-[#1A1A2E]">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">Font Family</h4>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleCopy(styles.typography.fontFamily, 'fontFamily')} 
                  className="h-6 w-6"
                >
                  {copied.fontFamily ? <Check size={14} /> : <Copy size={14} />}
                </Button>
              </div>
              <div className="p-3 bg-[#0F0F23] rounded-md">
                <span className="font-mono text-sm">{styles.typography.fontFamily}</span>
              </div>
            </Card>
            
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4 bg-[#1A1A2E]">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">Heading Size</h4>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleCopy(styles.typography.headingSize, 'headingSize')} 
                    className="h-6 w-6"
                  >
                    {copied.headingSize ? <Check size={14} /> : <Copy size={14} />}
                  </Button>
                </div>
                <div className="p-3 bg-[#0F0F23] rounded-md">
                  <span className="font-mono text-sm">{styles.typography.headingSize}</span>
                </div>
              </Card>
              
              <Card className="p-4 bg-[#1A1A2E]">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">Body Size</h4>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleCopy(styles.typography.bodySize, 'bodySize')} 
                    className="h-6 w-6"
                  >
                    {copied.bodySize ? <Check size={14} /> : <Copy size={14} />}
                  </Button>
                </div>
                <div className="p-3 bg-[#0F0F23] rounded-md">
                  <span className="font-mono text-sm">{styles.typography.bodySize}</span>
                </div>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="spacing" className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <Card className="p-4 bg-[#1A1A2E]">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">Padding</h4>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleCopy(styles.spacing.padding, 'padding')} 
                    className="h-6 w-6"
                  >
                    {copied.padding ? <Check size={14} /> : <Copy size={14} />}
                  </Button>
                </div>
                <div className="p-3 bg-[#0F0F23] rounded-md">
                  <span className="font-mono text-sm">{styles.spacing.padding}</span>
                </div>
              </Card>
              
              <Card className="p-4 bg-[#1A1A2E]">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">Margin</h4>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleCopy(styles.spacing.margin, 'margin')} 
                    className="h-6 w-6"
                  >
                    {copied.margin ? <Check size={14} /> : <Copy size={14} />}
                  </Button>
                </div>
                <div className="p-3 bg-[#0F0F23] rounded-md">
                  <span className="font-mono text-sm">{styles.spacing.margin}</span>
                </div>
              </Card>
              
              <Card className="p-4 bg-[#1A1A2E]">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">Gap</h4>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleCopy(styles.spacing.gap, 'gap')} 
                    className="h-6 w-6"
                  >
                    {copied.gap ? <Check size={14} /> : <Copy size={14} />}
                  </Button>
                </div>
                <div className="p-3 bg-[#0F0F23] rounded-md">
                  <span className="font-mono text-sm">{styles.spacing.gap}</span>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default StyleExtractor;
