// src/components/GraphCanvas/GraphCanvas.tsx
import React, { useEffect, useRef } from 'react';
import cytoscape from 'cytoscape';
import { CanvasContainer, CytoscapeContainer, LoadingOverlay } from './GraphCanvas.styles';

interface GraphCanvasProps {
  nodes: any[];
  edges: any[];
  isLoading?: boolean;
}

export const GraphCanvas: React.FC<GraphCanvasProps> = ({ nodes, edges, isLoading = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);

  // Cytoscape stylesheet configuration
  const cytoscapeStylesheet: any[] = [
    {
      selector: 'node',
      style: {
        'shape': 'rectangle',
        'width': 150,
        'height': 80,
        'label': 'data(label)',
        'text-valign': 'center',
        'text-halign': 'center',
        'background-color': 'data(color)',
        'border-width': 3,
        'border-color': '#333',
        'font-size': 14,
        'font-weight': 'bold',
        'text-wrap': 'wrap',
        'text-max-width': 140,
        'color': '#fff',
        'text-outline-width': 2,
        'text-outline-color': '#333'
      }
    },
    {
      selector: 'edge',
      style: {
        'width': 2,
        'line-color': '#999',
        'target-arrow-color': '#999',
        'target-arrow-shape': 'triangle',
        'curve-style': 'bezier',
        'arrow-scale': 1.5
      }
    },
    {
      selector: '.shader-array',
      style: {
        'background-color': '#4A90E2',
        'border-color': '#2E5C8A'
      }
    },
    {
      selector: '.memory-controller',
      style: {
        'background-color': '#50C878',
        'border-color': '#3A9B5C'
      }
    },
    {
      selector: '.command-processor',
      style: {
        'background-color': '#FF6B6B',
        'border-color': '#CC5555'
      }
    },
    {
      selector: '.cache',
      style: {
        'background-color': '#FFA500',
        'border-color': '#CC8400'
      }
    }
  ];

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize Cytoscape
    cyRef.current = cytoscape({
      container: containerRef.current,
      elements: [...nodes, ...edges],
      style: cytoscapeStylesheet,
      layout: {
        name: 'preset' // Use positions from nodes
      },
      minZoom: 0.5,
      maxZoom: 2,
      wheelSensitivity: 0.1,
      boxSelectionEnabled: false,
      autounselectify: true
    });

    // Enable node dragging
    cyRef.current.nodes().grabify();

    // Fit to viewport with padding
    cyRef.current.fit(undefined, 50);

    return () => {
      if (cyRef.current) {
        cyRef.current.destroy();
      }
    };
  }, []);

  // Update graph when nodes/edges change
  useEffect(() => {
    if (!cyRef.current) return;

    cyRef.current.elements().remove();
    cyRef.current.add([...nodes, ...edges]);
    cyRef.current.layout({ name: 'preset' }).run();
    
    // Fit to viewport after updating
    setTimeout(() => {
      cyRef.current?.fit(undefined, 50);
    }, 100);
  }, [nodes, edges]);

  return (
    <CanvasContainer>
      <CytoscapeContainer ref={containerRef} />
      {isLoading && <LoadingOverlay>Generating GPU Architecture...</LoadingOverlay>}
    </CanvasContainer>
  );
};