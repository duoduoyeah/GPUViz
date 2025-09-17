import { ComponentTreeImpl } from "../models/component/componentTree";
import type { Chain, ComponentNode, ComponentTree } from "../types";

export interface ChainCache {
  levels: string[];
  idsByLevel: Record<string, Chain[]>;
}

export interface ComponentCache {
  types: string[];
  idsByType: Record<string, ComponentNode[]>;
}