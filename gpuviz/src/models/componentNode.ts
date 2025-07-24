
import type { ComponentNode, Port, NodeInfo, ComponentKind} from '../types/index'; 

// Create a class that implements the ComponentNode interface
export class ComponentNodeImpl<T extends NodeInfo> implements ComponentNode<T> {
    name: string;
    info!: T;

    ports: Port[] = [];
    portNum: number = 0;

    type: string = "";
    shape: ComponentKind;

    parent: ComponentNode<T> | undefined;
    children: ComponentNode<T>[] = [];


    constructor(name: string) {
        this.name = name;
    }

    setType(type: string): void {
        this.type = type;
    }

    setInfo(info: T): void {
        this.info = info;
    }

    setPorts(ports: Port[]): void {
        this.ports = ports;
        this.portNum = this.ports.length
    }

    setShape(): void {
        this.shape = 'square'
    }

    public setParent(parent: ComponentNode<T>): void {
        this.parent = parent;
    }

    setChildren(children: ComponentNode<T>[]): void {
        this.children = children;
    }


    getName(): string {
        return this.name;
    }

    getInfo(): T {
        return this.info;
    }

    getPorts(): Port[] {
        return this.ports;
    }

    getPortNum(): number {
        return this.portNum
    }

    getParent(): ComponentNode<T> | undefined {
        return this.parent;
    }

    getChildren(): ComponentNode<T>[] {
        return this.children;
    }

    // Method to add a child node
    addChild(child: ComponentNode<T>): void {
        this.children.push(child);
    }

    // Method to add a port
    addPort(port: Port): void {
        this.ports.push(port);
    }
}