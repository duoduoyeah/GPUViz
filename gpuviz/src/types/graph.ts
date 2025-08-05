import type { ComponentKind } from "./component";

export interface GraphNode {
  data: {
    id: string;
    label: string;
    shape: ComponentKind;
    type: string;
  };
}

export interface GraphEdge {
  data: {
    id: string;
    source: string;
    target: string;
  };
}

export interface Graph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}
