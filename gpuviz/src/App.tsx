// src/App.tsx
import React, { useState } from 'react';
import { AppLayout } from './components/Layout/AppLayout';
import { ConfigPanel } from './components/ConfigPanel/ConfigPanel';
import { GraphCanvas } from './components/GraphCanvas/GraphCanvas';
// Import your stores and utils here
// import { useGPUStore } from './store/gpuStore';
// import { generateGPUArchitecture } from './utils/gpuGenerator';
// import { calculateLayout } from './utils/graphHelpers';

const App: React.FC = () => {
  const [nodes, setNodes] = useState<any[]>([]);
  const [edges, setEdges] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleConfigChange = (config: any) => {
    // Update store with new config
    console.log('Config changed:', config);
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    
    // Simulate generation process
    setTimeout(() => {
      // Here you would:
      // 1. Call generateGPUArchitecture(config)
      // 2. Call calculateLayout(components)
      // 3. Update nodes and edges
      
      // Example placeholder nodes
      const exampleNodes = [
        {
          data: { id: 'shader-array-0', name: 'Shader Array 0', type: 'shader-array', color: '#4A90E2' },
          position: { x: 100, y: 100 },
          classes: ['gpu-component', 'shader-array']
        },
        {
          data: { id: 'mem-controller-0', name: 'Memory Controller 0', type: 'memory-controller', color: '#50C878' },
          position: { x: 150, y: 400 },
          classes: ['gpu-component', 'memory-controller']
        }
      ];
      
      setNodes(exampleNodes);
      setIsGenerating(false);
    }, 1000);
  };

  return (
    <AppLayout
      leftPanel={
        <ConfigPanel
          onConfigChange={handleConfigChange}
          onGenerate={handleGenerate}
        />
      }
      rightPanel={
        <GraphCanvas
          nodes={nodes}
          edges={edges}
          isLoading={isGenerating}
        />
      }
    />
  );
};

export default App;