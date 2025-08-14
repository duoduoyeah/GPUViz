import type { ComponentNode, Port } from "../../types";

export class PortImpl implements Port {
  readonly name: string;
  readonly type: string;

  incomingPort: Port[];
  outgoingPort: Port[];
  owner: ComponentNode;

  constructor(name: string) {
    this.name = name;
    this.type = this.setType(name); 
    this.incomingPort = [];
    this.outgoingPort = [];
    this.owner = {} as ComponentNode; // Temporary placeholder
  }

  private setType(name: string): string {
    const parts = name.split(".");
    return parts.length > 0 ? parts[parts.length - 1] : name;
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

  getType(): string {
    return this.type;
  }

  getName(): string {
    return this.name;
  }
}

export class CombinedPort extends PortImpl {
  subPorts: Port[];

  constructor(name: string) {
    super(name);
    this.subPorts = [];
  }

  setSubPorts(ports: Port[]): void {
    this.subPorts = ports;
  }

  addSubPort(port: Port): void {
    this.subPorts.push(port);
  }

  getSubPorts(): Port[] {
    return this.subPorts;
  }

  getSubPortCount(): number {
    return this.subPorts.length;
  }
}