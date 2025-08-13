import type { ComponentNode, GraphNode} from "../../types";

export interface ComponentHelper {
  buildGraphNodes(components: ComponentNode[]): GraphNode[];
  removeIsolatedNodes(components: ComponentNode[]): void;
  getDescendantsUpToLevel(
    parent: ComponentNode,
    maxLevel: number,
  ): ComponentNode[];
}

class ComponentHelperImpl implements ComponentHelper {
  buildGraphNodes(components: ComponentNode[]): GraphNode[] {
    return components.map((component, _): GraphNode => {
      return {
        data: {
          id: component.getName(),
          label: component.getName(),
          shape: component.shape,
          type: component.type,
          parent: component.getParent()?.getName(),
        },
      };
    });
  }

  removeIsolatedNodes(components: ComponentNode[]): void {
    // Filter out the isolated nodes using the isIsolated method
    const nonIsolatedComponents = components.filter((component) => {
      return !component.isIsolated();
    });
    
    // Clear the original array and add the non-isolated components back
    components.length = 0;
    components.push(...nonIsolatedComponents);
  }

  getDescendantsUpToLevel(
    parent: ComponentNode,
    maxLevel: number,
  ): ComponentNode[] {
    // If level is 0, return only the parent node
    if (maxLevel === 0) {
      return [parent];
    }

    // Start with the parent node
    const descendants: ComponentNode[] = [parent];
    
    // Queue for BFS traversal, with [node, level] pairs
    const queue: [ComponentNode, number][] = [[parent, 0]];
    
    while (queue.length > 0) {
      const [currentNode, currentLevel] = queue.shift()!;
      
      // If we're at the max level, don't process children
      if (currentLevel >= maxLevel) {
        continue;
      }
      
      // Add children to descendants and queue
      const children = currentNode.getChildren();
      for (const child of children) {
        descendants.push(child);
        queue.push([child, currentLevel + 1]);
      }
    }
    
    return descendants;
  }


}

export const componentHelper: ComponentHelper = new ComponentHelperImpl();
