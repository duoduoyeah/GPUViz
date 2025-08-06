import type { Port } from "../types/component";
import type { Edge } from "../types/edge";
import type { GraphEdge } from "../types/graph";

export class EdgeImpl implements Edge {
  data: {
    readonly id: string;
    source: Port;
    target: Port;
  };

  constructor(id: string, source: Port, target: Port) {
    this.data = {
      id,
      source,
      target
    };
  }

  /**
   * Get the source port component name and port name
   * @returns string representation of source
   */
  getSource(): string {
    return this.data.source.name;
  }

  /**
   * Get the target port component name and port name
   * @returns string representation of target
   */
  getTarget(): string {
    return this.data.target.name;
  }

  /**
   * Convert the Edge to a GraphEdge format
   * @returns GraphEdge representation of this edge
   */
  getGraphEdge(): GraphEdge {
    return {
      data: {
        id: this.data.id,
        source: this.getSource(),
        target: this.getTarget()
      }
    };
  }

  /**
   * Compare this edge with another to check if they are the same
   * Two edges are considered the same if they have the same source and target ports
   * @param other The other edge to compare with
   * @returns true if the edges are the same, false otherwise
   */
  equals(other: Edge): boolean {
    return (
      this.getSource() === other.getSource() &&
      this.getTarget() === other.getTarget()
    );
  }
  
}
