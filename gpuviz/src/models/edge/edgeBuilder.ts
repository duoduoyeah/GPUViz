import type { Port, Edge, ComponentNode } from "../../types";
import { EdgeImpl } from "./edge";


/**
 * Builder class for creating Edge instances
 */
export class EdgeBuilder {
  /**
   * Create an edge between two ports
   */
  public static createEdge(sourcePort: Port, targetPort: Port): Edge {
    return new EdgeImpl(sourcePort, targetPort);
  }


  public static createComponentEdge(source: ComponentNode, target: ComponentNode): Edge {
    // Create temporary ports for component connections
    const sourcePort = { 
      name: `${source.getName()}_out`, 
      getComponent: () => source 
    } as Port;
    
    const targetPort = { 
      name: `${target.getName()}_in`, 
      getComponent: () => target 
    } as Port;
    
    return new EdgeImpl(sourcePort, targetPort);
  }

  public static getEdgesFromComponent(component: ComponentNode): Edge[] {
    const allEdges: Edge[] = [];

    // Get edges from all ports in the component
    const ports = component.getPorts();
    for (const port of ports) {
      const portEdges = this.getEdgesFromPort(port);
      allEdges.push(...portEdges);
    }
    return allEdges;
  }

  private static getOutgoingEdgesFromPort(port: Port): Edge[] {
    const edges: Edge[] = [];

    // Create edges from this port to all outgoing ports
    for (const targetPort of port.outgoingPort) {
      // Create the edge with source port, target port, and their respective components
      const edge = new EdgeImpl(port, targetPort);

      edges.push(edge);
    }

    return edges;
  }

  private static getIncomingEdgesFromPort(port: Port): Edge[] {
    const edges: Edge[] = [];

    // Create edges from all incoming ports to this port
    for (const sourcePort of port.incomingPort) {
      // Create the edge with source port, target port, and their respective components
      const edge = new EdgeImpl(sourcePort, port);

      edges.push(edge);
    }

    return edges;
  }

  private static getEdgesFromPort(port: Port): Edge[] {
    // Combine both incoming and outgoing edges
    const incomingEdges = this.getIncomingEdgesFromPort(port);
    const outgoingEdges = this.getOutgoingEdgesFromPort(port);

    // Return the combined array of edges
    return [...incomingEdges, ...outgoingEdges];
  }



}
