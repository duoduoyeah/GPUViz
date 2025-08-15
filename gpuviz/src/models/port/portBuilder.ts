import type { ComponentNode, Port } from "../../types";
import { CombinedPort } from "./port";

/**
 * Generates combined ports for a given component by aggregating all ports from its subcomponents.
 * @param component The component node to generate combined ports for.
 * @returns An array containing the combined port.
 */
export class PortBuilder {

    static generateCombinedPort(component: ComponentNode, subPorts: Port[], type?: string): Port | null {
        if (!subPorts || subPorts.length === 0) {
            return null;
        }
        const portType = type || (subPorts[0] ? subPorts[0].getType() : "CombinedPort");
        const name = component.getName() + "." + portType;
        const newPort = new CombinedPort(name);
        newPort.assignSubPorts(subPorts);
        newPort.setOwner(component);
        return newPort;
    }

    static generateCombinedPorts(component: ComponentNode): Port[] {
        const combinedPorts: Port[] = [];
        const subComponents = component.getSubcomponents();
        if (!subComponents || subComponents.length === 0) {
            return combinedPorts;
        }

        // Map from port type to array of ports
        const portTypeMap: { [type: string]: Port[] } = {};

        for (const subComponent of subComponents) {
            const ports = subComponent.getPorts();
            if (ports && ports.length > 0) {
                for (const port of ports) {
                    const type = port.getType();
                    if (!portTypeMap[type]) {
                        portTypeMap[type] = [];
                    }
                    portTypeMap[type].push(port);
                }
            }
        }

        // For each port type, use generateCombinedPort
        for (const type in portTypeMap) {
            const combinedPort = this.generateCombinedPort(component, portTypeMap[type], type);
            if (combinedPort) {
                combinedPorts.push(combinedPort);
            }
        }

        return combinedPorts;
    }

    static setCombinedPortsConnection() {}
}
