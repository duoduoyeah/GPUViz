import type {
  ComponentNode,
  Port,
  NodeInfo,
  JsonData,
  JsonComponent,
  JsonPort,
} from "../types";
import { ComponentNodeImpl } from "./componentNode";
import { PortImpl } from "./port";

// Component Node Builder
export class ComponentNodeBuilder<T extends NodeInfo> {
  private componentMap: Map<string, ComponentNode<T>> = new Map();
  private defaultInfo: T;

  constructor(defaultInfo: T) {
    this.defaultInfo = defaultInfo;
  }

  /**
   * Build component tree from JSON data
   * @returns Array of root ComponentNode<T> objects
   */
  buildFromJson(jsonData: JsonData): ComponentNode<T>[] {
    const validationError = this.validateJsonData(jsonData);
    if (validationError) {
      throw new Error(validationError);
    }

    // First pass: Create all components
    for (const jsonComponent of jsonData.components) {
      const component = this.initializeComponent(jsonComponent);
      this.componentMap.set(component.getName(), component);
    }

    //add parent component to componentMap
    //here we will use a function called addParentComponent
    this.addParentComponent();

    // Second pass: Establish parent-child relationships
    for (const [name, component] of this.componentMap) {
      const parentName = this.getParentName(name);
      if (parentName) {
        // We can safely get the parent as we've ensured it exists
        const parent = this.componentMap.get(parentName)!;
        component.setParent(parent);
        parent.addChild(component);
      }
    }

    // Third pass: Connect ports based on port names
    this.connectPorts(jsonData);

    // Return root components (those without parents)
    return Array.from(this.componentMap.values()).filter(
      (component) => component.getParent() === undefined,
    );
  }

  private initializeComponent(jsonComponent: JsonComponent): ComponentNode<T> {
    const component = new ComponentNodeImpl<T>(jsonComponent.name);

    // Set component properties using setter methods
    component.setType(this.getType(jsonComponent.name));
    component.setInfo(this.defaultInfo);
    component.setPorts(this.createPorts(jsonComponent.ports));
    component.setShape();
    return component;
  }

  private validateJsonData(jsonData: JsonData): string | null {
    return this.validateUniqueComponentNames(jsonData);
  }

  private validateUniqueComponentNames(jsonData: JsonData): string | null {
    const nameSet = new Set<string>();
    for (const jsonComponent of jsonData.components) {
      if (nameSet.has(jsonComponent.name)) {
        return `Duplicate component name detected: ${jsonComponent.name}`;
      }
      nameSet.add(jsonComponent.name);
    }
    return null; // No errors found
  }

  private addParentComponent() {
    const tempComponentList: ComponentNode<T>[] = [];
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
    tempComponentList: ComponentNode<T>[],
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
    const parentJsonComponent: JsonComponent = {
      name: parentName,
      ports: [], // Parent components get empty ports by default
    };

    // Use initializeComponent to create the parent component
    const parentComponent = this.initializeComponent(parentJsonComponent);

    tempComponentList.push(parentComponent);
    tempComponentNames.add(parentName);
  }

  private createPorts(jsonPorts: JsonPort[]): Port[] {
    return jsonPorts.map((jsonPort) => new PortImpl(jsonPort.name));
  }

  /**
   * Get parent name from component name
   * e.g., "GPU.SA[2].CU[3]" -> "GPU.SA[2]"
   */
  private getParentName(name: string): string | null {
    const lastDotIndex = name.lastIndexOf(".");
    if (lastDotIndex === -1) return null;
    return name.substring(0, lastDotIndex);
  }

  private connectPorts(jsonData: JsonData): void {
    // Create a map of all ports for easy lookup
    const portMap = new Map<string, Port>();

    // Populate port map with fully qualified port names (componentName.portName)
    for (const [_, component] of this.componentMap) {
      for (const port of component.getPorts()) {
        portMap.set(port.name, port);
      }
    }

    // Now connect the ports based on the JSON data
    for (const jsonComponent of jsonData.components) {
      const component = this.componentMap.get(jsonComponent.name);
      if (!component) continue;

      for (let i = 0; i < jsonComponent.ports.length; i++) {
        const jsonPort = jsonComponent.ports[i];
        const port = component.getPorts()[i];

        // Connect incoming ports
        const incomingPortsRefs: Port[] = [];
        if (jsonPort.incomingPort) {
          for (const inPortName of jsonPort.incomingPort) {
            const inPort = portMap.get(inPortName);
            if (inPort) incomingPortsRefs.push(inPort);
          }
        }
        port.setIncomingPorts(incomingPortsRefs);

        // Connect outgoing ports
        const outgoingPortsRefs: Port[] = [];
        if (jsonPort.outgoingPort) {
          for (const outPortName of jsonPort.outgoingPort) {
            const outPort = portMap.get(outPortName);
            if (outPort) outgoingPortsRefs.push(outPort);
          }
        }
        port.setOutgoingPorts(outgoingPortsRefs);
      }
    }
  }

  getComponent(name: string): ComponentNode<T> | undefined {
    return this.componentMap.get(name);
  }

  getAllComponents(): ComponentNode<T>[] {
    return Array.from(this.componentMap.values());
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

// Example usage:
/*
// Sample JSON data
const jsonData = {
  components: [
    {
      name: "GPU",
      ports: [
        {
          name: "input",
          incomingPort: [],
          outcomingPort: ["GPU.SA[0].input", "GPU.SA[1].input"]
        }
      ]
    },
    {
      name: "GPU.SA[0]",
      ports: [
        {
          name: "input",
          incomingPort: ["GPU.input"],
          outcomingPort: ["GPU.SA[0].CU[0].input"]
        }
      ]
    },
    {
      name: "GPU.SA[0].CU[0]",
      ports: [
        {
          name: "input",
          incomingPort: ["GPU.SA[0].input"],
          outcomingPort: []
        },
        {
          name: "output",
          incomingPort: [],
          outcomingPort: ["GPU.SA[0].CU[1].input"]
        }
      ]
    }
  ]
};

// Create builder and build tree
const defaultInfo = {}; // Your default NodeInfo
const builder = new ComponentNodeBuilder(defaultInfo);
const rootComponents = builder.buildFromJson(jsonData);

// Print the tree
rootComponents.forEach(root => builder.printTree(root));
*/
