import type { ComponentNode, NodeInfo, Tree } from "../types";
import { ComponentNodeImpl } from "./componentNode";

export class ComponentTree implements Tree {
  root: ComponentNode;
  depth: number;
  levelMap: Map<number, ComponentNode[]>;

  constructor(roots: ComponentNode[]) {
    this.root = new ComponentNodeImpl("tree_root");
    this.root.setChildren(roots);
    for (const i in roots) {
      roots[i].setParent(this.root);
    }

    this.levelMap = new Map<number, ComponentNode[]>();
    this.depth = this.setDepth();
    for (let level = 0; level <= this.depth; level++) {
      this.levelMap.set(level, this.setNodesAtLevel(level));
    }
  }

  setDepth(): number {
    const calculateDepth = (node: ComponentNode): number => {
      if (node.children.length === 0) {
        return 0; // Leaf node
      }
      let maxChildDepth = 0;
      for (const child of node.children) {
        const childDepth = calculateDepth(child);
        maxChildDepth = Math.max(maxChildDepth, childDepth);
      }

      return maxChildDepth + 1;
    };

    return calculateDepth(this.root);
  }

  getDepth(): number {
    return this.depth;
  }
  // Finds the first node satisfying the predicate using DFS
  findNode(predicate: (node: ComponentNode) => boolean): ComponentNode | null {
    // Helper function for recursive search
    const search = (node: ComponentNode): ComponentNode | null => {
      if (predicate(node)) {
        return node;
      }

      for (const child of node.children) {
        const result = search(child);
        if (result) {
          return result;
        }
      }

      return null;
    };

    return search(this.root);
  }

  findNodeByName(name: string): ComponentNode | null {
    return this.findNode((node) => node.name === name);
  }

  setNodesAtLevel(level: number): ComponentNode[] {
    const result: ComponentNode[] = [];

    const traverse = (node: ComponentNode, currentLevel: number) => {
      if (currentLevel === level) {
        result.push(node);
        return;
      }

      if (currentLevel < level) {
        for (const child of node.children) {
          traverse(child, currentLevel + 1);
        }
      }
    };

    traverse(this.root, 0);
    return result;
  }

  getNodesAtLevel(level: number): ComponentNode[] {
    return this.levelMap.get(level) ?? [];
  }
}
