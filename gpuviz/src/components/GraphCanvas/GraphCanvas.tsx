import React, { useEffect, useRef, useState } from 'react';
import cytoscape from 'cytoscape';
import useGpuStore from '../../store/gpuStore';
import type { Graph } from '../../types';
import { styles, cytoscapeStyles, cytoscapeLayout } from './GraphCanvas.styles';

export const GraphCanvas: React.FC = () => {
  const cyRef = useRef<HTMLDivElement>(null);
  const cyInstance = useRef<cytoscape.Core | null>(null);
  const [selectedNodeInfo, setSelectedNodeInfo] = useState<any>(null);
  const [debugUpdateCounter, setDebugUpdateCounter] = useState(0);

  const { 
    currentGraph, 
    loading, 
    error, 
    selectedNode, 
    selectNode
  } = useGpuStore();

  // Debug data for testing
  const getDebugGraph = (): Graph => {
    const baseNodes = [
      {
        data: {
          id: 'node1',
          label: `GPU Core ${debugUpdateCounter}`,
          type: 'gpu',
          level: 0,
          utilization: Math.random() * 100
        }
      },
      {
        data: {
          id: 'node2',
          label: `Memory ${debugUpdateCounter}`,
          type: 'memory',
          level: 1,
          size: `${8 + debugUpdateCounter}GB`
        }
      },
      {
        data: {
          id: 'node3',
          label: `Shader ${debugUpdateCounter}`,
          type: 'shader',
          level: 2,
          active: debugUpdateCounter % 2 === 0
        }
      }
    ];

    // Add more nodes based on update counter
    if (debugUpdateCounter > 2) {
      baseNodes.push({
        data: {
          id: 'node4',
          label: `Cache ${debugUpdateCounter}`,
          type: 'cache',
          level: 1,
          hitRate: Math.random() * 100
        }
      });
    }

    return {
      nodes: baseNodes,
      edges: [] // TODO: Add edges later
    };
  };

  // Initialize Cytoscape instance
  useEffect(() => {
    if (cyRef.current && !cyInstance.current) {
      cyInstance.current = cytoscape({
        container: cyRef.current,
        style: cytoscapeStyles,
        layout: cytoscapeLayout,
        userZoomingEnabled: true,
        userPanningEnabled: true,
        boxSelectionEnabled: false,
        autoungrabify: false,
        autounselectify: false
      });

      cyInstance.current.on('tap', 'node', (event) => {
        const node = event.target;
        const nodeId = node.id();
        const nodeData = node.data();
        
        selectNode(nodeId);
        setSelectedNodeInfo(nodeData);
      });

      cyInstance.current.on('tap', (event) => {
        if (event.target === cyInstance.current) {
          selectNode(null);
          setSelectedNodeInfo(null);
        }
      });

      // Debug: Auto-update every 3 seconds
      const debugInterval = setInterval(() => {
        setDebugUpdateCounter(prev => prev + 1);
        console.log('Debug: Triggering graph update', debugUpdateCounter + 1);
      }, 3000);

      // Cleanup
      return () => {
        clearInterval(debugInterval);
        if (cyInstance.current) {
          cyInstance.current.destroy();
          cyInstance.current = null;
        }
      };
    }
  }, [selectNode]);

  // Update graph when currentGraph changes OR debug counter changes
  useEffect(() => {
    if (cyInstance.current) {
      try {
        // Use debug data instead of currentGraph for now
        const debugGraph = getDebugGraph();
        console.log('GraphCanvas: Using debug graph:', debugGraph);
        console.log('GraphCanvas: Debug update counter:', debugUpdateCounter);
        
        cyInstance.current.elements().remove();
        const cytoscapeElements = convertGraphToCytoscape(debugGraph);
        cyInstance.current.add(cytoscapeElements);
        cyInstance.current.layout(cytoscapeLayout).run();
        
        console.log('Debug graph updated with elements:', cytoscapeElements.length);
      } catch (err) {
        console.error('Error updating debug graph:', err);
      }
    }
  }, [currentGraph, debugUpdateCounter]); // Added debugUpdateCounter as dependency

  // Update selection state
  useEffect(() => {
    if (cyInstance.current && selectedNode) {
      cyInstance.current.nodes().unselect();
      const node = cyInstance.current.getElementById(selectedNode);
      if (node.length > 0) {
        node.select();
        setSelectedNodeInfo(node.data());
      }
    } else if (cyInstance.current && !selectedNode) {
      cyInstance.current.nodes().unselect();
      setSelectedNodeInfo(null);
    }
  }, [selectedNode]);

  // Convert Graph interface to Cytoscape elements format
  const convertGraphToCytoscape = (graph: Graph) => {
    console.log('convertGraphToCytoscape: received graph =', graph);
    const elements: any[] = [];

    // Add nodes
    if (graph.nodes) {
      console.log('convertGraphToCytoscape: graph.nodes.length =', graph.nodes.length);
      
      graph.nodes.forEach((node, index) => {
        console.log(`convertGraphToCytoscape: processing node ${index} =`, node);
        elements.push({
          data: {
            ...node.data, // Include all node data (id, label, shape, type)
          },
          classes: node.data.type ? `node-${node.data.type}` : undefined
        });
      });
    } else {
      console.log('convertGraphToCytoscape: graph.nodes is undefined or null');
    }
    console.log('convertGraphToCytoscape: elements length =', elements.length);

    // TODO: Add edges implementation
    // if (graph.edges) {
    //   graph.edges.forEach((edge) => {
    //     elements.push({
    //       data: {
    //         id: edge.id || `${edge.source}-${edge.target}`,
    //         source: edge.source,
    //         target: edge.target,
    //         label: edge.label,
    //         ...edge.data,
    //       },
    //       classes: edge.type ? `edge-${edge.type}` : undefined
    //     });
    //   });
    // }

    return elements;
  };

  // Show debug info in UI
  const debugGraph = getDebugGraph();
  
  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div style={styles.loadingSpinner}></div>
          <div style={styles.loadingText}>Loading graph...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorContainer}>
          <div style={styles.errorText}>
            Error: {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Debug info */}
      <div style={{
        position: 'absolute',
        top: 10,
        left: 10,
        background: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        zIndex: 1000,
        fontSize: '12px'
      }}>
        <div>Debug Mode: ON</div>
        <div>Update #{debugUpdateCounter}</div>
        <div>Nodes: {debugGraph.nodes.length}</div>
      </div>

      <div 
        ref={cyRef} 
        style={styles.graphContainer}
      />
      
      {selectedNodeInfo && (
        <div style={styles.nodeInfo}>
          <div style={styles.nodeInfoTitle}>
            Node: {selectedNodeInfo.label || selectedNodeInfo.id}
          </div>
          <div style={styles.nodeInfoContent}>
            <div><strong>ID:</strong> {selectedNodeInfo.id}</div>
            {selectedNodeInfo.type && (
              <div><strong>Type:</strong> {selectedNodeInfo.type}</div>
            )}
            {selectedNodeInfo.level !== undefined && (
              <div><strong>Level:</strong> {selectedNodeInfo.level}</div>
            )}
            {/* Display additional node data */}
            {Object.entries(selectedNodeInfo)
              .filter(([key]) => !['id', 'label', 'type', 'level'].includes(key))
              .map(([key, value]) => (
                <div key={key}>
                  <strong>{key}:</strong> {String(value)}
                </div>
              ))
            }
          </div>
        </div>
      )}
    </div>
  );
};