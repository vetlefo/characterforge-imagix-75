
# Style System

The Style System maintains consistent visual styles across different elements and provides tools for style management.

## Features

- **Color Palette Management**: Create, save, and apply color schemes
- **Typography Controls**: Manage font families, sizes, and styles
- **Spacing System**: Consistent spacing and layout guidelines
- **Style Presets**: Save and reuse style combinations

## Components

### StyleSystem

The main component that houses all style management tools.

```typescript
// Basic usage with context provider
<StyleSystemProvider>
  <StyleSystem />
</StyleSystemProvider>
```

### ColorPaletteManager

Provides tools for creating and managing color palettes:

- Color selection and customization
- Palette saving and application
- Color harmony tools

### TypographyControls

Manages typography-related styles:

- Font family selection
- Size and weight controls
- Text styling options

### SpacingSystem

Defines consistent spacing rules:

- Margin and padding presets
- Layout grid configuration
- Responsive spacing adjustments

## Context Usage

The Style System uses React Context for global access:

```typescript
// Access style context in a component
import { useStyleSystem } from '../components/creative/StyleSystem/StyleSystemContext';

// Inside a component
const { styles, updateStyles, applyPreset } = useStyleSystem();
```

## Default Styles

The Style System comes with predefined defaults for quick starts:

```typescript
// Example of default styles structure
const defaultStyles = {
  colors: {
    primary: '#4F46E5',
    secondary: '#EC4899',
    // ...more colors
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    baseFontSize: '16px',
    // ...more typography settings
  },
  spacing: {
    unit: '4px',
    scale: [1, 2, 3, 4, 6, 8, 12, 16, 24],
    // ...more spacing settings
  }
};
```

## Technical Implementation

The Style System generates CSS variables and applies them to the document root, enabling consistent styling across the application. It maintains style state in context and provides an API for components to access and modify styles.

