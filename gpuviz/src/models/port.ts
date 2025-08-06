import type { ComponentNode, Port } from "../types/index";

export class PortImpl implements Port {
  readonly name: string;
  incomingPort: Port[];
  outgoingPort: Port[];
  owner: ComponentNode;

  constructor(name: string) {
    this.name = name;
    this.incomingPort = [];
    this.outgoingPort = [];
    this.owner = {} as ComponentNode; // Temporary placeholder
  }

  setOwner(owner: ComponentNode): void {
    this.owner = owner;
  }

  setIncomingPorts(ports: Port[]): void {
    this.incomingPort = ports;
  }

  setOutgoingPorts(ports: Port[]): void {
    this.outgoingPort = ports;
  }

  getComponent(): ComponentNode {
    return this.owner;
  }
}
