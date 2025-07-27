import type { ComponentNode, NodeInfo, Graph, GraphNode, GraphEdge } from '../types';
import { ComponentTree } from './componentTree';




export class ComponentGraph<T extends NodeInfo> {
    private tree: ComponentTree<T>;
    private treeDepth: number;

    constructor(tree: ComponentTree<T>) {
        this.tree = tree;
        this.treeDepth = this.initializeHierarchyLevels();
    }

    private initializeHierarchyLevels(): number {
        return this.tree.depth
    }


    getComponentsAtLevel(targetLevel: number): ComponentNode<T>[] {
        return this.tree.getNodesAtLevel(targetLevel);
    }

    buildGraphNodes(components: ComponentNode<T>[]): GraphNode[] {
        return components.map((component, _): GraphNode => {
            return {
                data: {
                    id: component.getName(),
                    label: component.getName(),
                    shape: component.shape,
                    type: component.type
                }
            };
        });
    }

    buildGraphEdges(components: ComponentNode<T>[]): GraphEdge[] {
        // Will be implemented in Stage 2
        return [];
    }

    createGraphAtLevel(level: number): Graph {
        // Get components at the specified level
        const components = this.getComponentsAtLevel(level);

        // Convert to graph nodes
        const nodes = this.buildGraphNodes(components);

        // In Stage 1, we don't handle connections yet
        return {
            nodes,
            edges: [] // Empty array for now
        };
    }
}