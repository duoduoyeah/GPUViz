import type { ComponentNode } from "./component.type";
import type { GraphEdge } from "./cytoscapeGraph.type";


// Edge is an itermediate representation of GraphEdge 
export interface Edge {

  readonly id: string;
  source: ComponentNode;
  target: ComponentNode;


  getGraphEdge(): GraphEdge;
  getSource(): ComponentNode;
  getTarget(): ComponentNode;
  getSourceName(): string;
  getTargetName(): string;
  getId(): string;

  setSource(source: ComponentNode): void;
  setTarget(target: ComponentNode): void;
}