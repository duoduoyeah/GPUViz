import type { 
    Port,
    GraphEdge,
    Edge,
    ComponentNode
 } from "../types/index";
import { EdgeImpl } from "./edge";

/**
 * Interface defining edge helper methods for graph operations
 */
export interface EdgeHelper {
    /**
     * Convert Edge array to GraphEdge array
     */
    getGraphEdges(edges: Edge[]): GraphEdge[];

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
     * Validate that edges have unique IDs and connections
     */
    validateEdges(edges: Edge[]): void;
}


/**
 * Interface extending EdgeHelper with component graph specific operations
 */
export interface ComponentGraphEdgeHelper extends EdgeHelper {
    /**
     * Build edges between multiple components in a component graph
     */
    buildGraphEdges(components: ComponentNode[]): Edge[];
    
    /**
     * Build edges between a component and its subcomponents
     */
    collectEdgesFromNode(root: ComponentNode): Edge[];

    /**
     * Filter and adjust edges for a specific set of nodes
     */
    filterAndAdjustEdges(
        edges: Edge[], 
        nodesToInclude: ComponentNode[], 
        rootNode: ComponentNode
    ): void;

    /**
     * Add missing nodes to the component list based on edge connections
     */
    addMissingNodesFromEdges(
        edges: Edge[], 
        nodesToInclude: ComponentNode[]
    ): void;
}

export function getOutgoingEdgesFromPort(port: Port): Edge[] {
    const edges: Edge[] = [];
    
    // Create edges from this port to all outgoing ports
    for (const targetPort of port.outgoingPort) {
        // Create a unique ID for this edge
        const edgeId = `${port.name}_to_${targetPort.name}`;
        
        // Create the edge
        const edge = new EdgeImpl(edgeId, port, targetPort);
        
        edges.push(edge);
    }
    
    return edges;
}

export function getIncomingEdgesFromPort(port: Port): Edge[] {
    const edges: Edge[] = [];
    
    // Create edges from all incoming ports to this port
    for (const sourcePort of port.incomingPort) {
        // Create a unique ID for this edge
        const edgeId = `${sourcePort.name}_to_${port.name}`;
        
        // Create the edge
        const edge = new EdgeImpl(edgeId, sourcePort, port);
        
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
    filterDuplicateEdges(edges);

    // Check for errors
    validateEdges(edges);
}

export function filterDuplicateEdges(edges: Edge[]) {
    const uniqueEdges: Edge[] = [];
    const edgeKeys = new Set<string>();
    
    for (const edge of edges) {
        // Create a unique key for this edge based on the equality criteria
        const edgeKey = `${edge.data.id}|${edge.getSource()}|${edge.getTarget()}`;
        
        if (!edgeKeys.has(edgeKey)) {
            edgeKeys.add(edgeKey);
            uniqueEdges.push(edge);
        }
    }
    
    edges.length = 0;
    edges.push(...uniqueEdges);
}

export function validateEdges(edges: Edge[]) {
    const edgeIds = new Set<string>();
    const connectionKeys = new Set<string>();
    
    for (const edge of edges) {
        // Check for duplicate edge IDs
        if (edgeIds.has(edge.data.id)) {
            throw new Error(`Duplicate edge ID found: ${edge.data.id}. Edge IDs must be unique.`);
        }
        edgeIds.add(edge.data.id);
        
        // Check for duplicate connections (same source and target)
        const connectionKey = `${edge.getSource()}->${edge.getTarget()}`;
        if (connectionKeys.has(connectionKey)) {
            throw new Error(`Duplicate connection found from ${edge.getSource()} to ${edge.getTarget()}.`);
        }
        connectionKeys.add(connectionKey);
    }
}

/**
 * Convert Edge array to GraphEdge array
 */
export function getGraphEdges(edges: Edge[]): GraphEdge[] {
    return edges.map(edge => edge.getGraphEdge());
}

/**
 * Singleton object implementing the EdgeHelper interface
 */
export const baseEdgeHelper: EdgeHelper = {
  getGraphEdges,
  getOutgoingEdgesFromPort,
  getIncomingEdgesFromPort,
  getEdgesFromPort,
  getEdgesFromComponent,
  filterEdges,
  filterDuplicateEdges,
  validateEdges
};

/**
 * Build graph edges from a list of component nodes
 */
export function buildGraphEdges(components: ComponentNode[]): Edge[] {
    const edges: Edge[] = [];
    // Implementation to be added
    return edges;
}

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
    
    return allEdges;
}



/**
 * Filter and adjust edges for a specific set of nodes
 */
export function filterAndAdjustEdges(
  edges: Edge[], 
  nodesToInclude: ComponentNode[], 
  rootNode: ComponentNode
): void {
//Impl later
}

/**
 * Add missing nodes to the component list based on edge connections
 * 
 * This function:
 * 1. Identifies ports mentioned in edges but not in the provided nodes
 * 2. Adds the nodes containing those ports to the nodesToInclude array
 * 3. This ensures all endpoints of edges are represented in the displayed graph
 */
export function addMissingNodesFromEdges(
  edges: Edge[], 
  nodesToInclude: ComponentNode[]
): void {
}



export const componentGraphEdgeHelper: ComponentGraphEdgeHelper = {
  ...baseEdgeHelper,
  buildGraphEdges,
  collectEdgesFromNode,
  filterAndAdjustEdges,
  addMissingNodesFromEdges
};
