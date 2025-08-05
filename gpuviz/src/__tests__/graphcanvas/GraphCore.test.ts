import { GraphCore } from "../../components/GraphCanvas/GraphCore";
import type { Graph } from "../../types";
import { LAYOUT_PRESETS } from "../../components/GraphCanvas/GraphConfig";

// Mock Cytoscape for testing
const mockCytoscapeInstance = {
  destroy: jest.fn(),
  elements: jest.fn().mockReturnThis(),
  remove: jest.fn(),
  add: jest.fn(),
  layout: jest.fn().mockReturnThis(),
  run: jest.fn(),
  fit: jest.fn(),
  center: jest.fn(),
  reset: jest.fn(),
};

jest.mock("cytoscape", () => ({
  __esModule: true,
  default: jest.fn(() => mockCytoscapeInstance),
}));

const cytoscape = require("cytoscape").default;

describe("GraphCore", () => {
  let graphCore: GraphCore;
  let container: HTMLDivElement;

  beforeEach(() => {
    graphCore = new GraphCore();
    container = document.createElement("div");
    jest.clearAllMocks();
  });

  // Test initialization/cleanup
  describe("Initialization and Cleanup", () => {
    it("should initialize successfully", () => {
      graphCore.init(container);
      expect(cytoscape).toHaveBeenCalledWith(
        expect.objectContaining({
          container,
          elements: [],
          style: expect.any(Array),
          layout: expect.any(Object),
          minZoom: expect.any(Number),
          maxZoom: expect.any(Number),
        }),
      );
      expect(graphCore.isReady()).toBe(true);
      expect(graphCore.getState().isInitialized).toBe(true);
    });

    it("should not re-initialize with the same container", () => {
      graphCore.init(container);
      graphCore.init(container);
      expect(cytoscape).toHaveBeenCalledTimes(1);
    });

    it("should destroy the cytoscape instance", () => {
      graphCore.init(container);
      graphCore.destroy();
      expect(mockCytoscapeInstance.destroy).toHaveBeenCalled();
      expect(graphCore.isReady()).toBe(false);
      expect(graphCore.getState().isInitialized).toBe(false);
    });
  });

  // Test data updates
  describe("Data Updates", () => {
    const testGraph: Graph = {
      nodes: [
        {
          data: {
            id: "n1",
            label: "Node 1",
            shape: "square",
            type: "test",
          },
        },
      ],
      edges: [{ data: { id: "e1", source: "n1", target: "n1" } }],
    };

    beforeEach(() => {
      graphCore.init(container);
    });

    it("should not update if not initialized", () => {
      const uninitializedCore = new GraphCore();
      uninitializedCore.updateGraph(testGraph);
      expect(mockCytoscapeInstance.add).not.toHaveBeenCalled();
    });

    it("should update the graph with new data", () => {
      graphCore.updateGraph(testGraph);
      expect(mockCytoscapeInstance.elements).toHaveBeenCalled();
      expect(mockCytoscapeInstance.remove).toHaveBeenCalled();
      expect(mockCytoscapeInstance.add).toHaveBeenCalledWith([
        {
          data: {
            id: "n1",
            label: "Node 1",
            shape: "square",
            type: "test",
          },
        },
        { data: { id: "e1", source: "n1", target: "n1" } },
      ]);
      expect(graphCore.getState().nodeCount).toBe(1);
      expect(graphCore.getState().edgeCount).toBe(1);
    });

    it("should clear the graph when null is passed", () => {
      graphCore.updateGraph(testGraph);
      graphCore.updateGraph(null);
      expect(mockCytoscapeInstance.elements).toHaveBeenCalledTimes(2);
      expect(mockCytoscapeInstance.remove).toHaveBeenCalledTimes(2);
      expect(graphCore.getState().nodeCount).toBe(0);
      expect(graphCore.getState().edgeCount).toBe(0);
    });
  });

  // Test layout application
  describe("Layout Application", () => {
    beforeEach(() => {
      graphCore.init(container);
    });

    it("should apply a specified layout", () => {
      graphCore.applyLayout("circle");
      expect(mockCytoscapeInstance.layout).toHaveBeenCalledWith(
        LAYOUT_PRESETS.circle,
      );
      expect(mockCytoscapeInstance.run).toHaveBeenCalled();
      expect(graphCore.getState().currentLayout).toBe("circle");
    });

    it("should not apply layout if not initialized", () => {
      const uninitializedCore = new GraphCore();
      uninitializedCore.applyLayout("grid");
      expect(mockCytoscapeInstance.layout).not.toHaveBeenCalled();
    });
  });

  // Test state validation
  describe("State Validation", () => {
    it("should return correct initial state", () => {
      expect(graphCore.getState()).toEqual({
        isInitialized: false,
        hasGraph: false,
        nodeCount: 0,
        edgeCount: 0,
        currentLayout: "grid",
      });
      expect(graphCore.isReady()).toBe(false);
    });

    it("should return correct state after initialization", () => {
      graphCore.init(container);
      expect(graphCore.getState()).toEqual({
        isInitialized: true,
        hasGraph: false,
        nodeCount: 0,
        edgeCount: 0,
        currentLayout: "grid",
      });
      expect(graphCore.isReady()).toBe(true);
    });

    it("should return the cytoscape instance", () => {
      graphCore.init(container);
      expect(graphCore.getCytoscapeInstance()).toBe(mockCytoscapeInstance);
    });
  });

  // Test view controls
  describe("View Controls", () => {
    beforeEach(() => {
      graphCore.init(container);
    });

    it("should call fit", () => {
      graphCore.fit();
      expect(mockCytoscapeInstance.fit).toHaveBeenCalled();
    });

    it("should call center", () => {
      graphCore.center();
      expect(mockCytoscapeInstance.center).toHaveBeenCalled();
    });

    it("should call reset", () => {
      graphCore.reset();
      expect(mockCytoscapeInstance.reset).toHaveBeenCalled();
    });
  });
});
