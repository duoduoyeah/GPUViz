import type {
  Edge
} from "../../types";


export class EdgeTypeMap {
  private edgeTypeMap: Record<string, Edge[]> = {};


  private generateDirectionalKey(sourceName: string, targetName: string): string {
    return `${sourceName}->${targetName}`;
  }

  /**
   * Add an edge to the map with multiple keys:
   * 1. source node name
   * 2. target node name  
   * 3. "source->target" directional key
   */
  addEdge(edge: Edge): void {
    const sourceName = edge.getSourceName();
    const targetName = edge.getTargetName();
    const directionalKey = this.generateDirectionalKey(sourceName, targetName);

    // Add to source node key
    if (!this.edgeTypeMap[sourceName]) {
      this.edgeTypeMap[sourceName] = [];
    }
    this.edgeTypeMap[sourceName].push(edge);

    // Add to target node key (only if different from source to avoid duplicates)
    if (sourceName !== targetName) {
      if (!this.edgeTypeMap[targetName]) {
        this.edgeTypeMap[targetName] = [];
      }
      this.edgeTypeMap[targetName].push(edge);
    }

    // Add to directional key
    if (!this.edgeTypeMap[directionalKey]) {
      this.edgeTypeMap[directionalKey] = [];
    }
    this.edgeTypeMap[directionalKey].push(edge);
  }


  getEdges(key: string): Edge[] {
    return this.edgeTypeMap[key] || [];
  }


  removeEdge(edge: Edge): void {
    const sourceName = edge.getSourceName();
    const targetName = edge.getTargetName();
    const directionalKey = this.generateDirectionalKey(sourceName, targetName);

    // Remove from source node key
    this.removeEdgeFromKey(sourceName, edge);

    // Remove from target node key (only if different from source)
    if (sourceName !== targetName) {
      this.removeEdgeFromKey(targetName, edge);
    }

    // Remove from directional key
    this.removeEdgeFromKey(directionalKey, edge);
  }

  private removeEdgeFromKey(key: string, edge: Edge): void {
    if (this.edgeTypeMap[key]) {
      this.edgeTypeMap[key] = this.edgeTypeMap[key].filter(e => e.getId() !== edge.getId());
      
      // Clean up empty arrays
      if (this.edgeTypeMap[key].length === 0) {
        delete this.edgeTypeMap[key];
      }
    }
  }

  /**
   * Clear all edges from the map
   */
  clear(): void {
    this.edgeTypeMap = {};
  }

  /**
   * Get all keys in the map
   */
  getKeys(): string[] {
    return Object.keys(this.edgeTypeMap);
  }

  /**
   * Check if a key exists in the map
   */
  hasKey(key: string): boolean {
    return key in this.edgeTypeMap;
  }

  /**
   * Get all directional keys in the map (keys in the format "source->target")
   */
  getDirectionalKeys(): string[] {
    return this.getKeys().filter(key => key.includes('->'));
  }

  /**
   * Get all directional keys with a specific source node
   * @param sourceName The name of the source node
   * @returns Array of directional keys in the format "sourceName->target"
   */
  getDirectionalKeysWithSource(sourceName: string): string[] {
    return this.getDirectionalKeys().filter(key => {
      const parts = key.split('->');
      return parts[0] === sourceName;
    });
  }

  /**
   * Get all directional keys with a specific target node
   * @param targetName The name of the target node
   * @returns Array of directional keys in the format "source->targetName"
   */
  getDirectionalKeysWithTarget(targetName: string): string[] {
    return this.getDirectionalKeys().filter(key => {
      const parts = key.split('->');
      return parts.length > 1 && parts[1] === targetName;
    });
  }
}

// Example usage with actual demonstrations:
// view the file in temp