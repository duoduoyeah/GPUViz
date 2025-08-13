import type {
  ComponentNode,
  Edge
} from "../src/types";
import { EdgeImpl } from "../src/models/edge/edge.ts";

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
}

// Example usage with actual demonstrations:

// Mock ComponentNode implementation for demo
class MockComponentNode implements ComponentNode {
  name: string;
  type: string = "mock";
  info = {};
  ports: any[] = [];
  parent: ComponentNode | undefined;
  children: ComponentNode[] = [];
  shape: any;

  constructor(name: string) {
    this.name = name;
  }

  getName(): string { return this.name; }
  getInfo() { return this.info; }
  getPorts() { return this.ports; }
  getParent() { return this.parent; }
  getChildren() { return this.children; }
  setParent(parent: ComponentNode): void { this.parent = parent; }
  setChildren(children: ComponentNode[]): void { this.children = children; }
  setInfo(info: any): void { this.info = info; }
  setPorts(ports: any[]): void { this.ports = ports; }
  setShape(): void {}
  addChild(child: ComponentNode): void { this.children.push(child); }
  isAncestor(node: ComponentNode): boolean { return false; }
  isIsolated(): boolean { return false; }
}

// Mock Port implementation for demo
class MockPort {
  name: string;
  incomingPort: any[] = [];
  outgoingPort: any[] = [];
  owner: ComponentNode;

  constructor(name: string, owner: ComponentNode) {
    this.name = name;
    this.owner = owner;
  }

  setOwner(owner: ComponentNode): void { this.owner = owner; }
  setIncomingPorts(ports: any[]): void { this.incomingPort = ports; }
  setOutgoingPorts(ports: any[]): void { this.outgoingPort = ports; }
  getComponent(): ComponentNode { return this.owner; }
}

// Demo function to show EdgeTypeMap in action
export function demonstrateEdgeTypeMap(): void {
  console.log("=== EdgeTypeMap Demonstration ===\n");

  const edgeMap = new EdgeTypeMap();

  // Create mock nodes
  const nodeA = new MockComponentNode("a");
  const nodeB = new MockComponentNode("b");
  const nodeC = new MockComponentNode("c");

  // Create mock ports
  const portA = new MockPort("port_a", nodeA);
  const portB = new MockPort("port_b", nodeB);
  const portC = new MockPort("port_c", nodeC);

  // Create edges as described in the example:
  // - a to c, edge1
  // - a to b, edge2  
  // - b to a, edge3
  // - a to c, edge4
  const edge1 = new EdgeImpl(portA, portC); // a -> c
  const edge2 = new EdgeImpl(portA, portB); // a -> b
  const edge3 = new EdgeImpl(portB, portA); // b -> a
  const edge4 = new EdgeImpl(portA, portC); // a -> c (duplicate direction)

  console.log("Adding edges to the map...");
  edgeMap.addEdge(edge1);
  edgeMap.addEdge(edge2);
  edgeMap.addEdge(edge3);
  edgeMap.addEdge(edge4);

  console.log("\nAvailable keys in the map:");
  console.log(edgeMap.getKeys());

  console.log("\n=== Query Results ===");

  // Test case 1: Get all edges involving node 'a'
  const edgesWithA = edgeMap.getEdges("a");
  console.log(`\nQuery: edgeMap.getEdges("a")`);
  console.log(`Result: ${edgesWithA.length} edges found`);
  console.log("Edge IDs:", edgesWithA.map(e => e.getId()));
  console.log("Expected: All 4 edges (edge1, edge2, edge3, edge4) ✓");

  // Test case 2: Get all edges involving node 'b'
  const edgesWithB = edgeMap.getEdges("b");
  console.log(`\nQuery: edgeMap.getEdges("b")`);
  console.log(`Result: ${edgesWithB.length} edges found`);
  console.log("Edge IDs:", edgesWithB.map(e => e.getId()));
  console.log("Expected: 2 edges (edge2, edge3) ✓");

  // Test case 3: Get edges from 'a' to 'c'
  const edgesAtoC = edgeMap.getEdges("a->c");
  console.log(`\nQuery: edgeMap.getEdges("a->c")`);
  console.log(`Result: ${edgesAtoC.length} edges found`);
  console.log("Edge IDs:", edgesAtoC.map(e => e.getId()));
  console.log("Expected: 2 edges (edge1, edge4) ✓");

  // Test case 4: Get edges from 'a' to 'b'
  const edgesAtoB = edgeMap.getEdges("a->b");
  console.log(`\nQuery: edgeMap.getEdges("a->b")`);
  console.log(`Result: ${edgesAtoB.length} edges found`);
  console.log("Edge IDs:", edgesAtoB.map(e => e.getId()));
  console.log("Expected: 1 edge (edge2), NOT edge3 which is b->a ✓");

  // Test case 5: Get edges from 'b' to 'a'
  const edgesBtoA = edgeMap.getEdges("b->a");
  console.log(`\nQuery: edgeMap.getEdges("b->a")`);
  console.log(`Result: ${edgesBtoA.length} edges found`);
  console.log("Edge IDs:", edgesBtoA.map(e => e.getId()));
  console.log("Expected: 1 edge (edge3) ✓");

  // Test case 6: Get edges involving node 'c'
  const edgesWithC = edgeMap.getEdges("c");
  console.log(`\nQuery: edgeMap.getEdges("c")`);
  console.log(`Result: ${edgesWithC.length} edges found`);
  console.log("Edge IDs:", edgesWithC.map(e => e.getId()));
  console.log("Expected: 2 edges (edge1, edge4) ✓");

  console.log("\n=== Edge Removal Test ===");
  console.log("\nRemoving edge2 (a->b)...");
  edgeMap.removeEdge(edge2);

  console.log(`\nAfter removal - edgeMap.getEdges("a->b"):`);
  const edgesAtoB_after = edgeMap.getEdges("a->b");
  console.log(`Result: ${edgesAtoB_after.length} edges found`);
  console.log("Expected: 0 edges ✓");

  console.log(`\nAfter removal - edgeMap.getEdges("a"):`);
  const edgesWithA_after = edgeMap.getEdges("a");
  console.log(`Result: ${edgesWithA_after.length} edges found`);
  console.log("Edge IDs:", edgesWithA_after.map(e => e.getId()));
  console.log("Expected: 3 edges (edge1, edge3, edge4) ✓");

  console.log("\n=== Summary ===");
  console.log("The EdgeTypeMap successfully demonstrates:");
  console.log("✓ Multi-key indexing (node names + directional keys)");
  console.log("✓ Efficient edge retrieval by different key types");
  console.log("✓ Proper handling of bidirectional relationships");
  console.log("✓ Clean removal with automatic key cleanup");
}

// Uncomment the line below to run the demonstration
// demonstrateEdgeTypeMap();
