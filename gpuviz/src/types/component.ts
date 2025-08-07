export type ComponentKind = "square" | "rectangleBar" | undefined;

export interface Port {
  name: string;
  incomingPort: Port[];
  outgoingPort: Port[];
  owner: ComponentNode;

  setOwner(owner: ComponentNode): void;
  setIncomingPorts(ports: Port[]): void;
  setOutgoingPorts(ports: Port[]): void;
  getComponent(): ComponentNode;
}

export interface NodeInfo {}

export interface ComponentNode {
  name: string;
  type: string;
  info: NodeInfo;
  ports: Port[];
  parent: ComponentNode | undefined;
  children: ComponentNode[];
  shape: ComponentKind;

  //get
  getName(): string;
  getInfo(): NodeInfo;
  getPorts(): Port[];
  getParent(): ComponentNode | undefined;
  getChildren(): ComponentNode[];

  //set
  setParent(parent: ComponentNode): void;
  setChildren(children: ComponentNode[]): void;
  setInfo(info: NodeInfo): void;
  setPorts(ports: Port[]): void;
  setShape(): void;
  addChild(child: ComponentNode): void;
  
  //bool
  isAncestor(node: ComponentNode): boolean;
  isIsolated(): boolean;
}
