import type { ComponentNode, Port } from "../types/component";
import type { Edge } from "../types/edge";
import type { GraphEdge } from "../types/cytoscapeGraph";

export class EdgeImpl implements Edge {
  data: {
    readonly id: string;
    source: ComponentNode;
    target: ComponentNode;
  };

  constructor(sourcePort: Port, targetPort: Port) {
    this.data = {
      id: this.generateId(sourcePort, targetPort),
      source: sourcePort.getComponent(),
      target: targetPort.getComponent(),
    };
  }

  generateId(sourcePort: Port, targetPort: Port) {
    return `${sourcePort.name}_to_${targetPort.name}`;
  }

  getSource(): ComponentNode {
    return this.data.source;
  }

  getTarget(): ComponentNode {
    return this.data.target;
  }

  getSourceName(): string {
    return this.data.source.getName();
  }

  getTargetName(): string {
    return this.data.target.getName();
  }

  getGraphEdge(): GraphEdge {
    return {
      data: {
        id: this.data.id,
        source: this.getSourceName(),
        target: this.getTargetName(),
      },
    };
  }

  equals(other: Edge): boolean {
    return this.getId() === other.getId();
  }

  getId(): string {
    return this.data.id;
  }

  setSource(source: ComponentNode): void {
    this.data = {
      ...this.data,
      source,
    };
  }

  setTarget(target: ComponentNode): void {
    this.data = {
      ...this.data,
      target,
    };
  }
}
