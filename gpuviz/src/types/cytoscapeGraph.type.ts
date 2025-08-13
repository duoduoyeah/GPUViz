import type { ComponentKind } from "./component.type";

export interface GraphNode {
  data: {
    readonly id: string;
    label: string;
    shape: ComponentKind;
    type: string;
    parent?: string;
  };
}

export interface GraphEdge {
  data: {
    readonly id: string;
    source: string;
    target: string;
  };
}

export interface CytoscapeGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}
