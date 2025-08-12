import type { ComponentNode } from "./component";
import type { GraphEdge } from "./cytoscapeGraph";


// Edge is an itermediate representation of GraphEdge 
export interface Edge {
  data: {
    readonly id: string;
    source: ComponentNode;
    target: ComponentNode;
    combinedEdgeCount: number;
  };

  getGraphEdge(): GraphEdge;
  getSource(): ComponentNode;
  getTarget(): ComponentNode;
  getSourceName(): string;
  getTargetName(): string;
  getId(): string;
  getCombinedEdgeCount(): number;

  setSource(source: ComponentNode): void;
  setTarget(target: ComponentNode): void;
  setCombinedEdgeCount(count: number): void;
  copyEdge(): Edge;
}