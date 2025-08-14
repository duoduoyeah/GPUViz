import type { ComponentNode, Port, Edge, GraphEdge} from "../..//types";

export class EdgeImpl implements Edge {

  readonly id: string;
  source: ComponentNode;
  target: ComponentNode;

  constructor(sourcePort: Port, targetPort: Port) {
    this.id = this.generateId(sourcePort, targetPort);
    this.source = sourcePort.getComponent();
    this.target = targetPort.getComponent();

  }

  generateId(sourcePort: Port, targetPort: Port) {
    return `${sourcePort.name}_to_${targetPort.name}`;
  }

  getSource(): ComponentNode {
    return this.source;
  }

  getTarget(): ComponentNode {
    return this.target;
  }

  getSourceName(): string {
    return this.source.getName();
  }

  getTargetName(): string {
    return this.target.getName();
  }

  getGraphEdge(): GraphEdge {
    return {
      data: {
        id: this.id,
        source: this.getSourceName(),
        target: this.getTargetName(),
      },
    };
  }

  equals(other: Edge): boolean {
    return this.getId() === other.getId();
  }

  getId(): string {
    return this.id;
  }



  setSource(source: ComponentNode): void {
    this.source = source;
  }

  setTarget(target: ComponentNode): void {
    this.target = target;
  }


  //08-14-2025, currently No Need
  // copyEdge(): Edge {
  //   const copy = new EdgeImpl(
  //     { name: this.source.getName(), getComponent: () => this.source } as Port,
  //     { name: this.target.getName(), getComponent: () => this.target } as Port
  //   );
  //   copy.setCombinedEdgeCount(this.combinedEdgeCount);
  //   return copy;
  // }
}

export class CombinedEdge extends EdgeImpl {
  combinedEdgeCount: number;
  SubSources: ComponentNode[];
  SubTargets: ComponentNode[];

  constructor(sourcePort: Port, targetPort: Port) {
    super(sourcePort, targetPort);
    this.combinedEdgeCount = 1;
    this.SubSources = [];
    this.SubTargets = [];
  }

  setCombinedEdgeCount(count: number): void {
    this.combinedEdgeCount = count;
  }

  getCombinedEdgeCount(): number {
    return this.combinedEdgeCount;
  }
}
