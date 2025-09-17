import type {
  ComponentNode,
  Port,
  NodeInfo,
  TopologyPortEntry,
  PortConnectionEntry,
} from "../../types";
import { PortImpl } from "../port/port";
import { SQLITE_SERVER_PORT } from "../../config/default";
import { BasicComponentBuilder } from "../component";


export class SqliteComponentNodeBuilder {
  private componentMap: Map<string, ComponentNode> = new Map();
  private portMap: Map<string, Port> = new Map();
  private defaultInfo: NodeInfo;
  private rootComponentName: string = "root";
  private rootComponent: ComponentNode;

  constructor(defaultInfo: NodeInfo) {
    this.defaultInfo = defaultInfo;
    this.rootComponent = BasicComponentBuilder.create(this.rootComponentName)
        .withInfo(this.defaultInfo)
        .withType(this.getType(this.rootComponentName))
        .withShape()
        .build();
    this.rootComponent.setRoot();
    this.componentMap.set(this.rootComponentName, this.rootComponent)
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

    public buildFromSqlite(rawPorts: TopologyPortEntry[], rawConnections: PortConnectionEntry[]): ComponentNode {
      //Later: validate if sqlite file has error

      //create all components, ports
      this.createComponents(rawPorts);
      this.connectComponentPorts(rawPorts, rawConnections);
      
      //set up components
      this.addParentComponent();
      this.establishParentChildRelationships();
      

      //validation component list
      for (const [_, component] of this.componentMap) {
        if (!component.validateComponent()) {
          console.error(`Component validation failed for:`, component);
        }
      }

    //output only root component
    return this.rootComponent;
    }

    private addParentComponent(): void {
      const tempComponentList: ComponentNode[] = [];
      const tempComponentNames = new Set<string>();

      // For each component in the map, recursively check the parent
      for (const [name] of this.componentMap) {
        this.ensureParentExists(name, tempComponentList, tempComponentNames);
      }

      // At the end, add all components in the temp list to our map
      for (const component of tempComponentList) {
        this.componentMap.set(component.getName(), component);
      }

    }
    
    private ensureParentExists(
      componentName: string,
      tempComponentList: ComponentNode[],
      tempComponentNames: Set<string>,
    ): void {
      const parentName = this.getParentName(componentName);
  
      if (!parentName) {
        return; // No parent (root component)
      }
  
      if (
        this.componentMap.has(parentName) ||
        tempComponentNames.has(parentName)
      ) {
        return;
      }
  
      this.ensureParentExists(parentName, tempComponentList, tempComponentNames);
  
      // Create the parent component using initializeComponent method
      const parentComponentEntry: TopologyPortEntry = {
        port: "",
        component: parentName, // Parent components get empty ports by default
      };
  
      // Use initializeComponent to create the parent component
      const parentComponent = this.initializeComponent(parentComponentEntry);
  
      tempComponentList.push(parentComponent);
      tempComponentNames.add(parentName);
    }

    private establishParentChildRelationships() {
      for (const [name, component] of this.componentMap) {
        const parentName = this.getParentName(name);
        if (parentName) {
          // We can safely get the parent as we've ensured it exists
          const parent = this.componentMap.get(parentName);
          if (parent) {
          component.setParent(parent);
          parent.addChild(component);
          } else {
            console.error(`Parent component not found: ${parent}`);
          }

        } else {
            if (!component.checkIsRoot()) {
              component.setParent(this.rootComponent);
              this.rootComponent.addChild(component);
            }
          }
      }
    }

    private getParentName(name: string): string | null {
      const lastDotIndex = name.lastIndexOf(".");
      if (lastDotIndex === -1) return null;
      return name.substring(0, lastDotIndex);
    }

    // Connect component ports using PortConnectionEntry
    private connectComponentPorts(rawPorts: TopologyPortEntry[], rawConnections: PortConnectionEntry[]) {
      const portMap = this.portMap;
      for (const rawPort of rawPorts) {
        const component = this.componentMap.get(rawPort.component);
        if (component) {
          const port = new PortImpl(rawPort.port);
          portMap.set(rawPort.port, port);
          port.setOwner(component);
          component.addPort(port);
        } else {
          console.error(`Owner component not found for port: ${rawPort.port}`);
        }
      }

      // Step 3: outgoing and incoming of ports
      for (const entry of rawConnections) {
        const fromPort = portMap.get(entry.from_port);
        const toPort = portMap.get(entry.to_port);
        // Add to outgoing ports of fromPort
        if (fromPort && toPort) {
          fromPort.addOutgoingPort(toPort);
          toPort.addIncomingPort(fromPort);
        } else {
          console.error(`Port not found for connection: from ${entry.from_port} to ${entry.to_port}`);
        }
      }

      // Step 4: (Optional) Validate connections
      // TODO: Add validation logic here (duplicate/invalid connections)
    }

    private createComponents(rawPorts: TopologyPortEntry[]): void {


      // First, create all components using initializeComponent
      for (const rawPort of rawPorts) {
        if (!this.componentMap.has(rawPort.component)) {
          const component = this.initializeComponent(rawPort);
          this.componentMap.set(rawPort.component, component);
        }
      }
    }

    private initializeComponent(rawPort: TopologyPortEntry): ComponentNode {
      return BasicComponentBuilder.create(rawPort.component)
        .withInfo(this.defaultInfo)
        .withType(this.getType(rawPort.component))
        .withShape()
        .build();
    }

    getType(name: string) {
      const parts = name.split(".");
      if (parts.length === 0) return "";

      const lastPart = parts[parts.length - 1];
      // Remove array indices to get the type
      const typeMatch = lastPart.match(/^([^[]+)/);
      return typeMatch ? typeMatch[1] : "";
  }
}