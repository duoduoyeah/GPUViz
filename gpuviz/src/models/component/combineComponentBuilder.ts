import type { ComponentNode, NodeInfo, Port } from "../../types";
import { ComponentNodeImpl } from "./componentNode";

/**
 * Generates a combined name for a group of {@link ComponentNode} instances.
 * 
 * If the input array is empty, an error is thrown.
 * For names matching the pattern `"prefix.componentType[index]"` (e.g., `"GPU[1].SA[9]"`),
 * the function returns a name with the index replaced by `[Combined]` (e.g., `"GPU[1].SA[Combined]"`).
 * If the name does not match the pattern, `[Combined]` is appended to the original name.
 * 
 * @param components - An array of {@link ComponentNode} objects to combine.
 * @returns The combined name as a string.
 * @throws {Error} If the components array is empty.
 * 
 * @remarks
 * This function is useful for aggregating multiple components into a single logical group,
 * especially when visualizing or managing hierarchical GPU components.
 */
export class ComponentBuilder {

    static getCombinedName(components: ComponentNode[]): string {
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

    static combineComponents(components: ComponentNode[]): ComponentNode {
        if (components.length === 0) {
            throw new Error("Cannot combine empty components array");
        }
        // Create a new component with a combined name
        const combinedName = ComponentBuilder.getCombinedName(components);
        const combined = new ComponentNodeImpl(combinedName);
        
        // Empty Port
        const combinePort: Port[] = [];
        combined.setPorts(combinePort);
        
        // No children
        const allChildren: ComponentNode[] = [];
        combined.setChildren(allChildren);
        
        // Combine type (use the first component's type)
        combined.setType(components[0].type);
        
        // Set shape
        combined.setShape();
        
        // Set Subcomponents
        combined.assignSubComponents(components);

        // TODO in Future: NodeInfo is used.
        const mergedInfo: NodeInfo = {};
        combined.setInfo(mergedInfo);
        
        return combined;
    }
}