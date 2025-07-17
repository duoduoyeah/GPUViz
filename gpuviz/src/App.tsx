// src/App.tsx
import React, { useEffect, useState } from 'react';
import { AppLayout } from './components/Layout/AppLayout';
import { ConfigPanel } from './components/ConfigPanel/ConfigPanel';
import { GraphCanvas } from './components/GraphCanvas/GraphCanvas';
import useGPUStore from './store/gpuStore';
import useGraphStore from './store/graphStore';
import { generateGPUArchitecture } from './utils/gpuGenerator';
import { calculateLayout, generateEdges } from './utils/graphHelpers';
import type { GPUConfig } from './models/gpu.types';

const App: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Get store hooks
  const { config, updateConfig } = useGPUStore();
  const { nodes, edges, setGraphData } = useGraphStore();

  // Generate initial architecture on mount
  useEffect(() => {
    handleGenerate();
  }, []);

  const handleConfigChange = (newConfig: GPUConfig) => {
    // Update the GPU store with new configuration
    updateConfig(newConfig);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    try {
      // Small delay for UI feedback
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Generate GPU components based on current config
      const components = generateGPUArchitecture(config);
      
      // Calculate layout for the components
      const layoutNodes = calculateLayout(components);
      
      // Generate edges between components
      const graphEdges = generateEdges(components);
      
      // Update the graph store with new data
      setGraphData(layoutNodes, graphEdges);
      
    } catch (error) {
      console.error('Error generating GPU architecture:', error);
    } finally {
      setIsGenerating(false);
    }
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