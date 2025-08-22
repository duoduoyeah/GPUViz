import type {
  ComponentNode,
  Port,
  NodeInfo,
  ComponentKind,
} from "../../types/index";

// Create a class that implements the ComponentNode interface
export class ComponentNodeImpl implements ComponentNode {
  name: string;
  info!: NodeInfo;

  ports: Port[] = [];
  portNum: number = 0;

  type: string = "";
  shape: ComponentKind;

  combinedComponent: ComponentNode | undefined;
  parent: ComponentNode | undefined;
  children: ComponentNode[] = [];
  subComponents: ComponentNode[] = [];

  private _isolated: boolean | undefined;

  constructor(name: string) {
    this.name = name;
  }

  assignSubComponents(components: ComponentNode[]) {
    this.subComponents = components;
    components.forEach(component => {
      component.setCombinedComponent(this);
    });
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

  setParent(parent: ComponentNode): void {
    this.parent = parent;
  }

  setChildren(children: ComponentNode[]): void {
    this.children = children;
  }

  setCombinedComponent(component: ComponentNode | undefined): void {
    this.combinedComponent = component;
  }

  getCombinedComponent(): ComponentNode | undefined {
    return this.combinedComponent;
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

  getSubcomponents(): ComponentNode[] {
    return this.subComponents;
  }

  addChild(child: ComponentNode): void {
    if (this.children.includes(child)) {
      return;
    }
    this.children.push(child);
  }

  addPort(port: Port): void {
    if (this.ports.includes(port)) {
      return;
    }
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

  isIsolated(): boolean {
    //if _isolated undefined first set it
    if (this._isolated === undefined) {
      // one component is isolated if and only if: it has no port, its decedent are all isolated.
      if (this.ports.length > 0) {
        this._isolated = false;
      } else if (this.children.length === 0) {
        this._isolated = true;
      } else {
        this._isolated = this.children.every(child => child.isIsolated());
      }
    }
    
    return this._isolated;
  }

  validateComponent(): boolean {
  // Check name
  if (!this.name || this.name.trim() === "") return false;

  // Check info is not nil
  if (!this.info) return false;

  // Check shape is set
  if (!this.shape) return false;

  return true;
  }
}
