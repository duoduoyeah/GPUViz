import type { ComponentNode, Port } from "../../types";
import { CombinedPort } from "./port";

export function generateCombinedPorts(component: ComponentNode): Port[] {
    const combinedPorts: Port[] = [];
    const portName = component.getName() + "." + "CombinedPort"; 

    // Create a new combined port with the proper name
    const newPort = new CombinedPort(portName);
    newPort.setOwner(component);
    
    // Loop through all sub-components, add all their ports using addSubPort
    const subComponents = component.getSubcomponents();
    if (subComponents && subComponents.length > 0) {
        for (const subComponent of subComponents) {
            const subPorts = subComponent.getPorts();
            if (subPorts && subPorts.length > 0) {
                for (const port of subPorts) {
                    newPort.addSubPort(port);
                }
            }
        }
    }
    
    combinedPorts.push(newPort);
    return combinedPorts;
}


