import type { Port } from "../types/index";

export class PortImpl implements Port {
  readonly name: string;
  incomingPort: Port[];
  outgoingPort: Port[];

  constructor(name: string) {
    this.name = name;
    this.incomingPort = [];
    this.outgoingPort = [];
  }

  setIncomingPorts(ports: Port[]) {
    this.incomingPort = ports;
    return this;
  }

  setOutgoingPorts(ports: Port[]) {
    this.outgoingPort = ports;
    return this;
  }
}
