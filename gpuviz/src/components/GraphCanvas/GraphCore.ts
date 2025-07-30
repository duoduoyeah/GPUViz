import cytoscape from 'cytoscape';
import type { Graph } from '../../types';
import { DEFAULT_GRAPH_OPTIONS, LAYOUT_PRESETS } from './GraphConfig';
import type { LayoutType } from './GraphConfig';

export class GraphCore {
  private container: HTMLDivElement | null = null;
  private cy: cytoscape.Core | null = null;
  private graph: Graph | null = null;
  private layout: LayoutType = 'grid';

  init(container: HTMLDivElement): void {
    if (this.cy && this.container === container) return;
    
    this.destroy();
    this.container = container;
    
    try {
      this.cy = cytoscape({
        container,
        elements: [],
        ...DEFAULT_GRAPH_OPTIONS
      });
    } catch (error) {
      console.error('GraphCore init failed:', error);
    }
  }

  updateGraph(graph: Graph | null): void {
    if (!this.cy) return;
    
    this.graph = graph;
    this.cy.elements().remove();
    
    if (!graph) return;

    const elements = [
      ...graph.nodes.map(node => ({ data: node.data })),
      ...graph.edges.map(edge => ({ data: edge.data }))
    ];

    this.cy.add(elements);
    requestAnimationFrame(() => this.applyLayout(this.layout));
  }

  applyLayout(type: LayoutType): void {
    if (!this.cy?.nodes().length || !this.container) return;

    const { width, height } = this.container.getBoundingClientRect();
    if (!width || !height) {
      requestAnimationFrame(() => this.applyLayout(type));
      return;
    }

    this.layout = type;
    
    try {
      this.cy.layout(LAYOUT_PRESETS[type]).run();
    } catch (error) {
      if (type !== 'grid') {
        requestAnimationFrame(() => this.applyLayout('grid'));
      }
    }
  }

  fit(): void { this.cy?.fit(); }
  center(): void { this.cy?.center(); }
  reset(): void { this.cy?.reset(); }
  
  getCy(): cytoscape.Core | null { return this.cy; }
  isReady(): boolean { return !!this.cy; }

  destroy(): void {
    this.cy?.destroy();
    this.cy = null;
    this.graph = null;
  }
}