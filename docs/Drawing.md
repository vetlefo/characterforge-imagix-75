
# Drawing System

The Drawing System provides a powerful canvas for visual creation with multiple tools and advanced capabilities.

## Features

- **Multiple Brush Types**: Pencil, spray, and eraser tools
- **Layer Management**: Create and manage multiple layers for complex compositions
- **Shape Tools**: Add rectangles, circles, and lines
- **Undo/Redo System**: Track changes and revert when needed
- **Image Import**: Upload or paste images directly into the canvas
- **Interactive Background**: Aesthetic, responsive background elements

## Components

### DrawingCanvas

The primary component for drawing functionality. It leverages the Fabric.js library to provide a robust drawing experience.

```typescript
interface DrawingCanvasProps {
  width?: number;
  height?: number;
  onSave?: (dataUrl: string) => void;
  className?: string;
  initialImage?: string | null;
}
```

#### Usage

```tsx
<DrawingCanvas 
  width={1024}
  height={576}
  onSave={handleSave}
  initialImage={canvasImage}
/>
```

### DrawingToolbar

Provides UI controls for interacting with the canvas, including:

- Tool selection (pencil, spray, eraser, shapes)
- Color picker
- Brush size adjustment
- Layer management
- Clear canvas
- Undo/Redo actions

## Drawing Modes

1. **Pencil**: Freehand drawing with customizable width and color
2. **Spray**: Creates a spray-paint effect with adjustable density
3. **Eraser**: Removes previously drawn elements
4. **Shapes**: Add geometric shapes (rectangle, circle, line)
5. **Select**: Move, resize, and manipulate drawn elements

## Layer System

The drawing system supports multiple layers allowing for complex compositions:

- Create new layers for organizing content
- Switch between layers to edit specific elements
- Planned: Visibility toggles and blend modes for advanced control

## Technical Implementation

The drawing system uses Fabric.js as its foundation, with custom enhancements for the user interface and experience. It maintains a history state for undo/redo operations and implements a custom ethereal background effect for aesthetic appeal.

