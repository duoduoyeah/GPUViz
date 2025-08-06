import type { ComponentNode } from "./component";

export interface Tree {
  root: ComponentNode;
  depth: number;
  levelMap: Map<number, ComponentNode[]>;

  // Node ops
  findNode(
    predicate: (node: ComponentNode) => boolean,
  ): ComponentNode | null;
  findNodeByName(name: string): ComponentNode | null;
  getNodesAtLevel(level: number): ComponentNode[];

  //tree ops
  getDepth(): number;
}
