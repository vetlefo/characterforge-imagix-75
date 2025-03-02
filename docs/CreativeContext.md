
# Creative Context

The Creative Context is a central state management system that maintains information about all creative elements, their relationships, and the overall creative state.

## Purpose

The Creative Context provides a single source of truth for:

- Tracking created assets
- Managing relationships between elements
- Providing global access to creative state
- Enabling cross-component communication

## Core Concepts

### Assets

Assets are the fundamental building blocks of the creative process:

```typescript
interface Asset {
  id: string;
  type: "image" | "text" | "website" | "other";
  content: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  relationships: Relationship[];
  metadata: Record<string, any>;
}
```

### Relationships

Relationships define how assets are connected to each other:

```typescript
interface Relationship {
  id: string;
  sourceId: string;
  targetId: string;
  type: "inspiration" | "iteration" | "component" | "reference";
  strength: number; // 1-10
  createdAt: Date;
  metadata: Record<string, any>;
}
```

### State Structure

The Creative Context maintains a comprehensive state:

```typescript
interface CreativeContextState {
  activeDrawing: boolean;
  currentIntent: string;
  suggestionsVisible: boolean;
  lastPrompt: string;
  assets: Asset[];
  selectedAssetId: string | null;
}
```

## Usage

Components can access and update the Creative Context:

```typescript
// Import the context hook
import { useCreativeContext } from '../components/creative/CreativeContext';

// Inside a component
const { state, addAsset, updateAsset, removeAsset } = useCreativeContext();
```

## Technical Implementation

The Creative Context uses React's Context API with a reducer pattern to manage complex state operations. It provides an abstraction layer that isolates components from the details of state management and ensures consistency across the application.

