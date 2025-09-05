import type {
  ComponentNode,
  Edge,
  ComponentTree
} from "../types";
import { componentGraphEdgeHelper as edgeHelper } from "./edge/edgeHelper";
import { componentHelper } from "./component/componentHelper";
import { EdgeTypeMap } from "./edge/edgeTypeMap";
import { ComponentBuilder } from "./component/combineComponentBuilder";
import {PortBuilder} from "./port/portBuilder"
import { CombinedPort } from "./port/port";
import { PortHelper } from "./port/portHelper";
import { EdgeBuilder } from "./edge/edgeBuilder"

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
  private edgeTypeMap: EdgeTypeMap;

  constructor(tree: ComponentTree) {
    this.tree = tree;
    this.graph = {
      components: [],
      edges: []
    };
    this.componentTypeMap = {};
    this.edgeTypeMap = new EdgeTypeMap();    
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
    componentHelper.removeIsolatedNodes(components);

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
    this.updateComponentGraph(graph);

    return graph;
  }

  @validateComponentGraph
  appendComponent(
    componentId: string,
    childrenLevel: number = 1,
  ): ComponentGraph {
    // Find the component node by ID
    const rootNode = this.tree.findNodeByName(componentId);

    if (!rootNode) {
      throw new Error(`Component with ID ${componentId} not found`);
    }

    //Get all edges from component
    const edges = edgeHelper.collectEdgesFromNode(rootNode);
    // console.log("Collected edges from component:", edges, "Length:", edges.length);

    // Collect all edges related to the rootNode
    const nodesToInclude = componentHelper.getDescendantsUpToLevel(rootNode, childrenLevel);

    // Remove isolated nodes (modifies nodesToInclude array in-place)
    componentHelper.removeIsolatedNodes(nodesToInclude);

    //adjust edges
    edgeHelper.AdjustEdges(edges, nodesToInclude, rootNode);

    //add missing nodes
    edgeHelper.addMissingNodesFromEdges(edges, nodesToInclude);

    const graph = {
      components: nodesToInclude,
      edges: edges,
    };

    // Update the internal graph and type maps
    this.updateComponentGraph(graph);

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
    this.edgeTypeMap.clear();
    
    // Add all edges to the edge type map
    for (const edge of this.graph.edges) {
      this.edgeTypeMap.addEdge(edge);
    }
  }

  getComponentTypeMap(): Record<string, ComponentNode[]> {
    return this.componentTypeMap;
  }

  getEdgeTypeMap(): EdgeTypeMap {
    return this.edgeTypeMap;
  }

  //08-14-2025, currently No Need
  // copyGraph(): ComponentGraph {
  //   const copiedEdges = this.graph.edges.map(edge => edge.copyEdge());
    
  //   return {
  //     components: this.graph.components, // Reuse original components
  //     edges: copiedEdges // Use copied edges
  //   };
  // }

  @validateComponentGraph
  consolidateGraph(): ComponentGraph {
    const tidyGraph: ComponentGraph = {
      components: [],
      edges: []
    };

    // create new components
    for (const type in this.componentTypeMap) {
      const components = this.componentTypeMap[type];
      if (components.length === 0) continue;
      const combinedComponent = ComponentBuilder.combineComponents(components);
      tidyGraph.components.push(combinedComponent);
    }
    
    // create new ports for each combined component
    for (const component of tidyGraph.components) {
      const combinedPorts = PortBuilder.generateCombinedPorts(component);
      component.setPorts(combinedPorts);
    }
    
    // connect new ports with each other
    // For each combined port, set incomingPort and outgoingPort to other CombinedPorts whose owners are the new combined components
    const combinedComponentsSet = new Set(tidyGraph.components);
    for (const component of tidyGraph.components) {
      const ports = component.getPorts();
      for (const port of ports) {
        if (port instanceof CombinedPort) {
          const subPorts = port.getSubPorts();
          const incoming = PortHelper.collectCombinedPorts(subPorts, 'incomingPort', combinedComponentsSet);
          const outgoing = PortHelper.collectCombinedPorts(subPorts, 'outgoingPort', combinedComponentsSet);
          port.setIncomingPorts(incoming);
          port.setOutgoingPorts(outgoing);
        }
      }
    }
    
    // create new edges
    for (const component of tidyGraph.components) {
      const edges = EdgeBuilder.getEdgesFromComponent(component);
      tidyGraph.edges.push(...edges);
    }

    return tidyGraph;
  }


  // collectCombinedPorts moved to portHelper
} 
