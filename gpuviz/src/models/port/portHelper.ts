import type { Port } from "../../types";
import type { ComponentNode } from "../../types";
import { CombinedPort } from "./port";

export class PortHelper {
  static collectCombinedPorts(
    subPorts: Port[],
    direction: 'incomingPort' | 'outgoingPort',
    combinedComponentsSet: Set<ComponentNode>
  ): Port[] {
    const result: Port[] = [];
    for (const subPort of subPorts) {
      const portList = subPort[direction];
      if (portList && portList.length > 0) {
        for (const p of portList) {
          const combined = p.getCombinePort ? p.getCombinePort() : undefined;
          if (combined && combined instanceof CombinedPort) {
            const owner = combined.getComponent();
            if (combinedComponentsSet.has(owner)) {
              result.push(combined);
            }
          }
        }
      }
    }
    return result;
  }
}
