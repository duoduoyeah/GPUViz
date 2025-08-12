
# Phase 1: Foundation & Basic Visualization - Implementation Trace

## STEP 1: Project Infrastructure Setup

### 1.1 Initialize React project with TypeScript
```bash
npx create-react-app gpuviz --template typescript
cd gpuviz
npm install cytoscape @types/cytoscape
npm install zustand
npm install styled-components @types/styled-components
```

### 1.2 Project structure

```
gpuviz/
├── src/
│   ├── components/
│   │   ├── ConfigPanel/
│   │   │   ├── ConfigPanel.tsx
│   │   │   └── ConfigPanel.styles.ts
│   │   ├── GraphCanvas/
│   │   │   ├── GraphCanvas.tsx
│   │   │   └── GraphCanvas.styles.ts
│   │   └── Layout/
│   │       └── AppLayout.tsx
│   ├── models/
│   │   ├── gpu.types.ts
│   │   └── graph.types.ts
│   ├── store/
│   │   ├── gpuStore.ts
│   │   └── graphStore.ts
│   ├── utils/
│   │   ├── gpuGenerator.ts
│   │   └── graphHelpers.ts
│   └── App.tsx
```

## STEP 2: Design Data Model

### 2.1 GPU Component Types (models/gpu.types.ts)
```typescript
interface GPUConfig {
    memorySize: number;      // in GB
    coreCount: number;       // total cores
    shaderArrayCount: number;
    clockSpeed: number;      // in MHz
}

interface GPUComponent {
    id: string;
    type: 'shader-array' | 'memory-controller' | 'command-processor' | 'cache';
    name: string;
    properties: Record<string, any>;
    position?: { x: number; y: number };
    color: string;
}
```

### 2.2 Graph Types (models/graph.types.ts)
```typescript
interface GraphNode {
    data: {
        id: string;
        label: string;
        type: string;
        color: string;
        properties: Record<string, any>;
    };
    position: { x: number; y: number };
    classes: string[];
}

interface GraphEdge {
    data: {
        id: string;
        source: string;
        target: string;
        type: string;
    };
}
```

## STEP 3: Build Basic UI Components

### 3.1 ConfigPanel Component
- Input fields:
  - Memory Size (slider: 4-64 GB)
  - Core Count (slider: 1024-16384)
  - Shader Arrays (slider: 2-8)
  - Clock Speed (slider: 1000-2500 MHz)
- "Generate GPU" button
- Real-time validation

### 3.2 GraphCanvas Component
- Initialize Cytoscape instance
- Configure base styles:
  - Rectangle nodes with thicker borders
  - Consistent spacing (grid layout initially)
  - Color mapping by component type

### 3.3 AppLayout Component
- Split view: ConfigPanel (left, 300px) | GraphCanvas (right, flex)
- Responsive design considerations

## STEP 4: Implement State Management

### 4.1 GPU Store (store/gpuStore.ts)
```typescript
interface GPUStore {
    config: GPUConfig;
    components: GPUComponent[];
    updateConfig: (config: Partial<GPUConfig>) => void;
    generateArchitecture: () => void;
}
```

### 4.2 Graph Store (store/graphStore.ts)
```typescript
interface GraphStore {
    nodes: GraphNode[];
    edges: GraphEdge[];
    setGraphData: (nodes: GraphNode[], edges: GraphEdge[]) => void;
    updateNodePosition: (nodeId: string, position: Position) => void;
}
```

## STEP 5: GPU Architecture Generator

