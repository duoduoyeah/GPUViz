import type {
  ComponentNode,
  Graph,
  GraphNode,
  GraphEdge,
  Port,
} from "../types";
import { ComponentTree } from "./componentTree";
import { componentGraphEdgeHelper as edgeHelper } from "./edgeHelper";

export class ComponentGraph {
  private tree: ComponentTree;
  private treeDepth: number;

  constructor(tree: ComponentTree) {
    this.tree = tree;
    this.treeDepth = this.initializeHierarchyLevels();
  }

  private initializeHierarchyLevels(): number {
    return this.tree.depth;
  }

  buildGraphNodes(components: ComponentNode[]): GraphNode[] {
    return components.map((component, _): GraphNode => {
      return {
        data: {
          id: component.getName(),
          label: component.getName(),
          shape: component.shape,
          type: component.type,
          parent: component.getParent()?.getName(),
        },
      };
    });
  }



  createGraphAtLevel(level: number): Graph {
    // Get components at the specified level directly from the tree
    const components = this.tree.getNodesAtLevel(level);
    
    // Remove isolated nodes (modifies components array in-place)
    this.removeIsolatedNodes(components);

    // Convert to graph nodes
    const nodes = this.buildGraphNodes(components);
    const edges = edgeHelper.buildGraphEdges(components);
    const edgesResult = edgeHelper.getGraphEdges(edges)
    return {
      nodes,
      edges: edgesResult,
    };
  }

  appendComponent(componentId: string, childrenLevel: number = 1): Graph | null {
    // Find the component node by ID
    const rootNode = this.tree.findNodeByName(componentId);
    
    if (!rootNode) {
      console.warn(`Component with ID ${componentId} not found`);
      return null;
    }

    //Get all edges from component
    const edges = edgeHelper.collectEdgesFromNode(rootNode);
    
    // Gather the nodes to include in the graph
    const nodesToInclude: ComponentNode[] = [rootNode];
    
    // If childrenLevel > 0, include children up to that depth
    if (childrenLevel > 0) {
      this.getDescendantsUpToLevel(rootNode, nodesToInclude, 1, childrenLevel);
    }
    
    // Remove isolated nodes (modifies nodesToInclude array in-place)
    this.removeIsolatedNodes(nodesToInclude);

    //filter edges
    edgeHelper.filterAndAdjustEdges(edges, nodesToInclude, rootNode) 
  
    //add missing nodes
    edgeHelper.addMissingNodesFromEdges(edges, nodesToInclude)
  
    // Build the graph
    const nodes = this.buildGraphNodes(nodesToInclude);
    
    const edgesResult = edgeHelper.getGraphEdges(edges);
    
    return {
      nodes,
      edges: edgesResult
    };
  }
  
  private getDescendantsUpToLevel(
    parent: ComponentNode, 
    collection: ComponentNode[], 
    currentLevel: number, 
    maxLevel: number
  ): void {
    if (currentLevel > maxLevel) return;
    
    const children = parent.getChildren();
    children.forEach(child => {
      collection.push(child);
      this.getDescendantsUpToLevel(child, collection, currentLevel + 1, maxLevel);
    });
  }

  private removeIsolatedNodes(components: ComponentNode[]): void {
    // Filter out nodes that have no ports (isolated nodes) and modify the input array
    const connectedComponents = components.filter(component => {
      // A node is isolated if it has no ports
      return component.getPorts().length > 0;
    });
    
    // Clear the original array and add the connected components
    components.length = 0;
    components.push(...connectedComponents);
  }
}
