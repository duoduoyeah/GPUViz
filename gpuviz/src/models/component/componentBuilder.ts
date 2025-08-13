import type { ComponentNode, NodeInfo, Port } from "../../types";
import { ComponentNodeImpl } from "./componentNode";

export function combineComponents(components: ComponentNode[]): ComponentNode {
    if (components.length === 0) {
        throw new Error("Cannot combine empty components array");
    }
    
    if (components.length === 1) {
        return components[0];
    }
    
    // Create a new component with a combined name
    // For names like "GPU[1].SA[9]", we want "GPU[1].SA[Combined]"
    let combinedName = "";
    if (components.length > 0) {
        // Find common prefix by examining all component names
        const names = components.map(comp => comp.getName());
        
        // Extract the pattern before the last bracketed segment
        const regex = /(.*\.)?([^.\[\]]+)(\[\d+\])$/;
        const match = names[0].match(regex);
        
        if (match) {
            // match[1] is the prefix with dots (e.g., "GPU[1].")
            // match[2] is the component type before the brackets (e.g., "SA")
            const prefix = match[1] || "";
            const componentType = match[2];
            combinedName = `${prefix}${componentType}[Combined]`;
        } else {
            // Fallback if the pattern doesn't match
            combinedName = `${names[0]}[Combined]`;
        }
    }
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
    
    //set Subcomponents
    combined.setSubComponents(components);

    // TODO in Future: NodeInfo is used.
    const mergedInfo: NodeInfo = {};
    combined.setInfo(mergedInfo);
    
    return combined;
}