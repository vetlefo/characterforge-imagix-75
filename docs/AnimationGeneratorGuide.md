
# Animation Generator Component Guide

This document provides detailed information on how to use and integrate the AnimationGenerator component within the Media Transform system.

## Component Overview

The AnimationGenerator component allows users to:
1. Upload images or use an existing image URL
2. Generate CSS animations based on the image content
3. View and copy generated animations
4. Apply animations to elements in your application

## Props & Configuration

The AnimationGenerator component accepts the following props:

```typescript
interface AnimationGeneratorProps {
  imageUrl?: string;  // Optional image URL to initialize with
}
```

## Integration with MediaTransformContext

The AnimationGenerator relies on the MediaTransformContext for several key functions:

- `generateAnimationFromImage`: Processes an image and creates animations
- `isProcessing`: Boolean flag indicating if animation generation is in progress
- `generatedAnimations`: Array of previously generated animations

## Usage Examples

### Basic Usage within MediaTransform

The AnimationGenerator is typically used as a tab within the MediaTransform component:

```tsx
<MediaTransform imageUrl="path/to/image.jpg" activeTab="animation" />
```

### Standalone Usage

You can also use the AnimationGenerator independently:

```tsx
import { MediaTransformProvider } from './MediaTransformContext';
import AnimationGenerator from './AnimationGenerator';

const MyComponent = () => {
  return (
    <MediaTransformProvider>
      <AnimationGenerator imageUrl="path/to/image.jpg" />
    </MediaTransformProvider>
  );
};
```

## Implementation Details

### State Management

The component manages several internal states:
- `selectedTab`: Controls which tab is active ('upload' or 'results')
- `uploadedImageUrl`: Stores the current image being used
- `isGenerating`: Tracks local generation state

### Image Upload Flow

1. User clicks the upload button or drags an image
2. `handleFileChange` processes the file and sets `uploadedImageUrl`
3. Image is displayed with a preview and "Change" button
4. User clicks "Generate Animation" to process the image

### Animation Generation Process

1. `handleGenerate` is called when the user clicks the generate button
2. Sets local `isGenerating` state to true
3. Calls `generateAnimationFromImage` from context with the image URL
4. When complete, the new animation is added to `generatedAnimations` in context
5. Results tab shows all generated animations

## Animation Result Format

Each generated animation has the following structure:

```typescript
interface GeneratedAnimation {
  id: string;           // Unique identifier
  css: string;          // Complete CSS animation code
  duration: number;     // Animation duration in milliseconds
  timingFunction: string; // CSS timing function (ease, linear, etc.)
  keyframes: AnimationKeyframe[]; // Array of keyframe definitions
}

interface AnimationKeyframe {
  id: string;
  time: number;        // Percentage point in the animation (0-100)
  properties: Record<string, string>; // CSS properties to animate
}
```

## Common Issues & Troubleshooting

### TypeScript Prop Errors

If you encounter TypeScript errors related to props:
- Ensure the `AnimationGeneratorProps` interface includes `imageUrl?: string;`
- Check that all prop usages match their interface definitions

### Image Processing Failures

If images fail to process:
- Verify the image is a supported format (JPEG, PNG, WebP)
- Check that the image URL is valid and accessible
- Ensure the MediaTransformContext provider is properly set up

### Animation Generation Times Out

If animation generation seems to hang:
- The default implementation uses a timeout to simulate processing
- In a production environment, you would replace this with a real API call
- Check the implementation of `generateAnimationFromImage` in your context

## Extending the Component

To add new features to the AnimationGenerator:

1. **Add New Animation Types**:
   - Extend the context to support different animation generation methods
   - Add UI controls for selecting animation types

2. **Custom Animation Parameters**:
   - Add form controls for duration, timing function, etc.
   - Update the context to accept these parameters

3. **Preview Improvements**:
   - Add a live preview panel that applies animations to elements
   - Implement controls for testing different animation settings

## Integration with Other Systems

The AnimationGenerator works well with:

- **Asset Library**: Save generated animations as reusable assets
- **Code Generator**: Convert animations to framework-specific code
- **Style System**: Apply animations within your design system
- **Website Preview**: Test animations in a live preview environment

By following this guide, you should be able to successfully integrate and use the AnimationGenerator component in your application.
