
import type { ComponentNode, NodeInfo } from './component';

export interface Tree<T extends NodeInfo> {
    root: ComponentNode<T>;
    depth: number;
    levelMap: Map<number, ComponentNode<T>[]>;

    // Node ops
    findNode(predicate: (node: ComponentNode<T>) => boolean): ComponentNode<T> | null;
    findNodeByName(name: string): ComponentNode<T> | null;
    getNodesAtLevel(level: number): ComponentNode<T>[];

    //tree ops
    getDepth(): number
}
