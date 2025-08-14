import type { GraphEdge, Edge, ComponentNode } from "../../types/index";
import {EdgeBuilder} from "./edgeBuilder"
/**
 * Interface defining edge helper methods for graph operations
 */
export interface EdgeHelper {
  /**
   * Convert Edge array to GraphEdge array
   */
  buildGraphEdges(edges: Edge[]): GraphEdge[];

  /**
   * Filter edges to remove duplicates and validate uniqueness
   */
  filterEdges(edges: Edge[]): void;

  /**
   * Remove duplicate edges from an array
   */
  filterDuplicateEdges(edges: Edge[]): void;

  /**
   * Remove edges that reference non-existent components
   */
  pruneInvalidEdges(
      nodes: ComponentNode[],
      edges: Edge[],
  ): void;
}

/**
 * Interface extending EdgeHelper with component graph specific operations
 */
export interface ComponentGraphEdgeHelper extends EdgeHelper {
  /**
   * Collect all edges from a specific node and its descendants recursively
   */
  collectEdgesFromNode(root: ComponentNode): Edge[];

  /**
   * Adjust edges for a specific set of nodes
   */
  AdjustEdges(
    edges: Edge[],
    nodesToInclude: ComponentNode[],
    rootNode: ComponentNode,
  ): void;

  /**
   * Add missing nodes to the component list based on edge connections
   */
  addMissingNodesFromEdges(
    edges: Edge[],
    nodesToInclude: ComponentNode[],
  ): void;
}

/**
 * Base implementation of the EdgeHelper interface
 */
class EdgeHelperImpl implements EdgeHelper {
  buildGraphEdges(edges: Edge[]): GraphEdge[] {
    return edges.map((edge) => edge.getGraphEdge());
  }


  filterEdges(edges: Edge[]) {
    // Remove duplicates
    this.filterDuplicateEdges(edges);
  }

  filterDuplicateEdges(edges: Edge[]) {
    this.filterDuplicateEdgesbyID(edges);
    this.filterDuplicateEdgesbySides(edges);
  }

  filterDuplicateEdgesbyID(edges: Edge[]) {
    const uniqueEdges: Edge[] = [];
    const edgeIds = new Set<string>();

    for (const edge of edges) {
      const edgeId = edge.getId();

      if (!edgeIds.has(edgeId)) {
        edgeIds.add(edgeId);
        uniqueEdges.push(edge);
      }
    }

    edges.length = 0;
    edges.push(...uniqueEdges);
  }

  filterDuplicateEdgesbySides(edges: Edge[]) {
    const uniqueEdges: Edge[] = [];
    const connectionKeys = new Set<string>();

    for (const edge of edges) {
      // Create a unique key based on source and target names
      const connectionKey = `${edge.getSource().getName()}->${edge.getTarget().getName()}`;

      if (!connectionKeys.has(connectionKey)) {
        connectionKeys.add(connectionKey);
        uniqueEdges.push(edge);
      }
    }

    edges.length = 0;
    edges.push(...uniqueEdges);
  }

  pruneInvalidEdges(
    nodes: ComponentNode[],
    edges: Edge[],
  ) {
    // Create a map of node names for quick lookup
    const nodeMap = new Map<string, boolean>();
    for (const node of nodes) {
      nodeMap.set(node.getName(), true);
    }
    
    // Filter out edges where either source or target component doesn't exist
    const validEdges = edges.filter(edge => {
      const sourceExists = nodeMap.has(edge.getSource().getName());
      const targetExists = nodeMap.has(edge.getTarget().getName());
      
      // Keep the edge only if both source and target exist
      return sourceExists && targetExists;
    });
    
    // Clear the original array and push valid edges
    edges.length = 0;
    edges.push(...validEdges);
  }
}

/**
 * Extended implementation for ComponentGraphEdgeHelper
 */
