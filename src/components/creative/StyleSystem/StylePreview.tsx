
import React from 'react';
import { useStyleSystem } from './StyleSystemContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { MediaType } from './StyleAdapter';

interface StylePreviewProps {
  mediaType: MediaType;
}

export const StylePreview: React.FC<StylePreviewProps> = ({ mediaType }) => {
  const { colorPalette, typography, spacing } = useStyleSystem();

  const renderColorPalette = () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-2">Color Palette: {colorPalette.name}</h3>
        <div className="grid grid-cols-4 gap-2 md:grid-cols-7">
          {Object.entries(colorPalette.colors).map(([name, color]) => (
            <div key={name} className="flex flex-col items-center">
              <div 
                className="w-12 h-12 rounded-md border border-border/40"
                style={{ backgroundColor: color }}
              />
              <span className="text-xs mt-1">{name}</span>
              <span className="text-xs text-muted-foreground">{color}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTypography = () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-2">Typography: {typography.name}</h3>
        <div className="space-y-2">
          <div className="p-2 border border-border/40 rounded-md">
            <p className="mb-1 text-xs text-muted-foreground">Font Family</p>
            <p style={{ fontFamily: typography.fontFamily }}>{typography.fontFamily}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="p-2 border border-border/40 rounded-md">
              <p className="mb-1 text-xs text-muted-foreground">Heading</p>
              <p style={{ 
                fontWeight: typography.heading.fontWeight,
                lineHeight: typography.heading.lineHeight,
                letterSpacing: typography.heading.letterSpacing
              }}>
                Weight: {typography.heading.fontWeight}, 
                Line height: {typography.heading.lineHeight}, 
                Letter spacing: {typography.heading.letterSpacing}
              </p>
            </div>
            
            <div className="p-2 border border-border/40 rounded-md">
              <p className="mb-1 text-xs text-muted-foreground">Body</p>
              <p style={{ 
                fontWeight: typography.body.fontWeight,
                lineHeight: typography.body.lineHeight,
                letterSpacing: typography.body.letterSpacing
              }}>
                Weight: {typography.body.fontWeight}, 
                Line height: {typography.body.lineHeight}, 
                Letter spacing: {typography.body.letterSpacing}
              </p>
            </div>
          </div>
          
          <div className="p-2 border border-border/40 rounded-md">
            <p className="mb-1 text-xs text-muted-foreground">Font Sizes</p>
            <div className="space-y-1">
              {Object.entries(typography.sizes).map(([size, value]) => (
                <p key={size} style={{ fontSize: value }}>
                  {size}: {value}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSpacing = () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-2">Spacing: {spacing.name}</h3>
        <div className="space-y-4">
          <div>
            <p className="mb-1 text-xs text-muted-foreground">Scale</p>
            <div className="flex items-end gap-2 border border-border/40 p-3 rounded-md">
              {Object.entries(spacing.scale).map(([size, value]) => (
                <div key={size} className="flex flex-col items-center">
                  <div 
                    className="bg-primary/80 rounded-sm" 
                    style={{ 
                      width: value,
                      height: value 
                    }}
                  />
                  <span className="text-xs mt-1">{size}</span>
                  <span className="text-xs text-muted-foreground">{value}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <p className="mb-1 text-xs text-muted-foreground">Container Widths</p>
            <div className="space-y-2">
              {Object.entries(spacing.containerWidth).map(([size, value]) => (
                <div key={size} className="relative h-6 bg-primary/10 rounded-md overflow-hidden">
                  <div 
                    className="absolute top-0 left-0 h-full bg-primary/30 rounded-l-md"
                    style={{ width: `min(100%, calc(${value} / 10))` }}
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-xs">
                    {size}: {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Media-specific preview components
  const renderMediaPreview = () => {
    switch (mediaType) {
      case 'drawing':
        return (
          <div className="p-4 border border-border/40 rounded-md bg-card/50">
            <h3 className="text-sm font-medium mb-4">Drawing Preview</h3>
            <div 
              className="relative w-full h-32 rounded-md border border-border/40"
              style={{ backgroundColor: colorPalette.colors.background }}
            >
              {/* Sample drawing elements */}
              <div 
                className="absolute top-1/4 left-1/4 w-16 h-16 rounded-full"
                style={{ backgroundColor: colorPalette.colors.primary }}
              />
              <div 
                className="absolute bottom-1/4 right-1/4 w-16 h-16"
                style={{ backgroundColor: colorPalette.colors.secondary }}
              />
              <div 
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center"
                style={{ 
                  color: colorPalette.colors.foreground,
                  fontFamily: typography.fontFamily,
                  fontSize: typography.sizes.base,
                  fontWeight: typography.body.fontWeight
                }}
              >
                Sample Text
              </div>
            </div>
          </div>
        );
        
      case 'website':
        return (
          <div 
            className="p-4 border border-border/40 rounded-md"
            style={{ backgroundColor: colorPalette.colors.background }}
          >
            <div className="mb-4 pb-2 border-b" style={{ borderColor: colorPalette.colors.border }}>
              <h3 
                className="font-medium"
                style={{ 
                  color: colorPalette.colors.foreground,
                  fontFamily: typography.fontFamily,
                  fontSize: typography.sizes.lg,
                  fontWeight: typography.heading.fontWeight
                }}
              >
                Website Preview
              </h3>
            </div>
            
            <div 
              className="mb-4 p-2 rounded-md"
              style={{ backgroundColor: colorPalette.colors.secondary }}
            >
              <h4 
                style={{ 
                  color: colorPalette.colors.foreground,
                  fontFamily: typography.fontFamily,
                  fontSize: typography.sizes.base,
                  fontWeight: typography.heading.fontWeight
                }}
              >
                Navigation
              </h4>
            </div>
            
            <div className="flex gap-4 mb-4">
              <div 
                className="flex-1 p-2 rounded-md"
                style={{ backgroundColor: colorPalette.colors.muted }}
              >
                <h5 
                  className="mb-2"
                  style={{ 
                    color: colorPalette.colors.foreground,
                    fontFamily: typography.fontFamily,
                    fontSize: typography.sizes.sm,
                    fontWeight: typography.heading.fontWeight
                  }}
                >
                  Sidebar
                </h5>
              </div>
              
              <div className="flex-3">
                <h5 
                  className="mb-2"
                  style={{ 
                    color: colorPalette.colors.foreground,
                    fontFamily: typography.fontFamily,
                    fontSize: typography.sizes.base,
                    fontWeight: typography.heading.fontWeight
                  }}
                >
                  Main Content
                </h5>
                <p
                  style={{ 
                    color: colorPalette.colors.foreground,
                    fontFamily: typography.fontFamily,
                    fontSize: typography.sizes.sm,
                    fontWeight: typography.body.fontWeight,
                    lineHeight: typography.body.lineHeight
                  }}
                >
                  Sample content with the applied typography and colors.
                </p>
                <button
                  className="mt-2 px-3 py-1 rounded-md"
                  style={{ 
                    backgroundColor: colorPalette.colors.primary,
                    color: colorPalette.colors.background,
                    fontFamily: typography.fontFamily,
                    fontSize: typography.sizes.sm,
                    fontWeight: typography.body.fontWeight,
                    padding: spacing.scale.xs,
                  }}
                >
                  Button
                </button>
              </div>
            </div>
          </div>
        );
        
      case 'animation':
        return (
          <div className="p-4 border border-border/40 rounded-md">
            <h3 className="text-sm font-medium mb-4">Animation Preview</h3>
            <div className="flex justify-center">
              <div 
                className="w-16 h-16 rounded-md animate-pulse"
                style={{ 
                  backgroundColor: colorPalette.colors.primary,
                  animationDuration: `calc(${spacing.scale.lg} * 100)`,
                }}
              />
            </div>
            <div className="mt-4 w-full bg-muted h-2 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full animate-[progressAnimation_2s_ease-in-out_infinite]"
                style={{ 
                  backgroundColor: colorPalette.colors.accent,
                  width: '60%',
                }}
              />
            </div>
            <style jsx>{`
              @keyframes progressAnimation {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
              }
            `}</style>
          </div>
        );
        
      case 'text':
        return (
          <div 
            className="p-4 border border-border/40 rounded-md"
            style={{ backgroundColor: colorPalette.colors.background }}
          >
            <h3 
              className="mb-2"
              style={{ 
                color: colorPalette.colors.foreground,
                fontFamily: typography.fontFamily,
                fontSize: typography.sizes.lg,
                fontWeight: typography.heading.fontWeight,
                lineHeight: typography.heading.lineHeight,
                letterSpacing: typography.heading.letterSpacing
              }}
            >
              Text Styling Preview
            </h3>
            
            <p
              className="mb-2"
              style={{ 
                color: colorPalette.colors.foreground,
                fontFamily: typography.fontFamily,
                fontSize: typography.sizes.base,
                fontWeight: typography.body.fontWeight,
                lineHeight: typography.body.lineHeight,
                letterSpacing: typography.body.letterSpacing,
                marginBottom: spacing.scale.md
              }}
            >
              This paragraph demonstrates the body text styling with the current typography settings.
            </p>
            
            <div
              className="p-2 rounded-md mb-2"
              style={{ 
                backgroundColor: colorPalette.colors.muted,
                borderRadius: spacing.scale.xs,
                padding: spacing.scale.sm
              }}
            >
              <span
                style={{ 
                  color: colorPalette.colors.accent,
                  fontFamily: typography.fontFamily,
                  fontSize: typography.sizes.sm,
                  fontWeight: typography.body.fontWeight
                }}
              >
                Accent colored text in a muted background container
              </span>
            </div>
            
            <div className="flex gap-2">
              <span
                className="px-2 py-1 rounded-full"
                style={{ 
                  backgroundColor: colorPalette.colors.primary,
                  color: colorPalette.colors.background,
                  fontFamily: typography.fontFamily,
                  fontSize: typography.sizes.xs,
                  padding: `${spacing.scale.xs} ${spacing.scale.sm}`
                }}
              >
                Tag
              </span>
              
              <span
                className="px-2 py-1 rounded-full"
                style={{ 
                  backgroundColor: colorPalette.colors.secondary,
                  color: colorPalette.colors.background,
                  fontFamily: typography.fontFamily,
                  fontSize: typography.sizes.xs,
                  padding: `${spacing.scale.xs} ${spacing.scale.sm}`
                }}
              >
                Another Tag
              </span>
            </div>
          </div>
        );
        
      default:
        return (
          <div className="p-4 border border-border/40 rounded-md">
            <p className="text-muted-foreground">No preview available for {mediaType}</p>
          </div>
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Style Preview - {mediaType.charAt(0).toUpperCase() + mediaType.slice(1)}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="preview">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="preview" className="flex-1">Preview</TabsTrigger>
            <TabsTrigger value="colors" className="flex-1">Colors</TabsTrigger>
            <TabsTrigger value="typography" className="flex-1">Typography</TabsTrigger>
            <TabsTrigger value="spacing" className="flex-1">Spacing</TabsTrigger>
          </TabsList>
          
          <TabsContent value="preview">
            {renderMediaPreview()}
          </TabsContent>
          
          <TabsContent value="colors">
            {renderColorPalette()}
          </TabsContent>
          
          <TabsContent value="typography">
            {renderTypography()}
          </TabsContent>
          
          <TabsContent value="spacing">
            {renderSpacing()}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

