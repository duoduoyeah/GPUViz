import type { ComponentNode, Port } from "../../types";

export class PortImpl implements Port {
  readonly name: string;
  readonly type: string;

  combinePort: Port;
  incomingPort: Port[];
  outgoingPort: Port[];
  owner: ComponentNode | undefined;

  constructor(name: string) {
    this.name = name;
    this.type = this.setType(name); 
    this.incomingPort = [];
    this.outgoingPort = [];
  this.owner = undefined;
    this.combinePort = {} as Port;
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

  addIncomingPort(port: Port): void {
    if (this.incomingPort.includes(port)) {
      return;
    }
    this.incomingPort.push(port);
  }

  addOutgoingPort(port: Port): void {
    if (this.outgoingPort.includes(port)) {
      return;
    }
    this.outgoingPort.push(port);
  }

  setCombinePort(port: Port): void {
    this.combinePort = port;
  }

  getCombinePort(): Port {
    return this.combinePort;
  }

  getComponent(): ComponentNode {
    if (!this.owner) {
      console.error("Error: Port owner is missing or is an empty object.");
      return {} as ComponentNode;
    }
    return this.owner;
  }

  getType(): string {
    return this.type;
  }

  getName(): string {
    return this.name;
  }

  validatePort(): [boolean, string] {
    if (!this.name || this.name.trim() === "") {
      return [false, "Port name is missing"];
    }
    if (!this.owner || Object.keys(this.owner).length === 0) {
      return [false, "Port owner is missing"];
    }
    return [true, ""];
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

  assignSubPorts(ports: Port[]): void {
    this.subPorts = ports;
    ports.forEach(port => {
      port.setCombinePort(this);
    });
  }
}