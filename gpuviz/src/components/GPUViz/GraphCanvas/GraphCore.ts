import cytoscape from "cytoscape";
import type { CytoscapeGraph } from "../../../types";
import { DEFAULT_GRAPH_OPTIONS, LAYOUT_PRESETS } from "./styles/GraphConfig.style";
import type { LayoutType } from "./styles/GraphConfig.style";

export class GraphCore {
  private container: HTMLDivElement | null = null;
  private cy: cytoscape.Core | null = null;
  private layout: LayoutType = "grid";

  init(container: HTMLDivElement): void {
    if (this.cy && this.container === container) return;

    this.destroy();
    this.container = container;

    try {
      this.cy = cytoscape({
        container,
        elements: [],
        ...DEFAULT_GRAPH_OPTIONS,
      });
    } catch (error) {
      console.error("GraphCore init failed:", error);
    }
  }

  updateGraph(graph: CytoscapeGraph | null): void {
    if (!this.cy) return;

    this.cy.elements().remove();

    if (!graph) {
      return;
    }

    const elements = [
      ...graph.nodes.map((node) => ({ data: node.data })),
      ...graph.edges.map((edge) => ({ data: edge.data })),
    ];

    this.cy.add(elements);

    this.applyLayout(this.layout);
  }

  applyLayout(type: LayoutType): void {
    console.log('applyLayout called with type:', type);
    
    if (!this.cy?.nodes().length || !this.container) {
      return;
    }

    if (!document.body.contains(this.container)) {
      console.error('GraphCore: Container is no longer in the DOM');
      return;
    }
    const { width, height } = this.container.getBoundingClientRect();
    console.log('Container dimensions:', { width, height });
    
    if (!width || !height) {
      requestAnimationFrame(() => this.applyLayout(type));
      return;
    }

    this.layout = type;


    try {
      this.cy.layout(LAYOUT_PRESETS[type]).run();
    } catch (error) {
      if (type !== "grid") {
        requestAnimationFrame(() => this.applyLayout("grid"));
      }
    }
  }

  fit(): void {
    this.cy?.fit();
  }
  center(): void {
    this.cy?.center();
  }
  reset(): void {
    this.cy?.reset();
  }

  getCy(): cytoscape.Core | null {
    return this.cy;
  }
  getCytoscapeInstance(): cytoscape.Core | null {
    return this.cy;
  }
  isReady(): boolean {
    return !!this.cy;
  }

  getCanvasDimensions(): { width: number; height: number } | null {
    if (!this.container) return null;
    const rect = this.container.getBoundingClientRect();
    return {
      width: rect.width,
      height: rect.height
    };
  }

  getState(): any {
    if (!this.cy) return null;
    const dimensions = this.getCanvasDimensions();
    return {
      zoom: this.cy.zoom(),
      pan: this.cy.pan(),
      layout: this.layout,
      nodeCount: this.cy.nodes().length,
      edgeCount: this.cy.edges().length,
      isReady: this.isReady(),
      canvasDimensions: dimensions,
    };
  }

  destroy(): void {
    this.cy?.destroy();
    this.cy = null;
  }
}
