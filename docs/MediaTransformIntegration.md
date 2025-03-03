
# Media Transform System Integration Guide

This document provides a comprehensive guide on how to properly integrate and connect the Media Transform system into your application.

## System Overview

The Media Transform system consists of several key components:

1. **MediaTransform Container Component** - Main entry point that manages the overall UI and tab state
2. **StyleExtractor** - Analyzes images and extracts style information
3. **CodeGenerator** - Transforms visual content into usable code
4. **AnimationGenerator** - Creates animations based on uploaded images
5. **MediaTransformContext** - Provides state management across the system

## Connection Points & Requirements

### 1. MediaTransform Component

This is the main container that manages the overall system. It needs:

- An optional `imageUrl` prop to initialize with an image
- An optional `activeTab` prop to control which tab is initially selected
- An optional `onTabChange` callback to notify parent components of tab changes

**Usage Example:**
```tsx
<MediaTransform 
  imageUrl="path/to/image.jpg"
  activeTab="animation"
  onTabChange={(tab) => console.log(`Tab changed to: ${tab}`)}
/>
```

### 2. AnimationGenerator Component

This component handles the creation of animations based on images:

- Requires an optional `imageUrl` prop
- Uses the MediaTransformContext to access shared state and functions
- Returns generated animations through the context

**Important Note:** The AnimationGenerator component must have the `imageUrl` prop properly defined in its interface to avoid TypeScript errors.

### 3. MediaTransformContext Integration

The context provides shared state and functions across the system:

- Wrap MediaTransform or higher-level components with `<MediaTransformProvider>`
- Access the context using the `useMediaTransform` hook in child components
- The context handles processing state, image URLs, and results storage

**Example:**
```tsx
import { MediaTransformProvider, useMediaTransform } from './MediaTransformContext';

// In a parent component
<MediaTransformProvider>
  <MediaTransform imageUrl={selectedImage} />
</MediaTransformProvider>

// In a child component
const { generateAnimationFromImage, isProcessing } = useMediaTransform();
```

## Common Issues & Solutions

### 1. TypeScript Prop Type Errors

Ensure all props are properly defined in component interfaces. Common places to check:

- `AnimationGeneratorProps` should include `imageUrl?: string;`
- Ensure proper TypeScript definitions for all response objects
- Check for missing prop definitions in other components (StyleExtractor, CodeGenerator)

### 2. Context Provider Missing

If you see errors related to context being undefined:

- Verify that MediaTransformProvider wraps all components that use the context
- Check that useMediaTransform is only called within components inside the provider
- Confirm import paths for context hooks are correct

### 3. Image Processing Issues

If images are not properly processed:

- Verify image URLs are correctly passed down the component tree
- Ensure image formats are supported (PNG, JPEG, WebP)
- Check that image processing functions in the context have proper error handling

## Complete Integration Checklist

1. ✅ Import MediaTransform into your component
2. ✅ Wrap with MediaTransformProvider if not already wrapped higher in the tree
3. ✅ Pass required props (imageUrl, activeTab, onTabChange)
4. ✅ Handle any events or callbacks from the MediaTransform component
5. ✅ Ensure all TypeScript interfaces are properly defined
6. ✅ Test each tab functionality (Style Extraction, Code Generation, Animation)
7. ✅ Implement any custom styles or adaptations needed for your UI

## Future Enhancements

- Add support for video input sources
- Implement more animation types and presets
- Create export options for generated content
- Add collaborative editing features
- Integrate with asset management systems

By following this guide, you should be able to successfully integrate the Media Transform system into your application and resolve any connection issues.
