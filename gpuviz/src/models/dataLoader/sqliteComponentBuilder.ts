import type {
  ComponentNode,
  Port,
  NodeInfo,
  TopologyPortEntry,
  PortConnectionEntry,
} from "../../types";
import { ComponentNodeImpl } from "../component/componentNode";
import { PortImpl } from "../port/port";
import { SQLITE_SERVER_PORT } from "../../config/default";


export class SqliteComponentNodeBuilder {
  private componentMap: Map<string, ComponentNode> = new Map();
  private defaultInfo: NodeInfo;

  constructor(defaultInfo: NodeInfo) {
    this.defaultInfo = defaultInfo;
  }


    public async readTopologyPortFromSQlite(): Promise<TopologyPortEntry[]> {
      try {
        const response = await fetch(`http://localhost:${SQLITE_SERVER_PORT}/api/topology_ports`);
        if (!response.ok) {
          throw new Error(`Failed to fetch topology ports: ${response.statusText}`);
        }
        const data: TopologyPortEntry[] = await response.json();
        return data;
      } catch (error) {
        console.error("Error fetching topology ports:", error);
        return [];
      }
    }

    public async readPortConnectionFromSQlite(): Promise<PortConnectionEntry[]> {
      try {
        const response = await fetch(`http://localhost:${SQLITE_SERVER_PORT}/api/ports_connection`);
        if (!response.ok) {
          throw new Error(`Failed to fetch port connections: ${response.statusText}`);
        }
        const data: PortConnectionEntry[] = await response.json();
        return data;
      } catch (error) {
        console.error("Error fetching port connections:", error);
        return [];
      }
    }

    public buildFromSqlite(rawPorts: TopologyPortEntry[], rawConnections: PortConnectionEntry[]): ComponentNode[] {
      //Later: validate if sqlite file has error

      //create all components
      const components = this.createComponents(rawPorts);

      //set up components
      this.finalizeComponentNodeConnections(components, rawConnections);

      //validation component list
      for (const component of components) {
        if (!component.validateComponent()) {
          console.error(`Component validation failed for:`, component);
        }
      }

    //output only root components (those without a parent)
    return components.filter(component => component.getParent() === undefined);
    }

     /**
     * Establishes parent-child relationships between components and connects their ports.
     */
    private finalizeComponentNodeConnections(
      components: ComponentNode[],
      rawConnections: PortConnectionEntry[],
    ): void {
      this.establishParentChildRelationships(components);
      this.connectComponentPorts(rawConnections, components);
    }

    private establishParentChildRelationships(components: ComponentNode[]): void {
      const componentMap = new Map<string, ComponentNode>();
      for (const component of components) {
        componentMap.set(component.getName(), component);
      }

      for (const component of components) {
        const name = component.getName();
        const lastDotIndex = name.lastIndexOf(".");
        if (lastDotIndex === -1) continue; // No parent (root)
        const parentName = name.substring(0, lastDotIndex);
        const parent = componentMap.get(parentName);
        if (parent) {
          component.setParent(parent);
          parent.addChild(component);
        }
      }
    }
    
    // Connect component ports using PortConnectionEntry
    private connectComponentPorts(portEntries: PortConnectionEntry[], components: ComponentNode[]) {
      const componentMap = new Map<string, ComponentNode>();

      for (const component of components) {
        componentMap.set(component.getName(), component);
      }
      
      // STEP 1: create port and add port to each component
      const portMap = new Map<string, Port>();
      for (const entry of portEntries) {
        const fromPort = portMap.get(entry.from_port);
        if (!fromPort) {
            const newFromPort = new PortImpl(entry.from_port);
            portMap.set(entry.from_port, newFromPort);
        }
        const toPort = portMap.get(entry.to_port);
        if (!toPort) {
            const newToPort = new PortImpl(entry.to_port);
            portMap.set(entry.to_port, newToPort);
        }
      }

      // step 2: set owner of each port in the portMap
      for (const [portName, port] of portMap.entries()) {
        const ownerName = this.getPortOwner(portName);
        const ownerComponent = componentMap.get(ownerName);
        if (ownerComponent) {
          port.setOwner(ownerComponent);
          ownerComponent.addPort(port);
        } else {
          console.error(`Owner component not found for port: ${portName}`);
        }
      }

      // Step 3: outgoing and incoming of ports
      for (const entry of portEntries) {
        const fromPort = portMap.get(entry.from_port);
        const toPort = portMap.get(entry.to_port);
        // Add to outgoing ports of fromPort
        if (fromPort && toPort) {
          fromPort.addOutgoingPort(toPort);
          toPort.addIncomingPort(fromPort)
        } else {
          console.error(`Port not found for connection: from ${entry.from_port} to ${entry.to_port}`);
        }
      }

      // Step 4: (Optional) Validate connections
      // TODO: Add validation logic here (duplicate/invalid connections)
    }

    private createComponents(rawPorts: TopologyPortEntry[]): ComponentNode[] {
      // Map to ensure each component is created only once
      const componentMap: Map<string, ComponentNodeImpl> = new Map();
      // First, create all components
      for (const rawPort of rawPorts) {
        if (!componentMap.has(rawPort.component)) {
          const component = new ComponentNodeImpl(rawPort.component);
          component.setInfo(this.defaultInfo);
          componentMap.set(rawPort.component, component);
        }
      }
      // Then, create ports and assign them to their components
      for (const rawPort of rawPorts) {
        const component = componentMap.get(rawPort.component);
        if (component) {
          const port = new PortImpl(rawPort.port);
          port.setOwner(component);
          component.ports.push(port);
        }
      }
      return Array.from(componentMap.values());
    }

    private getPortOwner(portName: string): string {
        const lastDotIndex = portName.lastIndexOf(".");
        if (lastDotIndex === -1) {
            console.error(`No owner name for port: ${portName}`);
            return portName; // No owner, return the port name itself
        }
        return portName.substring(0, lastDotIndex);
    }
}