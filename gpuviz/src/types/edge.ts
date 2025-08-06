import type { Port } from "./component";
import type { GraphEdge } from "./graph";


// Edge is an itermediate representation of GraphEdge 
export interface Edge {
  data: {
    readonly id: string;
    source: Port;
    target: Port;
  };

  getGraphEdge(): GraphEdge;
  getSource(): string;
  getTarget(): string;
}