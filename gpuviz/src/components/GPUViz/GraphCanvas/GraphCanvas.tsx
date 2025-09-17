import React, {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
  useCallback,
} from "react";
import useGpuStore from "../../../store/topoStore";
import { GraphCore } from "./GraphCore";
import { GraphEvents } from "./GraphEvents";
import { styles } from "./styles/GraphCanvas.styles";
import type { LayoutType } from "./styles/GraphConfig.style";
import ErrorBoundary from "./ErrorBoundary";
import InfoPanel from "./InfoPanel";
import DebugPanel from "./DebugPanel";

export interface GraphCanvasHandles {
  fit: () => void;
  center: () => void;
  reset: () => void;
  changeLayout: (layoutType: LayoutType) => void;
  getState: () => any;
  selectElement: (id: string) => void;
  unselectAll: () => void;
  getCanvasDimensions: () => { width: number; height: number } | null;
}

/**
 * GraphCanvas - Main React component that orchestrates everything
 * Coordinates between GraphCore (rendering) and GraphEvents (interactions)
 */
const GraphCanvas: React.ForwardRefRenderFunction<GraphCanvasHandles> = (
  _props,
  ref,
) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphCoreRef = useRef<GraphCore | null>(null);
  const graphEventsRef = useRef<GraphEvents | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [currentLayout, setCurrentLayout] = useState<LayoutType>("grid");
  const [showDebugPanel, setShowDebugPanel] = useState(true);

  // Track if initialization has been successful
  const [initSuccessful, setInitSuccessful] = useState(false);

  // Get graph data from store
  const { currentGraph, loading, error, getNodeInfo, enterComponentView, selectedNodeInfo } = useGpuStore();

  // Setup event handlers for graph interactions
  const setupEventHandlers = useCallback(() => {
    if (!graphEventsRef.current) return;

    // Handle node clicks
    graphEventsRef.current.on("nodeClick", (nodeData: any) => {
      getNodeInfo(nodeData.id);
    });

    // Handle node hover (mouseover)
    graphEventsRef.current.on("nodeHover", (nodeData: any) => {
      console.log("GraphCanvas: Node hovered:", nodeData);
      getNodeInfo(nodeData.id);
    });

    // Handle node unhover (mouseout)
    graphEventsRef.current.on("nodeUnhover", (nodeData: any) => {
      console.log("GraphCanvas: Node unhovered:", nodeData);
      // Clear selection to hide the info panel when mouse leaves the node
    });

    // Handle canvas clicks (deselect)
    graphEventsRef.current.on("canvasClick", () => {
      console.log("GraphCanvas: Canvas clicked");
      getNodeInfo(null);
    });

    // Handle element selection
    graphEventsRef.current.on("elementSelect", (elementData: any) => {
      console.log("GraphCanvas: Element selected:", elementData);
    });

    // Handle zoom changes
    graphEventsRef.current.on("zoom", (zoomData: any) => {
      console.log("GraphCanvas: Zoom changed:", zoomData.level);
    });

    // Handle layout completion
    graphEventsRef.current.on("layoutStop", () => {
      console.log("GraphCanvas: Layout completed");
    });

    // Handle node double clicks
    graphEventsRef.current.on("nodeDoubleClick", (nodeData: any) => {
      console.log("GraphCanvas: Node double-clicked:", nodeData);
      // Call the new enterComponentView method from the store
      getNodeInfo(null);
      enterComponentView(nodeData.id);
    });
  }, [getNodeInfo, enterComponentView]);

  // Initialize the graph core and events
  useEffect(() => {
    // Skip if already successfully initialized
    if (initSuccessful) {
      return;
    }

    // Check if container is ready
    if (!containerRef.current) {
      return;
    }

    // Check if GraphCore already exists (double check)
    if (graphCoreRef.current) {
      setInitSuccessful(true);
      return;
    }

    console.log("GraphCanvas: Starting initialization...");

    try {
      // Initialize GraphCore
      graphCoreRef.current = new GraphCore();
      graphCoreRef.current.init(containerRef.current);

      // Initialize GraphEvents
      const cytoscapeInstance = graphCoreRef.current.getCytoscapeInstance();
      if (cytoscapeInstance) {
        graphEventsRef.current = new GraphEvents();
        graphEventsRef.current.setCytoscapeInstance(cytoscapeInstance);

        // Set up event handlers
        setupEventHandlers();

        // Mark as successfully initialized
        setInitSuccessful(true);
        setIsReady(true);
        console.log("GraphCanvas: Initialized successfully");
      } else {
        throw new Error("Failed to get Cytoscape instance");
      }
    } catch (error) {
      console.error("GraphCanvas: Initialization error:", error);
      // Clean up partial initialization
      if (graphCoreRef.current) {
        graphCoreRef.current.destroy();
        graphCoreRef.current = null;
      }
      if (graphEventsRef.current) {
        graphEventsRef.current.destroy();
        graphEventsRef.current = null;
      }
      // Don't set initSuccessful to true, so it can retry
    }
  }); // This effect runs on every render, but exits early if already initialized

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      console.log("GraphCanvas: Cleaning up...");
      if (graphEventsRef.current) {
        graphEventsRef.current.destroy();
        graphEventsRef.current = null;
      }
      if (graphCoreRef.current) {
        graphCoreRef.current.destroy();
        graphCoreRef.current = null;
      }
    };
  }, []);

  // Handle errors from the store
  useEffect(() => {
    if (error) {
      console.error('Graph Error:', error);
    }
  }, [error]);

  // Update graph when data changes
  useEffect(() => {
    if (graphCoreRef.current && isReady) {
      console.log(
        "📊 GraphCanvas: currentGraph changed, updating visualization...",
        currentGraph,
      );
      graphCoreRef.current.updateGraph(currentGraph);
    }
  }, [currentGraph, isReady]);



  // Handle layout changes
  const handleLayoutChange = (layoutType: LayoutType) => {
    if (graphCoreRef.current && isReady) {
      setCurrentLayout(layoutType);
      graphCoreRef.current.applyLayout(layoutType);
    }
  };

  // Expose control functions via ref
  useImperativeHandle(ref, () => ({
    fit: () => graphCoreRef.current?.fit(),
    center: () => graphCoreRef.current?.center(),
    reset: () => graphCoreRef.current?.reset(),
    changeLayout: handleLayoutChange,
    getState: () => graphCoreRef.current?.getState(),
    selectElement: (id: string) => graphEventsRef.current?.selectElement(id),
    unselectAll: () => graphEventsRef.current?.unselectAll(),
    getCanvasDimensions: () => graphCoreRef.current?.getCanvasDimensions() || null,
  }));

  // Render different states
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

  if (!currentGraph || currentGraph.nodes.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.emptyContainer}>
          <div style={styles.emptyText}>No graph data available</div>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary
      fallbackUI={
        <button onClick={() => window.location.reload()}>Reload Page</button>
      }
    >
      <div style={styles.container} data-testid="graph-canvas-container">
        {/* Graph container */}
        <div ref={containerRef} style={styles.graphContainer} />

        {/* Component info panel (left side) */}
        <InfoPanel
          selectedNodeInfo={selectedNodeInfo}
          currentGraph={currentGraph}
          getNodeInfo={getNodeInfo}
          enterComponentView={enterComponentView}
        />


        {/* Error notification */}
        {error && (
          <div style={styles.errorNotification}>
            <div style={styles.errorNotificationTitle}>
              Error
            </div>
            <div style={styles.errorNotificationMessage}>
              {error}
            </div>
          </div>
        )}

        {/* Debug info panel (right side) */}
        <DebugPanel
          isReady={isReady}
          currentGraph={currentGraph}
          currentLayout={currentLayout}
          initSuccessful={initSuccessful}
          error={error}
          showDebugPanel={showDebugPanel}
          onToggleDebugPanel={() => setShowDebugPanel(!showDebugPanel)}
        />
      </div>
    </ErrorBoundary>
  );
};

export default forwardRef(GraphCanvas);
