import type {
  ComponentNode,
  Port,
  NodeInfo,
  ComponentKind,
} from "../types/index";

// Create a class that implements the ComponentNode interface
export class ComponentNodeImpl implements ComponentNode {
  name: string;
  info!: NodeInfo;

  ports: Port[] = [];
  portNum: number = 0;

  type: string = "";
  shape: ComponentKind;

  parent: ComponentNode | undefined;
  children: ComponentNode[] = [];

  constructor(name: string) {
    this.name = name;
  }

  setType(type: string): void {
    this.type = type;
  }

  setInfo(info: NodeInfo): void {
    this.info = info;
  }

  setPorts(ports: Port[]): void {
    this.ports = ports;
    this.portNum = this.ports.length;
  }

  setShape(): void {
    this.shape = "square";
  }

  public setParent(parent: ComponentNode): void {
    this.parent = parent;
  }

  setChildren(children: ComponentNode[]): void {
    this.children = children;
  }

  getName(): string {
    return this.name;
  }

  getInfo(): NodeInfo {
    return this.info;
  }

  getPorts(): Port[] {
    return this.ports;
  }

  getPortNum(): number {
    return this.portNum;
  }

  getParent(): ComponentNode | undefined {
    return this.parent;
  }

  getChildren(): ComponentNode[] {
    return this.children;
  }

  // Method to add a child node
  addChild(child: ComponentNode): void {
    this.children.push(child);
  }

  // Method to add a port
  addPort(port: Port): void {
    this.ports.push(port);
  }

  isAncestor(node: ComponentNode): boolean {
    if (!this.parent) {
      return false;
    }
    
    if (this.parent === node) {
      return true;
    }
    
    return this.parent.isAncestor(node);
  }
}
