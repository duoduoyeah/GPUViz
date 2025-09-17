import { ComponentTree } from "../../models/component/componentTree";
import { ComponentNodeBuilder } from "../../models/dataLoader/jsonComponentBuilder";
import type { JsonData, NodeInfo } from "../../types";
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

describe("ComponentTree", () => {
  let builder: ComponentNodeBuilder<TestNodeInfo>;
  let mockDefaultInfo: TestNodeInfo;

  beforeEach(() => {
    mockDefaultInfo = { testProperty: "default" };
    builder = new ComponentNodeBuilder<TestNodeInfo>(mockDefaultInfo);
  });

  describe("import JSON data", () => {
    test("should successfully import JSON data", () => {
      expect(jsonData).toBeDefined();
      expect(jsonData.components).toBeDefined();
      expect(Array.isArray(jsonData.components)).toBe(true);
      expect(jsonData.components.length).toBeGreaterThan(0);
    });

    test("should have valid component structure", () => {
      const firstComponent = jsonData.components[0];
      expect(firstComponent).toHaveProperty("name");
      expect(firstComponent).toHaveProperty("ports");
      expect(Array.isArray(firstComponent.ports)).toBe(true);
    });
  });

  describe("ComponentNodeBuilder", () => {
    test("should build component nodes from JSON data", () => {
      expect(() => {
        const rootNodes = builder.buildFromJson(jsonData as JsonData);
        expect(rootNodes).toBeDefined();
        expect(Array.isArray(rootNodes)).toBe(true);
      }).not.toThrow();
    });

    test("should create nodes with correct names", () => {
      const rootNodes = builder.buildFromJson(jsonData as JsonData);

      // Check that we have some root nodes
      expect(rootNodes.length).toBeGreaterThan(0);

      // Check that nodes have names
      rootNodes.forEach((node) => {
        expect(node.getName()).toBeDefined();
        expect(typeof node.getName()).toBe("string");
        expect(node.getName().length).toBeGreaterThan(0);
      });
    });
  });

  describe("ComponentTree creation", () => {
    test("should create ComponentTree successfully", () => {
      const rootNodes = builder.buildFromJson(jsonData as JsonData);

      expect(() => {
        const tree = new ComponentTree<TestNodeInfo>(rootNodes);
        expect(tree).toBeDefined();
      }).not.toThrow();
    });

    test("should have correct tree structure", () => {
      const rootNodes = builder.buildFromJson(jsonData as JsonData);
      const tree = new ComponentTree<TestNodeInfo>(rootNodes);

      // Tree should have a root
      expect(tree.root).toBeDefined();
      expect(tree.root.getName()).toBe("tree_root");

      // Tree should have depth
      expect(tree.depth).toBeDefined();
      expect(typeof tree.depth).toBe("number");
      expect(tree.depth).toBeGreaterThan(0);

      // Tree should have level map
      expect(tree.levelMap).toBeDefined();
      expect(tree.levelMap instanceof Map).toBe(true);
    });

    test("should correctly set up parent-child relationships", () => {
      const rootNodes = builder.buildFromJson(jsonData as JsonData);
      const tree = new ComponentTree<TestNodeInfo>(rootNodes);

      // All root nodes should have the tree root as parent
      rootNodes.forEach((node) => {
        expect(node.getParent()).toBe(tree.root);
      });

      // Tree root should have the root nodes as children
      expect(tree.root.getChildren()).toEqual(rootNodes);
    });

    test("should correctly calculate tree depth", () => {
      const rootNodes = builder.buildFromJson(jsonData as JsonData);
      const tree = new ComponentTree<TestNodeInfo>(rootNodes);

      expect(tree.depth).toBeGreaterThan(0);

      // Verify depth calculation by checking level map
      for (let level = 0; level < tree.depth; level++) {
        const nodesAtLevel = tree.getNodesAtLevel(level);
        expect(Array.isArray(nodesAtLevel)).toBe(true);
      }
    });

    test("should populate level map correctly", () => {
      const rootNodes = builder.buildFromJson(jsonData as JsonData);
      const tree = new ComponentTree<TestNodeInfo>(rootNodes);

      // Level 0 should contain the tree root
      const level0Nodes = tree.getNodesAtLevel(0);
      expect(level0Nodes).toContain(tree.root);

      // Level 1 should contain the root nodes from JSON
      const level1Nodes = tree.getNodesAtLevel(1);
      rootNodes.forEach((node) => {
        expect(level1Nodes).toContain(node);
      });
    });
  });

  describe("ComponentTree search functionality", () => {
    let tree: ComponentTree<TestNodeInfo>;

    beforeEach(() => {
      const rootNodes = builder.buildFromJson(jsonData as JsonData);
      tree = new ComponentTree<TestNodeInfo>(rootNodes);
    });

    test("should find nodes by name", () => {
      // Try to find the tree root
      const foundRoot = tree.findNodeByName("tree_root");
      expect(foundRoot).toBe(tree.root);

      // Try to find a component from the JSON data
      const firstComponentName = jsonData.components[0].name;
      const foundComponent = tree.findNodeByName(firstComponentName);
      expect(foundComponent).toBeDefined();
      expect(foundComponent?.getName()).toBe(firstComponentName);
    });

    test("should return null for non-existent nodes", () => {
      const nonExistentNode = tree.findNodeByName("NonExistentNode");
      expect(nonExistentNode).toBeNull();
    });

    test("should find nodes using custom predicate", () => {
      const foundNode = tree.findNode((node) => node.getName() === "tree_root");
      expect(foundNode).toBe(tree.root);

      // Find any node with ports
      const nodeWithPorts = tree.findNode((node) => node.getPorts().length > 0);
      if (nodeWithPorts) {
        expect(nodeWithPorts.getPorts().length).toBeGreaterThan(0);
      }
    });
  });
});
