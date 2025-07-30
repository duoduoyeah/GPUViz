import cytoscape from 'cytoscape';
import type { Graph } from '../../types';
import { DEFAULT_GRAPH_OPTIONS, LAYOUT_PRESETS } from './GraphConfig';
import type { LayoutType } from './GraphConfig';

/**
 * GraphCore handles Cytoscape lifecycle, container management, and initialization
 */
export class GraphCore {
  private containerRef: HTMLDivElement | null = null;
  private cytoscapeInstance: cytoscape.Core | null = null;
  private isInitialized: boolean = false;
  private currentGraph: Graph | null = null;
  private currentLayout: LayoutType = 'grid';

  constructor() {
    this.containerRef = null;
    this.cytoscapeInstance = null;
    this.isInitialized = false;
    this.currentGraph = null;
  }

  /**
   * Initialize the graph with a container element
   */
  init(containerElement: HTMLDivElement): void {
    if (this.isInitialized && this.containerRef === containerElement) {
      return; // Already initialized with same container
    }

    if (this.isInitialized) {
      this.destroy();
    }

    this.containerRef = containerElement;

    try {
      // Initialize cytoscape instance
      this.cytoscapeInstance = cytoscape({
        container: containerElement,
        elements: [], // Start with empty elements
        ...DEFAULT_GRAPH_OPTIONS
      });

      this.isInitialized = true;
      console.log('GraphCore: Initialized successfully');
    } catch (error) {
      console.error('GraphCore: Initialization failed', error);
      this.isInitialized = false;
    }
  }

  /**
   * Update the graph with new data
   */
  updateGraph(graph: Graph | null): void {
    if (!this.cytoscapeInstance || !this.isInitialized) {
      console.warn('GraphCore: Cannot update graph - not initialized');
      return;
    }

    this.currentGraph = graph;

    if (!graph) {
      this.cytoscapeInstance.elements().remove();
      return;
    }

    try {
      // Clear existing elements
      this.cytoscapeInstance.elements().remove();

      // Add new elements
      const elements = [
        ...graph.nodes.map(node => ({ data: node.data })),
        ...graph.edges.map(edge => ({ data: edge.data }))
      ];

      this.cytoscapeInstance.add(elements);
      
      // Apply layout after a brief delay to ensure DOM is ready
      // This prevents the "Cannot read properties of undefined (reading 'h')" error
      // that occurs when layout engines try to access DOM dimensions before rendering
      setTimeout(() => {
        this.applyLayout(this.currentLayout);
      }, 0);

      console.log('GraphCore: Graph updated with', graph.nodes.length, 'nodes and', graph.edges.length, 'edges');
    } catch (error) {
      console.error('GraphCore: Failed to update graph', error);
    }
  }

  /**
   * Apply a layout to the current graph
   */
  applyLayout(layoutType: LayoutType): void {
    if (
      !this.cytoscapeInstance ||
      !this.isInitialized ||
      this.cytoscapeInstance.nodes().length === 0
    ) {
      console.warn('GraphCore: Cannot apply layout - not initialized or no nodes');
      return;
    }

    // Additional check: ensure container has valid dimensions
    if (this.containerRef) {
      const containerRect = this.containerRef.getBoundingClientRect();
      if (containerRect.width === 0 || containerRect.height === 0) {
        // console.warn('GraphCore: Container has no dimensions, deferring layout');
        // Retry after a brief delay
        setTimeout(() => this.applyLayout(layoutType), 10);
        return;
      }
    }

    this.currentLayout = layoutType;
    const layoutConfig = LAYOUT_PRESETS[layoutType];
    
    try {
      // Force a redraw to ensure DOM is in sync before applying layout
      this.cytoscapeInstance.forceRender();
      
      const layout = this.cytoscapeInstance.layout(layoutConfig);
      layout.run();
      
      console.log('GraphCore: Applied layout:', layoutType);
    } catch (error) {
      console.error('GraphCore: Failed to apply layout', error);
      
      // Fallback: try a simpler layout if the current one fails
      if (layoutType !== 'grid') {
        console.log('GraphCore: Falling back to grid layout');
        setTimeout(() => this.applyLayout('grid'), 50);
      }
    }
  }

  /**
   * Fit the graph to the container
   */
  fit(): void {
    if (this.cytoscapeInstance && this.isInitialized) {
      this.cytoscapeInstance.fit();
    }
  }

  /**
   * Center the graph
   */
  center(): void {
    if (this.cytoscapeInstance && this.isInitialized) {
      this.cytoscapeInstance.center();
    }
  }

  /**
   * Reset zoom and pan
   */
  reset(): void {
    if (this.cytoscapeInstance && this.isInitialized) {
      this.cytoscapeInstance.reset();
    }
  }

  /**
   * Get the Cytoscape instance (for event handling)
   */
  getCytoscapeInstance(): cytoscape.Core | null {
    return this.cytoscapeInstance;
  }

  /**
   * Get current state information
   */
  getState() {
    return {
      isInitialized: this.isInitialized,
      hasGraph: this.currentGraph !== null,
      nodeCount: this.currentGraph?.nodes.length || 0,
      edgeCount: this.currentGraph?.edges.length || 0,
      currentLayout: this.currentLayout
    };
  }

  /**
   * Check if the graph is ready for operations
   */
  isReady(): boolean {
    return this.isInitialized && this.cytoscapeInstance !== null;
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    if (this.cytoscapeInstance) {
      try {
        this.cytoscapeInstance.destroy();
      } catch (error) {
        console.warn('GraphCore: Error during cleanup', error);
      }
      this.cytoscapeInstance = null;
    }

    this.isInitialized = false;
    this.currentGraph = null;
    console.log('GraphCore: Destroyed');
  }
}
