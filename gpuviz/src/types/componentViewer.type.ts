import type {ComponentNode, ComponentTree } from ".";

export interface ComponentViewer {
  tree: ComponentTree;
  componentTypeMap: Record<string, ComponentNode[]>;

  getTree(): ComponentTree;
  getTypeMap(): Record<string, ComponentNode[]>;
  getIdListByType(type: string): string[];
}