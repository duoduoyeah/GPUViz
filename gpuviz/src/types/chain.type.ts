import type { ComponentNode } from "./index";

export interface Chain {
  name: string;
  headNode: ComponentNode;
  tailNode: ComponentNode;
  nodes: ComponentNode[];

  // Get Methods
  getHeadNode(): ComponentNode;
  getTailNode(): ComponentNode;
  getNodes(): ComponentNode[];

  // Set Methods
  setHeadNode(node: ComponentNode): void;
  setTailNode(node: ComponentNode): void;
  setNodes(nodes: ComponentNode[]): void;
  pushNodes(node: ComponentNode): void;

  // Validation
  validateChain(): void;
}
