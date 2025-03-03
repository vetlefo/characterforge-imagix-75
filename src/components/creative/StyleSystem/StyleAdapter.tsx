
import React from 'react';
import { useStyleSystem } from './StyleSystemContext';
import { ColorPalette, Typography, Spacing } from './types';

export type MediaType = 'drawing' | 'animation' | 'website' | 'text';

export interface StyleAdapterProps {
  mediaType: MediaType;
  elementId?: string;
  children?: React.ReactNode;
}

const mediaTypeStyleMaps = {
  drawing: {
    applyColorPalette: (palette: ColorPalette, elementId?: string) => {
      // Apply colors to drawing canvas or elements
      console.log(`Applying color palette ${palette.name} to drawing ${elementId || 'canvas'}`);
      return {
        stroke: palette.colors.primary,
        fill: palette.colors.secondary,
        background: palette.colors.background
      };
    },
    applyTypography: (typography: Typography, elementId?: string) => {
      // Apply typography to drawing text elements
      console.log(`Applying typography ${typography.name} to drawing text ${elementId || 'elements'}`);
      return {
        fontFamily: typography.fontFamily,
        fontSize: typography.sizes.base,
        fontWeight: typography.body.fontWeight
      };
    },
    applySpacing: (spacing: Spacing, elementId?: string) => {
      // Apply spacing to drawing layout
      console.log(`Applying spacing ${spacing.name} to drawing layout ${elementId || 'canvas'}`);
      return {
        padding: spacing.scale.md,
        margin: spacing.scale.sm,
        gap: spacing.scale.xs
      };
    }
  },
  animation: {
    applyColorPalette: (palette: ColorPalette, elementId?: string) => {
      // Apply colors to animated elements
      console.log(`Applying color palette ${palette.name} to animation ${elementId || 'element'}`);
      return {
        backgroundColor: palette.colors.primary,
        borderColor: palette.colors.border,
        color: palette.colors.foreground
      };
    },
    applyTypography: (typography: Typography, elementId?: string) => {
      // Apply typography to animated text
      console.log(`Applying typography ${typography.name} to animated text ${elementId || 'element'}`);
      return {
        fontFamily: typography.fontFamily,
        fontSize: typography.sizes.base,
        lineHeight: typography.body.lineHeight
      };
    },
    applySpacing: (spacing: Spacing, elementId?: string) => {
      // Apply spacing to animation timings
      console.log(`Applying spacing ${spacing.name} to animation timings ${elementId || 'element'}`);
      return {
        duration: `calc(${spacing.scale.md} * 100)`,
        delay: `calc(${spacing.scale.xs} * 100)`,
        distance: spacing.scale.lg
      };
    }
  },
  website: {
    applyColorPalette: (palette: ColorPalette, elementId?: string) => {
      // Apply colors to website elements
      console.log(`Applying color palette ${palette.name} to website ${elementId || 'element'}`);
      return {
        '--background': palette.colors.background,
        '--foreground': palette.colors.foreground,
        '--primary': palette.colors.primary,
        '--secondary': palette.colors.secondary,
        '--accent': palette.colors.accent,
        '--muted': palette.colors.muted,
        '--border': palette.colors.border
      };
    },
    applyTypography: (typography: Typography, elementId?: string) => {
      // Apply typography to website text
      console.log(`Applying typography ${typography.name} to website text ${elementId || 'elements'}`);
      return {
        '--font-family': typography.fontFamily,
        '--heading-font-weight': typography.heading.fontWeight,
        '--body-font-weight': typography.body.fontWeight,
        '--font-size-base': typography.sizes.base,
        '--line-height-base': typography.body.lineHeight
      };
    },
    applySpacing: (spacing: Spacing, elementId?: string) => {
      // Apply spacing to website layout
      console.log(`Applying spacing ${spacing.name} to website layout ${elementId || 'elements'}`);
      return {
        '--spacing-xs': spacing.scale.xs,
        '--spacing-sm': spacing.scale.sm,
        '--spacing-md': spacing.scale.md,
        '--spacing-lg': spacing.scale.lg,
        '--spacing-xl': spacing.scale.xl,
        '--container-sm': spacing.containerWidth.sm,
        '--container-md': spacing.containerWidth.md,
        '--container-lg': spacing.containerWidth.lg
      };
    }
  },
  text: {
    applyColorPalette: (palette: ColorPalette, elementId?: string) => {
      // Apply colors to text elements
      console.log(`Applying color palette ${palette.name} to text ${elementId || 'element'}`);
      return {
        color: palette.colors.foreground,
        backgroundColor: palette.colors.background,
        borderColor: palette.colors.border
      };
    },
    applyTypography: (typography: Typography, elementId?: string) => {
      // Apply typography to text
      console.log(`Applying typography ${typography.name} to text ${elementId || 'element'}`);
      return {
        fontFamily: typography.fontFamily,
        fontSize: typography.sizes.base,
        fontWeight: typography.body.fontWeight,
        lineHeight: typography.body.lineHeight,
        letterSpacing: typography.body.letterSpacing
      };
    },
    applySpacing: (spacing: Spacing, elementId?: string) => {
      // Apply spacing to text layout
      console.log(`Applying spacing ${spacing.name} to text layout ${elementId || 'element'}`);
      return {
        padding: spacing.scale.sm,
        margin: spacing.scale.xs,
        gap: spacing.scale.xs
      };
    }
  }
};

export const StyleAdapter: React.FC<StyleAdapterProps> = ({ 
  mediaType, 
  elementId,
  children 
}) => {
  const { 
    colorPalette, 
    typography, 
    spacing,
    applyStylesToElement
  } = useStyleSystem();

  React.useEffect(() => {
    if (!mediaTypeStyleMaps[mediaType]) {
      console.warn(`Style adapter not implemented for media type: ${mediaType}`);
      return;
    }

    // Apply all style types to the element or container
    const colorStyles = mediaTypeStyleMaps[mediaType].applyColorPalette(colorPalette, elementId);
    const typographyStyles = mediaTypeStyleMaps[mediaType].applyTypography(typography, elementId);
    const spacingStyles = mediaTypeStyleMaps[mediaType].applySpacing(spacing, elementId);

    // Combine all styles
    const combinedStyles = {
      ...colorStyles,
      ...typographyStyles,
      ...spacingStyles
    };

    // Apply styles to element if ID is provided
    if (elementId) {
      applyStylesToElement(elementId, combinedStyles);
    }

    // Log the styles being applied
    console.log(`Applied ${mediaType} styles:`, combinedStyles);

  }, [mediaType, elementId, colorPalette, typography, spacing, applyStylesToElement]);

  return <>{children}</>;
};

