
# Asset Library

The Asset Library organizes and displays created elements, enabling reuse and management of creative assets.

## Features

- **Visual Gallery**: Browse assets in a visual interface
- **Filtering and Search**: Find assets by type, tag, or content
- **Asset Reuse**: Import existing assets into new contexts
- **Metadata Management**: View and edit asset information

## Components

### AssetLibrary

The main container component for the asset management system.

```typescript
// Basic usage
<AssetLibrary />
```

### AssetCard

Displays an individual asset with preview and controls.

### AssetFilters

Provides filtering and sorting options for the asset gallery.

### AssetSearch

Enables text-based searching of assets.

### EmptyState

Displays guidance when no assets are available.

## Asset Types

The library supports multiple asset types:

1. **Images**: Drawings, photos, and visual elements
2. **Text**: Formatted text content and notes
3. **Websites**: Saved HTML/CSS/JS compositions
4. **Other**: Miscellaneous creative elements

## Technical Implementation

The Asset Library interfaces with the Creative Context to access and manage assets. It provides a visual interface on top of the underlying data structure, with components for display, filtering, and interaction.

## Usage Workflow

1. Create assets using various tools (Drawing, Animation, etc.)
2. Assets are automatically added to the library
3. Browse, filter, and search to find existing assets
4. Reuse assets by importing them into current projects
5. Manage asset metadata and relationships