### 5.1 Generator Logic (utils/gpuGenerator.ts)l
```typescript
generateGPUArchitecture(config: GPUConfig): GPUComponent[] {
    components = []
    
    // Generate Shader Arrays
    for i in range(config.shaderArrayCount):
        components.push({
            id: `shader-array-${i}`,
            type: 'shader-array',
            name: `Shader Array ${i}`,
            properties: {
                coresPerArray: config.coreCount / config.shaderArrayCount
            },
            color: '#4A90E2'  // Blue
        })
    
    // Generate Memory Controllers
    memoryControllers = Math.ceil(config.memorySize / 8)  // 1 per 8GB
    for i in range(memoryControllers):
        components.push({
            id: `mem-controller-${i}`,
            type: 'memory-controller',
            name: `Memory Controller ${i}`,
            properties: {
                bandwidth: '256 GB/s'
            },
            color: '#50C878'  // Green
        })
    
    // Add Command Processor
    components.push({
        id: 'command-processor',
        type: 'command-processor',
        name: 'Command Processor',
        color: '#FF6B6B'  // Red
    })
    
    // Add L2 Cache
    components.push({
        id: 'l2-cache',
        type: 'cache',
        name: 'L2 Cache',
        properties: {
            size: '4 MB'
        },
        color: '#FFA500'  // Orange
    })
    
    return components
}
```

### 5.2 Layout Algorithm (utils/graphHelpers.ts)
```typescript
calculateLayout(components: GPUComponent[]): GraphNode[] {
    // Group by type
    shaderArrays = components.filter(c => c.type === 'shader-array')
    memControllers = components.filter(c => c.type === 'memory-controller')
    others = components.filter(c => !['shader-array', 'memory-controller'].includes(c.type))
    
    nodes = []
    
    // Layout shader arrays in top row
    shaderArrays.forEach((sa, index) => {
        nodes.push({
            data: { ...sa },
            position: {
                x: 100 + (index * 200),
                y: 100
            },
            classes: ['gpu-component', sa.type]
        })
    })
    
    // Layout memory controllers in bottom row
    memControllers.forEach((mc, index) => {
        nodes.push({
            data: { ...mc },
            position: {
                x: 150 + (index * 250),
                y: 400
            },
            classes: ['gpu-component', mc.type]
        })
    })
    
    // Center other components
    others.forEach((comp, index) => {
        nodes.push({
            data: { ...comp },
            position: {
                x: 300 + (index * 150),
                y: 250
            },
            classes: ['gpu-component', comp.type]
        })
    })
    
    return nodes
}
```

## STEP 6: Cytoscape Configuration

### 6.1 Base Styles Configuration
```javascript
const cytoscapeStylesheet = [
    {
        selector: 'node',
        style: {
            'shape': 'rectangle',
            'width': 150,
            'height': 80,
            'label': 'data(name)',
            'text-valign': 'center',
            'text-halign': 'center',
            'background-color': 'data(color)',
            'border-width': 3,
            'border-color': '#333',
            'font-size': 12,
            'font-weight': 'bold',
            'text-wrap': 'wrap',
            'text-max-width': 140
        }
    },
    {
        selector: 'edge',
        style: {
            'width': 2,
            'line-color': '#999',
            'target-arrow-color': '#999',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier'
        }
    }
]
```

### 6.2 Cytoscape Initialization
```javascript
const cy = cytoscape({
    container: containerRef.current,
    elements: [...nodes, ...edges],
    style: cytoscapeStylesheet,
    layout: {
        name: 'preset'  // Use our calculated positions
    },
    minZoom: 0.5,
    maxZoom: 2,
    wheelSensitivity: 0.1
})
```

## STEP 7: Integration Flow

### 7.1 User Flow
```
User adjusts config → ConfigPanel updates store → 
Store triggers generateArchitecture() → 
Generator creates components → 
Layout calculates positions → 
GraphCanvas renders with Cytoscape
```

### 7.2 Event Handlers
- Config change: Debounced update (300ms)
- Generate button: Immediate regeneration
- Node drag: Update position in store
- Canvas pan/zoom: Built-in Cytoscape handling

## STEP 8: Initial Testing Checklist

- [ ] Config panel properly updates all values
- [ ] GPU generation creates expected components
- [ ] Layout prevents overlapping components
- [ ] Colors correctly applied to component types
- [ ] Cytoscape renders without errors
- [ ] Basic pan/zoom functionality works
- [ ] Component count scales with configuration
- [ ] UI remains responsive during generation