import { ComponentGraph } from "../../models/componentGraph";
import { ComponentTree } from "../../models/componentTree";
import { ComponentNodeBuilder } from "../../models/componentNodeBuilder";
import type { JsonData, NodeInfo, Graph } from "../../types";
import { testJsonPath } from "../../config/test";
import * as fs from "fs";
import * as path from "path";

// Load test data
const jsonData: JsonData = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, testJsonPath), "utf8"),
);

// Define a simple NodeInfo implementation for testing
interface TestNodeInfo extends NodeInfo {
  testProperty?: string;
}

describe("ComponentGraph", () => {
  let builder: ComponentNodeBuilder<TestNodeInfo>;
  let mockDefaultInfo: TestNodeInfo;
  let tree: ComponentTree<TestNodeInfo>;
  let graph: ComponentGraph<TestNodeInfo>;

  beforeEach(() => {
    mockDefaultInfo = { testProperty: "default" };
    builder = new ComponentNodeBuilder<TestNodeInfo>(mockDefaultInfo);
    const rootNodes = builder.buildFromJson(jsonData as JsonData);
    tree = new ComponentTree<TestNodeInfo>(rootNodes);
    graph = new ComponentGraph<TestNodeInfo>(tree);
  });

  describe("ComponentGraph creation", () => {
    test("should create ComponentGraph successfully", () => {
      expect(() => {
        const testGraph = new ComponentGraph<TestNodeInfo>(tree);
        expect(testGraph).toBeDefined();
      }).not.toThrow();
    });

    test("should initialize with correct tree depth", () => {
      expect(graph).toBeDefined();

      // Graph should have access to tree depth
      const componentsAtRoot = graph.getComponentsAtLevel(0);
      expect(Array.isArray(componentsAtRoot)).toBe(true);

      // Should be able to get components at different levels
      for (let level = 0; level < tree.depth; level++) {
        const componentsAtLevel = graph.getComponentsAtLevel(level);
        expect(Array.isArray(componentsAtLevel)).toBe(true);
      }
    });
  });

  describe("getComponentsAtLevel", () => {
    test("should return components at specified level", () => {
      const level0Components = graph.getComponentsAtLevel(0);
      const level1Components = graph.getComponentsAtLevel(1);

      expect(Array.isArray(level0Components)).toBe(true);
      expect(Array.isArray(level1Components)).toBe(true);

      // Level 0 should contain the tree root
      expect(level0Components.length).toBe(1);
      expect(level0Components[0].getName()).toBe("tree_root");

      // Level 1 should contain the root nodes from JSON
      expect(level1Components.length).toBeGreaterThan(0);
    });

    test("should return empty array for invalid levels", () => {
      const invalidLevelComponents = graph.getComponentsAtLevel(999);
      expect(Array.isArray(invalidLevelComponents)).toBe(true);
      expect(invalidLevelComponents.length).toBe(0);
    });

    test("should return consistent results with tree.getNodesAtLevel", () => {
      for (let level = 0; level < tree.depth; level++) {
        const graphComponents = graph.getComponentsAtLevel(level);
        const treeNodes = tree.getNodesAtLevel(level);

        expect(graphComponents).toEqual(treeNodes);
      }
    });
  });

  describe("buildGraphNodes", () => {
    test("should convert components to graph nodes", () => {
      const components = graph.getComponentsAtLevel(1);
      const graphNodes = graph.buildGraphNodes(components);

      expect(Array.isArray(graphNodes)).toBe(true);
      expect(graphNodes.length).toBe(components.length);

      graphNodes.forEach((node, index) => {
        const component = components[index];

        expect(node).toHaveProperty("data");
        expect(node.data).toHaveProperty("id");
        expect(node.data).toHaveProperty("label");
        expect(node.data).toHaveProperty("shape");
        expect(node.data).toHaveProperty("type");

        expect(node.data.id).toBe(component.getName());
        expect(node.data.label).toBe(component.getName());
        expect(node.data.shape).toBe(component.shape);
        expect(node.data.type).toBe(component.type);
      });
    });

    test("should handle empty component array", () => {
      const graphNodes = graph.buildGraphNodes([]);
      expect(Array.isArray(graphNodes)).toBe(true);
      expect(graphNodes.length).toBe(0);
    });

    test("should create valid GraphNode structure", () => {
      const components = graph.getComponentsAtLevel(1);
      if (components.length > 0) {
        const graphNodes = graph.buildGraphNodes(components);
        const firstNode = graphNodes[0];

        // Verify structure matches GraphNode interface
        expect(typeof firstNode.data.id).toBe("string");
        expect(typeof firstNode.data.label).toBe("string");
        expect(typeof firstNode.data.type).toBe("string");
        expect(firstNode.data.shape).toBeDefined();
      }
    });
  });

  describe("buildGraphEdges", () => {
    test("should return empty array (Stage 1 implementation)", () => {
      const components = graph.getComponentsAtLevel(1);
      const edges = graph.buildGraphEdges(components);

      expect(Array.isArray(edges)).toBe(true);
      expect(edges.length).toBe(0);
    });

    test("should handle empty component array", () => {
      const edges = graph.buildGraphEdges([]);
      expect(Array.isArray(edges)).toBe(true);
      expect(edges.length).toBe(0);
    });
  });

  describe("createGraphAtLevel", () => {
    test("should create complete graph structure", () => {
      const level = 1;
      const graphData = graph.createGraphAtLevel(level);

      expect(graphData).toBeDefined();
      expect(graphData).toHaveProperty("nodes");
      expect(graphData).toHaveProperty("edges");
      expect(Array.isArray(graphData.nodes)).toBe(true);
      expect(Array.isArray(graphData.edges)).toBe(true);
    });

    test("should have nodes corresponding to components at level", () => {
      const level = 1;
      const components = graph.getComponentsAtLevel(level);
      const graphData = graph.createGraphAtLevel(level);

      expect(graphData.nodes.length).toBe(components.length);

      graphData.nodes.forEach((node, index) => {
        const component = components[index];
        expect(node.data.id).toBe(component.getName());
        expect(node.data.label).toBe(component.getName());
      });
    });

    test("should have empty edges array (Stage 1)", () => {
      const level = 1;
      const graphData = graph.createGraphAtLevel(level);

      expect(graphData.edges).toEqual([]);
    });

    test("should work for different levels", () => {
      for (let level = 0; level < tree.depth; level++) {
        const graphData = graph.createGraphAtLevel(level);
        const components = graph.getComponentsAtLevel(level);

        expect(graphData.nodes.length).toBe(components.length);
        expect(graphData.edges.length).toBe(0);
      }
    });

    test("should create valid Graph interface", () => {
      const level = 1;
      const graphData: Graph = graph.createGraphAtLevel(level);

      // Verify it matches Graph interface
      expect(graphData).toBeDefined();
      expect("nodes" in graphData).toBe(true);
      expect("edges" in graphData).toBe(true);

      // Verify nodes structure
      graphData.nodes.forEach((node) => {
        expect(node).toHaveProperty("data");
        expect(node.data).toHaveProperty("id");
        expect(node.data).toHaveProperty("label");
        expect(node.data).toHaveProperty("shape");
        expect(node.data).toHaveProperty("type");
      });
    });

    test("should handle level with no components", () => {
      const invalidLevel = 999;
      const graphData = graph.createGraphAtLevel(invalidLevel);

      expect(graphData.nodes).toEqual([]);
      expect(graphData.edges).toEqual([]);
    });
  });

  describe("integration with ComponentTree", () => {
    test("should maintain consistency with tree structure", () => {
      // Test that graph correctly represents tree at each level
      for (let level = 0; level < tree.depth; level++) {
        const treeNodes = tree.getNodesAtLevel(level);
        const graphComponents = graph.getComponentsAtLevel(level);
        const graphData = graph.createGraphAtLevel(level);

        expect(graphComponents).toEqual(treeNodes);
        expect(graphData.nodes.length).toBe(treeNodes.length);
      }
    });

    test("should reflect tree changes", () => {
      // Create a new tree and graph
      const newRootNodes = builder.buildFromJson(jsonData as JsonData);
      const newTree = new ComponentTree<TestNodeInfo>(newRootNodes);
      const newGraph = new ComponentGraph<TestNodeInfo>(newTree);

      // Both graphs should have same structure for same data
      for (
        let level = 0;
        level < Math.min(tree.depth, newTree.depth);
        level++
      ) {
        const originalGraphData = graph.createGraphAtLevel(level);
        const newGraphData = newGraph.createGraphAtLevel(level);

        expect(originalGraphData.nodes.length).toBe(newGraphData.nodes.length);
        expect(originalGraphData.edges.length).toBe(newGraphData.edges.length);
      }
    });
  });

  describe("error handling", () => {
    test("should handle negative level gracefully", () => {
      expect(() => {
        const components = graph.getComponentsAtLevel(-1);
        expect(Array.isArray(components)).toBe(true);
        expect(components.length).toBe(0);
      }).not.toThrow();
    });

    test("should handle very large level numbers", () => {
      expect(() => {
        const components = graph.getComponentsAtLevel(Number.MAX_SAFE_INTEGER);
        expect(Array.isArray(components)).toBe(true);
        expect(components.length).toBe(0);
      }).not.toThrow();
    });

    test("should handle components with missing properties gracefully", () => {
      const components = graph.getComponentsAtLevel(1);
      if (components.length > 0) {
        expect(() => {
          const graphNodes = graph.buildGraphNodes(components);
          expect(Array.isArray(graphNodes)).toBe(true);
        }).not.toThrow();
      }
    });
  });
});
