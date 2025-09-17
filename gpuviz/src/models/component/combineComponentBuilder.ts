import type { ComponentNode, NodeInfo, Port } from "../../types";
import { ComponentNodeImpl, BasicComponentBuilder} from ".";

// Combined builder interface
interface ICombinedBuilder {
  build(): ComponentNodeImpl;

  getCombinedName(components: ComponentNode[]): string;
}

// Combined Component Builder
export class CombinedComponentBuilder implements ICombinedBuilder {
  private combinedComponent: ComponentNodeImpl;
  private components: ComponentNode[];

  constructor(components: ComponentNode[]) {
    this.components = components;
    const combinedName = this.getCombinedName(this.components)
    this.combinedComponent =  BasicComponentBuilder.create(combinedName)
      .withInfo({})
      .withType(this.components[0].type)
      .withShape()
      .build();

    const combinePort: Port[] = [];
    this.combinedComponent.setPorts(combinePort);

    const allChildren: ComponentNode[] = [];
    this.combinedComponent.setChildren(allChildren);

    this.combinedComponent.assignSubComponents(this.components);
  }

  getCombinedName(components: ComponentNode[]): string {
    if (components.length === 0) {
        throw new Error("Cannot combine empty components array");
    }
    const names = components.map(comp => comp.getName());
    const regex = /(.*\.)?([^.\[\]]+)(\[\d+\])$/;
    const match = names[0].match(regex);
    if (match) {
        const prefix = match[1] || "";
        const componentType = match[2];
        return `${prefix}${componentType}[Combined]`;
    } else {
        return `${names[0]}[Combined]`;
    }
  }

  build(): ComponentNodeImpl {
    return this.combinedComponent;
  }

  static create(components: ComponentNode[]): CombinedComponentBuilder {
    return new CombinedComponentBuilder(components);
  }

}


    // static combineComponents(components: ComponentNode[]): ComponentNode {
    //     if (components.length === 0) {
    //         throw new Error("Cannot combine empty components array");
    //     }
    //     // Create a new component with a combined name
    //     const combinedName = CombinedComponentBuilder.getCombinedName(components);
    //     const combined = new ComponentNodeImpl(combinedName);
        
    //     // Empty Port
    //     const combinePort: Port[] = [];
    //     combined.setPorts(combinePort);
        
    //     // No children
    //     const allChildren: ComponentNode[] = [];
    //     combined.setChildren(allChildren);
        
    //     // Combine type (use the first component's type)
    //     combined.setType(components[0].type);
        
    //     // Set shape
    //     combined.setShape();
        
    //     // Set Subcomponents
    //     combined.assignSubComponents(components);

    //     // TODO in Future: NodeInfo is used.
    //     const mergedInfo: NodeInfo = {};
    //     combined.setInfo(mergedInfo);
        
    //     return combined;
    // }