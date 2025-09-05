export type ComponentKind = "square" | "rectangleBar" | undefined;

export interface Port {
  name: string;
  type: string;
  incomingPort: Port[];
  outgoingPort: Port[];
  owner: ComponentNode | undefined;
  combinePort: Port;

  setOwner(owner: ComponentNode): void;
  setIncomingPorts(ports: Port[]): void;
  setOutgoingPorts(ports: Port[]): void;
  setCombinePort(port: Port): void;
  addIncomingPort(port: Port): void;
  addOutgoingPort(port: Port): void;

  getCombinePort(): Port;
  getComponent(): ComponentNode;
  getType(): string;
  getName(): string;
}

export interface NodeInfo {}

export interface ComponentNode {
  name: string;
  type: string;
  info: NodeInfo;
  ports: Port[];
  combinedComponent: ComponentNode | undefined;
  parent: ComponentNode | undefined;
  children: ComponentNode[];
  subComponents: ComponentNode[];
  shape: ComponentKind;

  //get
  getName(): string;
  getInfo(): NodeInfo;
  getPorts(): Port[];
  getParent(): ComponentNode | undefined;
  getChildren(): ComponentNode[];
  getSubcomponents(): ComponentNode[];
  getCombinedComponent(): ComponentNode | undefined;

  //set
  setParent(parent: ComponentNode): void;
  setChildren(children: ComponentNode[]): void;
  assignSubComponents(components: ComponentNode[]): void;
  setInfo(info: NodeInfo): void;
  setPorts(ports: Port[]): void;
  addPort(port: Port): void;
  setShape(): void;
  addChild(child: ComponentNode): void;
  setCombinedComponent(component: ComponentNode | undefined): void;
  setRoot(): void;

  //bool
  isAncestor(node: ComponentNode): boolean;
  isIsolated(): boolean;
  checkIsRoot(): boolean;
  validateComponent(): boolean;
}
