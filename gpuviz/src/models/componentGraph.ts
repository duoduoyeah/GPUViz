import type {
  ComponentNode,
  Edge
} from "../types";
import { ComponentTree } from "./componentTree";
import { componentGraphEdgeHelper as edgeHelper } from "./edgeHelper";
import { nodeHelper } from "./nodeHelper";

// Define the ComponentGraph type
export type ComponentGraph = {
  components: ComponentNode[];
  edges: Edge[];
};

// Properly typed decorator function to validate component graph
export function validateComponentGraph(
  _target: any,
  _propertyKey: string | symbol,
  descriptor: PropertyDescriptor
): PropertyDescriptor {
  const originalMethod = descriptor.value;

  descriptor.value = function (...args: any[]): ComponentGraph | null {
    // Call the original method
    const result = originalMethod.apply(this, args);
    if (!result) {
      return result;
    }

    edgeHelper.filterEdges(result.edges);
    edgeHelper.pruneInvalidEdges(result.components, result.edges);
    return result;
  };

  return descriptor;
}


// Rename class to ComponentGraphExtractor which better reflects what it does
export class ComponentGraphExtractor {
  private tree: ComponentTree;

  constructor(tree: ComponentTree) {
    this.tree = tree;
  }

  @validateComponentGraph
  createGraphAtLevel(level: number): ComponentGraph {
    // Get components at the specified level directly from the tree
    const components = this.tree.getNodesAtLevel(level);
    const edges: Edge[] = [];

    // Remove isolated nodes (modifies components array in-place)
    nodeHelper.removeIsolatedNodes(components);

    // Collect all edges between the components at this level
    
    for (const component of components) {
      const componentEdges = edgeHelper.collectEdgesFromNode(component);
      edges.push(...componentEdges);
    }


    return {
      components,
      edges
    };
  }

  @validateComponentGraph
  appendComponent(
    componentId: string,
    childrenLevel: number = 1,
  ): ComponentGraph | null {
    // Find the component node by ID
    const rootNode = this.tree.findNodeByName(componentId);

    if (!rootNode) {
      console.warn(`Component with ID ${componentId} not found`);
      return null;
    }

    //Get all edges from component
    const edges = edgeHelper.collectEdgesFromNode(rootNode);

    // Collect all edges related to the rootNode
    const nodesToInclude = nodeHelper.getDescendantsUpToLevel(rootNode, childrenLevel);

    // Remove isolated nodes (modifies nodesToInclude array in-place)
    nodeHelper.removeIsolatedNodes(nodesToInclude);

    //adjust edges
    edgeHelper.AdjustEdges(edges, nodesToInclude, rootNode);

    //add missing nodes
    edgeHelper.addMissingNodesFromEdges(edges, nodesToInclude);

    return {
      components: nodesToInclude,
      edges: edges,
    };
  }
}
