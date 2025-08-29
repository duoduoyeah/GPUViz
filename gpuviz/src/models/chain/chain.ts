import type { Chain } from "../../types/chain.type";
import type { ComponentNode } from "../../types";

export class ChainImpl implements Chain {
  name: string;
  headNode: ComponentNode;
  tailNode: ComponentNode;
  nodes: ComponentNode[];

  constructor(name: string, nodes: ComponentNode[]) {
    this.name = name;
    this.nodes = nodes;
    this.headNode = nodes[0];
    this.tailNode = nodes[nodes.length - 1];
  }

  getHeadNode(): ComponentNode {
    return this.headNode;
  }

  getTailNode(): ComponentNode {
    return this.tailNode;
  }

  getNodes(): ComponentNode[] {
    return this.nodes;
  }

  setHeadNode(node: ComponentNode): void {
    this.headNode = node;
    if (this.nodes.length > 0) {
      this.nodes[0] = node;
    } else {
      this.nodes.push(node);
    }
  }

  setTailNode(node: ComponentNode): void {
    this.tailNode = node;
    if (this.nodes.length > 0) {
      this.nodes[this.nodes.length - 1] = node;
    } else {
      this.nodes.push(node);
    }
  }

  setNodes(nodes: ComponentNode[]): void {
    this.nodes = nodes;
    this.headNode = nodes[0];
    this.tailNode = nodes[nodes.length - 1];
  }

  pushNodes(node: ComponentNode): void {
    this.nodes.push(node);
    this.tailNode = node;
    if (this.nodes.length === 1) {
      this.headNode = node;
    }
  }

  validateChain(): void {
    // Checks if the chain is valid: head/tail match nodes, no duplicates, nodes not empty
    if (!this.nodes || this.nodes.length === 0) {
      throw new Error("Chain nodes cannot be empty.");
    }
    if (this.nodes[0] !== this.headNode) {
      throw new Error("Head node does not match the first node in nodes array.");
    }
    if (this.nodes[this.nodes.length - 1] !== this.tailNode) {
      throw new Error("Tail node does not match the last node in nodes array.");
    }
    const nodeSet = new Set(this.nodes.map(n => n.name));
    if (nodeSet.size !== this.nodes.length) {
      throw new Error("Duplicate nodes found in chain.");
    }
    // ...other validation logic as needed
    //
  }
}