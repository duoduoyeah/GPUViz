
export type ComponentKind = 'square' | 'rectangleBar' | undefined;

export interface Port {
    name: string
    incomingPort: Port[]
    outgoingPort: Port[]

    setIncomingPorts(ports: Port[]): void
    setOutgoingPorts(ports: Port[]): void
}

export interface NodeInfo {
}

export interface ComponentNode<T extends NodeInfo> {
    name: string;
    type: string;
    info: T;
    ports: Port[];
    parent: ComponentNode<T> | undefined;
    children: ComponentNode<T>[];
    shape: ComponentKind

    //get
    getName(): string;
    getInfo(): T;
    getPorts(): Port[];
    getParent(): ComponentNode<T> | undefined;
    getChildren(): ComponentNode<T>[];

    //set
    setParent(parent: ComponentNode<T>): void;
    setChildren(children: ComponentNode<T>[]): void;
    setInfo(info: T): void;
    setPorts(ports: Port[]): void;
    setShape(): void;
    addChild(child: ComponentNode<T>): void;
}