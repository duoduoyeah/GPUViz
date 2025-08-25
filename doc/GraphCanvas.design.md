# GraphCanvas Component Design

The graph will show the GPU architecture using Cytoscape.js with a clean, modular architecture.

## Input Requirements

1. Current level of the graph
2. Component data (what components to show)
3. For each component: shape, color (default: uniform color for simplicity)

## Architecture Overview

The GraphCanvas component follows a modular design with clear separation of concerns:

### File Structure & Responsibilities

#### `GraphConfig.ts` - Configuration constants, default styles, layout presets

- **Purpose**: Centralized configuration management
- **Contents**:
  - Graph styling constants (colors, sizes, animations)
  - Cytoscape style definitions
  - Layout presets (grid, hierarchical, force-directed, circle)
  - Component shape mappings
  - Default graph options

#### `GraphCore.ts` - Cytoscape lifecycle, container management, initialization

- **Purpose**: Core graph rendering and lifecycle management
- **Responsibilities**:
  - Cytoscape instance initialization and cleanup
  - Graph data updates and element management
  - Layout application and management
  - Container binding and DOM interaction
  - State tracking and validation

#### `GraphEvents.ts` - User interactions, Cytoscape event bridging, gesture handling

- **Purpose**: Event management and user interaction handling
- **Responsibilities**:
  - Cytoscape event binding and unbinding
  - Custom event emission and handling
  - Element selection management
  - User gesture processing (zoom, pan, click, hover)
  - Event state management (enable/disable)

#### `GraphCanvas.tsx` - Main React component that orchestrates everything

- **Purpose**: React integration and component orchestration
- **Responsibilities**:
  - React lifecycle management
  - Store integration and state synchronization
  - Component coordination between Core and Events
  - UI state management (loading, error, empty states)
  - External API exposure for debugging/testing

#### `GraphCanvas.styles.ts` - Style definitions (existing file)

- **Purpose**: React component styling
- **Contents**: CSS-in-JS styles for React components
