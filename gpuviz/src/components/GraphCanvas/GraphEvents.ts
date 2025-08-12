import cytoscape from "cytoscape";

/**
 * GraphEvents handles user interactions, Cytoscape event bridging, and gesture handling
 */
export class GraphEvents {
  private cytoscapeInstance: cytoscape.Core | null = null;
  private eventHandlers: Map<string, Function> = new Map();
  private isEnabled: boolean = true;

  constructor(cytoscapeInstance: cytoscape.Core | null = null) {
    this.cytoscapeInstance = cytoscapeInstance;
    this.eventHandlers = new Map();
    this.isEnabled = true;
  }

  /**
   * Set the Cytoscape instance for event handling
   */
  setCytoscapeInstance(instance: cytoscape.Core): void {
    this.cytoscapeInstance = instance;
    this.bindCytoscapeEvents();
  }

  /**
   * Enable/disable event handling
   */
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  /**
   * Register a custom event handler
   */
  on(eventName: string, handler: Function): void {
    this.eventHandlers.set(eventName, handler);
  }

  /**
   * Unregister a custom event handler
   */
  off(eventName: string): void {
    this.eventHandlers.delete(eventName);
  }

  /**
   * Emit a custom event
   */
  emit(eventName: string, data?: any): void {
    if (!this.isEnabled) return;

    const handler = this.eventHandlers.get(eventName);
    if (handler) {
      try {
        handler(data);
      } catch (error) {
        console.error(`GraphEvents: Error in handler for ${eventName}:`, error);
      }
    }
  }

  /**
   * Bind Cytoscape events to bridge them with custom handlers
   */
  private bindCytoscapeEvents(): void {
    if (!this.cytoscapeInstance) return;

    // Node events
    this.cytoscapeInstance.on("tap", "node", (event) => {
      if (!this.isEnabled) return;

      const node = event.target;
      const nodeData = {
        id: node.id(),
        data: node.data(),
        position: node.position(),
      };
      this.emit("nodeClick", nodeData);
    });
    
    // Node double click event
    this.cytoscapeInstance.on("dbltap", "node", (event) => {
      if (!this.isEnabled) return;

      const node = event.target;
      const nodeData = {
        id: node.id(),
        data: node.data(),
        position: node.position(),
      };

      this.emit("nodeDoubleClick", nodeData);
    });

    this.cytoscapeInstance.on("mouseover", "node", (event) => {
      if (!this.isEnabled) return;

      const node = event.target;
      const nodeData = {
        id: node.id(),
        data: node.data(),
        position: node.position(),
      };

      this.emit("nodeHover", nodeData);
    });

    this.cytoscapeInstance.on("mouseout", "node", (event) => {
      if (!this.isEnabled) return;

      const node = event.target;
      const nodeData = {
        id: node.id(),
        data: node.data(),
      };

      this.emit("nodeUnhover", nodeData);
    });

    // Edge events
    this.cytoscapeInstance.on("tap", "edge", (event) => {
      if (!this.isEnabled) return;

      const edge = event.target;
      const edgeData = {
        id: edge.id(),
        data: edge.data(),
        source: edge.source().id(),
        target: edge.target().id(),
      };

      console.log("GraphEvents: Edge tapped:", edgeData);
      this.emit("edgeClick", edgeData);
    });

    // Canvas events
    this.cytoscapeInstance.on("tap", (event) => {
      if (!this.isEnabled) return;

      // Only trigger if clicking on canvas (not node/edge)
      if (event.target === this.cytoscapeInstance) {
        console.log("GraphEvents: Canvas tapped");
        this.emit("canvasClick", event);
      }
    });

    // Selection events
    this.cytoscapeInstance.on("select", (event) => {
      if (!this.isEnabled) return;

      const element = event.target;
      const elementData = {
        id: element.id(),
        data: element.data(),
        type: element.isNode() ? "node" : "edge",
      };

      // 08-05-25 comment out since this log is unnecessary
      // console.log("GraphEvents: Element selected:", elementData);
      this.emit("elementSelect", elementData);
    });

    this.cytoscapeInstance.on("unselect", (event) => {
      if (!this.isEnabled) return;

      const element = event.target;
      const elementData = {
        id: element.id(),
        data: element.data(),
        type: element.isNode() ? "node" : "edge",
      };

      console.log("GraphEvents: Element unselected:", elementData);
      this.emit("elementUnselect", elementData);
    });

    // Zoom and pan events
    this.cytoscapeInstance.on("zoom", (event) => {
      if (!this.isEnabled) return;

      const zoomLevel = this.cytoscapeInstance?.zoom() || 1;
      this.emit("zoom", { level: zoomLevel, event });
    });

    this.cytoscapeInstance.on("pan", (event) => {
      if (!this.isEnabled) return;

      const pan = this.cytoscapeInstance?.pan() || { x: 0, y: 0 };
      this.emit("pan", { position: pan, event });
    });

    // Layout events
    this.cytoscapeInstance.on("layoutstart", (event) => {
      console.log("GraphEvents: Layout started");
      this.emit("layoutStart", event);
    });

    this.cytoscapeInstance.on("layoutstop", (event) => {
      console.log("GraphEvents: Layout completed");
      this.emit("layoutStop", event);
    });

    console.log("GraphEvents: Cytoscape events bound successfully");
  }

  /**
   * Unbind all Cytoscape events
   */
  unbindCytoscapeEvents(): void {
    if (this.cytoscapeInstance) {
      this.cytoscapeInstance.removeAllListeners();
      console.log("GraphEvents: Cytoscape events unbound");
    }
  }

  /**
   * Get currently selected elements
   */
  getSelectedElements(): any[] {
    if (!this.cytoscapeInstance) return [];

    return this.cytoscapeInstance.elements(":selected").map((element) => ({
      id: element.id(),
      data: element.data(),
      type: element.isNode() ? "node" : "edge",
    }));
  }

  /**
   * Select an element by ID
   */
  selectElement(elementId: string): void {
    if (!this.cytoscapeInstance) return;

    const element = this.cytoscapeInstance.getElementById(elementId);
    if (element.length > 0) {
      element.select();
    }
  }

  /**
   * Unselect all elements
   */
  unselectAll(): void {
    if (!this.cytoscapeInstance) return;

    this.cytoscapeInstance.elements().unselect();
  }

  /**
   * Clean up event handlers
   */
  destroy(): void {
    this.unbindCytoscapeEvents();
    this.eventHandlers.clear();
    this.cytoscapeInstance = null;
    console.log("GraphEvents: Destroyed");
  }
}