class ComponentGraphEdgeHelperImpl extends EdgeHelperImpl implements ComponentGraphEdgeHelper {
  /**
   * Collect all edges from a specific node and its descendants recursively
   *
   * This function:
   * 1. Collects edges from the current node's ports
   * 2. Recursively collects edges from all children
   * 3. Returns a deduplicated list of all edges
   */
  collectEdgesFromNode(node: ComponentNode): Edge[] {
    const collectEdgesHelper = (currentNode: ComponentNode): Edge[] => {
      // Get edges from the current node
      const nodeEdges: Edge[] = EdgeBuilder.getEdgesFromComponent(currentNode);

      if (currentNode.children && currentNode.children.length > 0) {
        for (const child of currentNode.children) {
          const childEdges = collectEdgesHelper(child);
          nodeEdges.push(...childEdges);
        }
      }

      return nodeEdges;
    };

    const allEdges = collectEdgesHelper(node);
    // console.log("Collected edges from component:", allEdges, "Length:", allEdges.length);
    this.filterEdges(allEdges);
    // console.log("[After Filter] Collected edges from component:", allEdges, "Length:", allEdges.length);
    return allEdges;
  }

  /**
   * Filter and adjust edges for a specific set of nodes
   */
  AdjustEdges(
    edges: Edge[],
    nodesToInclude: ComponentNode[],
    rootNode: ComponentNode,
  ): void {
    // Create a map for quick lookup of nodes
    const nodeMap = new Map<string, ComponentNode>();
    for (const node of nodesToInclude) {
      nodeMap.set(node.getName(), node);
    }

    // Process each edge
    for (const edge of edges) {
      const sourceComponent = edge.getSource();
      const targetComponent = edge.getTarget();

      // Check source component
      if (
        rootNode.isAncestor(sourceComponent) &&
        !nodeMap.has(sourceComponent.getName())
      ) {
        let closestAncestor = this.findClosestIncludedAncestor(
          sourceComponent,
          nodesToInclude,
        );
        if (closestAncestor) {
          edge.setSource(closestAncestor);
        }
      }

      // Check target component
      if (
        rootNode.isAncestor(targetComponent) &&
        !nodeMap.has(targetComponent.getName())
      ) {
        let closestAncestor = this.findClosestIncludedAncestor(
          targetComponent,
          nodesToInclude,
        );
        if (closestAncestor) {
          edge.setTarget(closestAncestor);
        }
      }
    }
    
    this.filterDuplicateEdges(edges);
  }

  /**
   * Helper function to find the closest ancestor of a node that is included in the provided list
   */
  private findClosestIncludedAncestor(
    node: ComponentNode,
    includedNodes: ComponentNode[],
  ): ComponentNode | undefined {
    let current = node.getParent();
    while (current) {
      // Check if this ancestor is in the included nodes
      if (includedNodes.some((n) => n.getName() === current?.getName())) {
        return current;
      }
      current = current.getParent();
    }
    return undefined;
  }

  /**
   * Add missing nodes to the component list based on edge connections
   *
   * This function:
   * 1. Identifies components mentioned in edges but not in the provided nodes
   * 2. Adds those components to the nodesToInclude array
   * 3. This ensures all endpoints of edges are represented in the displayed graph
   */
  addMissingNodesFromEdges(
    edges: Edge[],
    nodesToInclude: ComponentNode[],
  ): void {
    // Create a map of currently included nodes for quick lookup
    const includedNodeMap = new Map<string, boolean>();
    for (const node of nodesToInclude) {
      includedNodeMap.set(node.getName(), true);
    }

    // Examine all edges and add missing nodes
    for (const edge of edges) {
      const sourceComponent = edge.getSource();
      const targetComponent = edge.getTarget();

      // Add source component if not already included
      if (!includedNodeMap.has(sourceComponent.getName())) {
        nodesToInclude.push(sourceComponent);
        includedNodeMap.set(sourceComponent.getName(), true);
      }

      // Add target component if not already included
      if (!includedNodeMap.has(targetComponent.getName())) {
        nodesToInclude.push(targetComponent);
        includedNodeMap.set(targetComponent.getName(), true);
      }
    }
  }
}

/**
 * Singleton objects for edge helper implementations
 */
export const baseEdgeHelper: EdgeHelper = new EdgeHelperImpl();
export const componentGraphEdgeHelper: ComponentGraphEdgeHelper = new ComponentGraphEdgeHelperImpl();
