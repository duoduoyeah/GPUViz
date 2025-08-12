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
  private graph: ComponentGraph;
  private componentTypeMap: Record<string, ComponentNode[]>;
  private edgeTypeMap: Record<string, Edge[]>;

  constructor(tree: ComponentTree) {
    this.tree = tree;
    this.graph = {
      components: [],
      edges: []
    };
    this.componentTypeMap = {};
    this.edgeTypeMap = {};    
  }

  @validateComponentGraph
  updateComponentGraph(componentGraph: ComponentGraph) {
    this.graph = componentGraph;
    this.updateComponentTypeMap();
    this.updateEdgeTypeMap();
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

    const graph = {
      components,
      edges
    };

    // Update the internal graph and type maps
    this.graph = graph;
    this.updateComponentTypeMap();
    this.updateEdgeTypeMap();

    return graph;
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
    // console.log("Collected edges from component:", edges, "Length:", edges.length);

    // Collect all edges related to the rootNode
    const nodesToInclude = nodeHelper.getDescendantsUpToLevel(rootNode, childrenLevel);

    // Remove isolated nodes (modifies nodesToInclude array in-place)
    nodeHelper.removeIsolatedNodes(nodesToInclude);

    //adjust edges
    edgeHelper.AdjustEdges(edges, nodesToInclude, rootNode);

    //add missing nodes
    edgeHelper.addMissingNodesFromEdges(edges, nodesToInclude);

    const graph = {
      components: nodesToInclude,
      edges: edges,
    };

    // Update the internal graph and type maps
    this.graph = graph;
    this.updateComponentTypeMap();
    this.updateEdgeTypeMap();

    return graph;
  }

  getGraph(): ComponentGraph {
    return this.graph;
  }

  private updateComponentTypeMap(): void {
    // Reset the component type map
    this.componentTypeMap = {};
    
    // Group components by their type
    for (const component of this.graph.components) {
      const componentType = component.type;
      
      if (!this.componentTypeMap[componentType]) {
        this.componentTypeMap[componentType] = [];
      }
      
      this.componentTypeMap[componentType].push(component);
    }
  }

  private updateEdgeTypeMap(): void {
    // Reset the edge type map
    this.edgeTypeMap = {};
    
    // Group edges by combination of source and target component types
    for (const edge of this.graph.edges) {
      const sourceType = edge.getSource().type;
      const targetType = edge.getTarget().type;
      const edgeTypeKey = `${sourceType}->${targetType}`;
      
      if (!this.edgeTypeMap[edgeTypeKey]) {
        this.edgeTypeMap[edgeTypeKey] = [];
      }
      
      this.edgeTypeMap[edgeTypeKey].push(edge);
    }
  }

  getComponentTypeMap(): Record<string, ComponentNode[]> {
    return this.componentTypeMap;
  }

  getEdgeTypeMap(): Record<string, Edge[]> {
    return this.edgeTypeMap;
  }


  copyGraph(): ComponentGraph {
    const copiedEdges = this.graph.edges.map(edge => edge.copyEdge());
    
    return {
      components: this.graph.components, // Reuse original components
      edges: copiedEdges // Use copied edges
    };
  }

  consolidateGraph(): ComponentGraph {
    const tidyGraph: ComponentGraph = {
      components: [],
      edges: []
    };
    const currentType: Set<string> = new Set();
  
    for (const key in this.componentTypeMap) {
      if (!currentType.has(key)) {
        
      }
    }
    


    return tidyGraph;
  }

}
