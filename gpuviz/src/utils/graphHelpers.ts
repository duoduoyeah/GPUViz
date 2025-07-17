import type { GPUComponent } from '../models/gpu.types';
import type { GraphNode, GraphEdge } from '../models/graph.types';

export function calculateLayout(components: GPUComponent[]): GraphNode[] {
  // Group components by type
  const shaderArrays = components.filter(c => c.type === 'shader-array');
  const memControllers = components.filter(c => c.type === 'memory-controller');
  const others = components.filter(c => 
    !['shader-array', 'memory-controller'].includes(c.type)
  );
  
  const nodes: GraphNode[] = [];
  
  // Layout shader arrays in top row
  shaderArrays.forEach((sa, index) => {
    nodes.push({
      data: {
        id: sa.id,
        label: sa.name,
        type: sa.type,
        color: sa.color,
        properties: sa.properties
      },
      position: {
        x: 100 + (index * 200),
        y: 100
      },
      classes: ['gpu-component', sa.type]
    });
  });
  
  // Layout memory controllers in bottom row
  memControllers.forEach((mc, index) => {
    nodes.push({
      data: {
        id: mc.id,
        label: mc.name,
        type: mc.type,
        color: mc.color,
        properties: mc.properties
      },
      position: {
        x: 150 + (index * 250),
        y: 400
      },
      classes: ['gpu-component', mc.type]
    });
  });
  
  // Center other components
  others.forEach((comp, index) => {
    nodes.push({
      data: {
        id: comp.id,
        label: comp.name,
        type: comp.type,
        color: comp.color,
        properties: comp.properties
      },
      position: {
        x: 300 + (index * 150),
        y: 250
      },
      classes: ['gpu-component', comp.type]
    });
  });
  
  return nodes;
}

export function generateEdges(components: GPUComponent[]): GraphEdge[] {
  const edges: GraphEdge[] = [];
  const commandProcessor = components.find(c => c.type === 'command-processor');
  const l2Cache = components.find(c => c.type === 'cache');
  const shaderArrays = components.filter(c => c.type === 'shader-array');
  const memControllers = components.filter(c => c.type === 'memory-controller');
  
  if (!commandProcessor || !l2Cache) return edges;
  
  // Connect command processor to shader arrays
  shaderArrays.forEach(sa => {
    edges.push({
      data: {
        id: `edge-${commandProcessor.id}-${sa.id}`,
        source: commandProcessor.id,
        target: sa.id,
        type: 'command'
      }
    });
  });
  
  // Connect L2 cache to memory controllers
  memControllers.forEach(mc => {
    edges.push({
      data: {
        id: `edge-${l2Cache.id}-${mc.id}`,
        source: l2Cache.id,
        target: mc.id,
        type: 'memory'
      }
    });
  });
  
  // Connect shader arrays to L2 cache
  shaderArrays.forEach(sa => {
    edges.push({
      data: {
        id: `edge-${sa.id}-${l2Cache.id}`,
        source: sa.id,
        target: l2Cache.id,
        type: 'data'
      }
    });
  });
  
  return edges;
}