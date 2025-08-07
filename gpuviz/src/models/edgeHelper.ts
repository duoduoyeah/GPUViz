import type { Port, GraphEdge, Edge, ComponentNode } from "../types/index";
import { EdgeImpl } from "./edge";

/**
 * Interface defining edge helper methods for graph operations
 */
export interface EdgeHelper {
  /**
   * Convert Edge array to GraphEdge array
   */
  buildGraphEdges(edges: Edge[]): GraphEdge[];

  /**
   * Get outgoing edges from a port
   */
  getOutgoingEdgesFromPort(port: Port): Edge[];

  /**
   * Get incoming edges to a port
   */
  getIncomingEdgesFromPort(port: Port): Edge[];

  /**
   * Get all edges (both incoming and outgoing) connected to a port
   */
  getEdgesFromPort(port: Port): Edge[];

  /**
   * Get all edges connected to a component's ports
   */
  getEdgesFromComponent(component: ComponentNode): Edge[];

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
   * Build edges between a component and its subcomponents
   */
  collectEdgesFromNode(root: ComponentNode): Edge[];

  /**
   *  adjust edges for a specific set of nodes
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

export function getOutgoingEdgesFromPort(port: Port): Edge[] {
  const edges: Edge[] = [];

  // Create edges from this port to all outgoing ports
  for (const targetPort of port.outgoingPort) {
    // Create the edge with source port, target port, and their respective components
    const edge = new EdgeImpl(port, targetPort);

    edges.push(edge);
  }

  return edges;
}

export function getIncomingEdgesFromPort(port: Port): Edge[] {
  const edges: Edge[] = [];

  // Create edges from all incoming ports to this port
  for (const sourcePort of port.incomingPort) {
    // Create the edge with source port, target port, and their respective components
    const edge = new EdgeImpl(sourcePort, port);

    edges.push(edge);
  }

  return edges;
}

export function getEdgesFromPort(port: Port): Edge[] {
  // Combine both incoming and outgoing edges
  const incomingEdges = getIncomingEdgesFromPort(port);
  const outgoingEdges = getOutgoingEdgesFromPort(port);

  // Return the combined array of edges
  return [...incomingEdges, ...outgoingEdges];
}

export function getEdgesFromComponent(component: ComponentNode): Edge[] {
  const allEdges: Edge[] = [];

  // Get edges from all ports in the component
  const ports = component.getPorts();
  for (const port of ports) {
    const portEdges = getEdgesFromPort(port);
    allEdges.push(...portEdges);
  }

  return allEdges;
}

export function filterEdges(edges: Edge[]) {
  // Remove duplicates
  filterDuplicateEdges(edges)
}

export function filterDuplicateEdges(edges: Edge[]) {
  filterDuplicateEdgesbyID(edges);
  filterDuplicateEdgesbySides(edges);
}

export function filterDuplicateEdgesbyID(edges: Edge[]) {
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

export function filterDuplicateEdgesbySides(edges: Edge[]) {
  const uniqueEdges: Edge[] = [];
  const connectionKeys = new Set<string>();

  for (const edge of edges) {
    // Create a unique key based on source and target
    const connectionKey = `${edge.getSource()}->${edge.getTarget()}`;

    if (!connectionKeys.has(connectionKey)) {
      connectionKeys.add(connectionKey);
      uniqueEdges.push(edge);
    }
  }

  edges.length = 0;
  edges.push(...uniqueEdges);
}


export function pruneInvalidEdges(
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
   

/**
 * Convert Edge array to GraphEdge array
 */
export function buildGraphEdges(edges: Edge[]): GraphEdge[] {
  return edges.map((edge) => edge.getGraphEdge());
}

/**
 * Singleton object implementing the EdgeHelper interface
 */
export const baseEdgeHelper: EdgeHelper = {
  buildGraphEdges,
  getOutgoingEdgesFromPort,
  getIncomingEdgesFromPort,
  getEdgesFromPort,
  getEdgesFromComponent,
  filterEdges,
  filterDuplicateEdges,
  pruneInvalidEdges,
};


/**
 * Collect all edges from a specific node and its descendants recursively
 *
 * This function:
 * 1. Collects edges from the current node's ports
 * 2. Recursively collects edges from all children
 * 3. Returns a deduplicated list of all edges
 */
export function collectEdgesFromNode(node: ComponentNode): Edge[] {
  function collectEdgesHelper(currentNode: ComponentNode): Edge[] {
    // Get edges from the current node
    const nodeEdges: Edge[] = baseEdgeHelper.getEdgesFromComponent(currentNode);

    if (currentNode.children && currentNode.children.length > 0) {
      for (const child of currentNode.children) {
        const childEdges = collectEdgesHelper(child);
        nodeEdges.push(...childEdges);
      }
    }

    return nodeEdges;
  }

  const allEdges = collectEdgesHelper(node);

  filterEdges(allEdges);
  return allEdges;
}

/**
 * Filter and adjust edges for a specific set of nodes
 */
export function AdjustEdges(
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
      let closestAncestor = findClosestIncludedAncestor(
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
      let closestAncestor = findClosestIncludedAncestor(
        targetComponent,
        nodesToInclude,
      );
      if (closestAncestor) {
        edge.setTarget(closestAncestor);
      }
    }
  }

  filterDuplicateEdges(edges);
}

/**
 * Helper function to find the closest ancestor of a node that is included in the provided list
 */
function findClosestIncludedAncestor(
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
export function addMissingNodesFromEdges(
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

export const componentGraphEdgeHelper: ComponentGraphEdgeHelper = {
  ...baseEdgeHelper,
  collectEdgesFromNode,
  AdjustEdges,
  addMissingNodesFromEdges,
};
