
# Technical Architecture

This document outlines the technical architecture of the Creative Platform, including component structure, data flow, and system design.

## Technology Stack

- **React**: Frontend library for building the user interface
- **TypeScript**: Type-safe JavaScript for improved development
- **Tailwind CSS**: Utility-first CSS framework for styling
- **ShadCN UI**: Component library for UI elements
- **Fabric.js**: Canvas manipulation library for drawing
- **React Router**: Navigation and routing

## Core Architecture

The application follows a component-based architecture with context providers for state management:

```
App
├── Routing (React Router)
│   ├── Index Page
│   ├── Drawing Editor
│   ├── Animation Preview
│   ├── Style System
│   └── Website Preview
├── Context Providers
│   ├── CreativeContext
│   ├── StyleSystemContext
│   └── AnimationContext
└── Shared Components
    ├── UI Components
    └── Creative Components
```

## Data Flow

The application uses a unidirectional data flow model:

1. User interacts with components
2. Components dispatch actions to context providers
3. Context providers update state
4. State changes trigger component re-renders
5. Components reflect the current state

## Context Providers

Context providers serve as centralized state management:

- **CreativeContext**: Manages creative assets and relationships
- **StyleSystemContext**: Maintains style definitions
- **AnimationContext**: Controls animation state and playback

## Component Types

### Page Components

Top-level components that represent entire pages:

- `Index`: Home page and entry point
- `DrawingEditor`: Drawing tools and canvas
- `AnimationPreviewPage`: Animation creation and preview
- `WebsitePreviewDemo`: Website code preview

### Feature Components

Components that implement specific features:

- `DrawingCanvas`: Interactive drawing area
- `AnimationSystem`: Animation tools and preview
- `StyleSystem`: Style management tools
- `WebsitePreview`: Code rendering and preview

### UI Components

Reusable interface elements:

- Buttons, inputs, tabs, etc.
- Layout components
- Navigation elements

## File Structure

```
src/
├── components/
│   ├── creative/
│   │   ├── AnimationSystem/
│   │   ├── AssetLibrary/
│   │   ├── CommandParser/
│   │   ├── StyleSystem/
│   │   └── ...
│   ├── draw/
│   │   ├── DrawingCanvas.tsx
│   │   └── DrawingToolbar.tsx
│   ├── preview/
│   │   └── WebsitePreview.tsx
│   └── ui/
│       └── ... (UI components)
├── pages/
│   ├── Index.tsx
│   ├── DrawingEditor.tsx
│   ├── AnimationPreviewPage.tsx
│   └── WebsitePreviewDemo.tsx
├── hooks/
│   └── ... (Custom hooks)
├── lib/
│   └── utils.ts
└── App.tsx
```

## State Management

The application uses React Context for state management instead of external libraries:

- Simplified state model for each domain
- Reducer pattern for complex state transitions
- Context providers with custom hooks for access

## Routing

React Router manages navigation between different sections:

- Each major feature has a dedicated route
- Navigation is accessible through the sidebar
- Routes are defined in the main App component

