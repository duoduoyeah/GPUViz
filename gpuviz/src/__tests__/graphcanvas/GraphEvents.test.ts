import { GraphEvents } from "../../components/GPUViz/GraphCanvas/GraphEvents";
import cytoscape from "cytoscape";

// Mock element collection
const mockElementCollection = {
  select: jest.fn(),
  unselect: jest.fn(),
  length: 1,
  id: () => "mockId",
  data: () => ({}),
  isNode: () => true,
  isEdge: () => false,
  source: () => ({ id: () => "sourceId" }),
  target: () => ({ id: () => "targetId" }),
  position: () => ({ x: 0, y: 0 }),
  map: jest.fn(() => []),
};

// Mock Cytoscape for testing
const mockCytoscapeInstance = {
  on: jest.fn(),
  off: jest.fn(),
  emit: jest.fn(),
  removeAllListeners: jest.fn(),
  getElementById: jest.fn().mockReturnValue(mockElementCollection),
  elements: jest.fn().mockReturnValue(mockElementCollection),
  zoom: () => 1,
  pan: () => ({ x: 0, y: 0 }),
};

describe("GraphEvents", () => {
  let graphEvents: GraphEvents;
  let cy: cytoscape.Core;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Create a fresh mock instance for each test to avoid shared state
    cy = { ...mockCytoscapeInstance } as unknown as cytoscape.Core;
    graphEvents = new GraphEvents(cy);
  });

  // Test initialization and cleanup
  describe("Initialization and Cleanup", () => {
    it("should be created with a cytoscape instance", () => {
      expect(graphEvents).toBeDefined();
    });

    it("should set a new cytoscape instance", () => {
      const newCy = {
        ...mockCytoscapeInstance,
        on: jest.fn(),
      } as unknown as cytoscape.Core;
      graphEvents.setCytoscapeInstance(newCy);
      expect(newCy.on).toHaveBeenCalled();
    });

    it("should unbind events on destroy", () => {
      graphEvents.destroy();
      expect(cy.removeAllListeners).toHaveBeenCalled();
    });
  });

  // Test custom event handling
  describe("Custom Event Handling", () => {
    it("should register and call a custom event handler", () => {
      const handler = jest.fn();
      graphEvents.on("testEvent", handler);
      graphEvents.emit("testEvent", { data: "test" });
      expect(handler).toHaveBeenCalledWith({ data: "test" });
    });

    it("should unregister a custom event handler", () => {
      const handler = jest.fn();
      graphEvents.on("testEvent", handler);
      graphEvents.off("testEvent");
      graphEvents.emit("testEvent", { data: "test" });
      expect(handler).not.toHaveBeenCalled();
    });

    it("should not emit events when disabled", () => {
      const handler = jest.fn();
      graphEvents.on("testEvent", handler);
      graphEvents.setEnabled(false);
      graphEvents.emit("testEvent", { data: "test" });
      expect(handler).not.toHaveBeenCalled();
    });
  });

  // Test Cytoscape event bridging
  describe("Cytoscape Event Bridging", () => {
    beforeEach(() => {
      graphEvents.setCytoscapeInstance(cy);
    });
    it("should bind to cytoscape events on initialization", () => {
      graphEvents.setCytoscapeInstance(cy);
      expect(cy.on).toHaveBeenCalledWith("tap", "node", expect.any(Function));
      expect(cy.on).toHaveBeenCalledWith(
        "mouseover",
        "node",
        expect.any(Function),
      );
      expect(cy.on).toHaveBeenCalledWith("tap", "edge", expect.any(Function));
      expect(cy.on).toHaveBeenCalledWith("zoom", expect.any(Function));
      expect(cy.on).toHaveBeenCalledWith("pan", expect.any(Function));
    });

    it("should emit `nodeClick` on node tap", () => {
      const emitSpy = jest.spyOn(graphEvents, "emit");
      // Manually find and call the 'tap' on 'node' callback
      const nodeTapCallback = (cy.on as jest.Mock).mock.calls.find(
        (call) => call[0] === "tap" && call[1] === "node",
      )[2];
      const mockEvent = { target: mockElementCollection };
      nodeTapCallback(mockEvent);
      expect(emitSpy).toHaveBeenCalledWith("nodeClick", expect.any(Object));
    });
  });

  // Test selection management
  describe("Selection Management", () => {
    it("should get selected elements", () => {
      graphEvents.getSelectedElements();
      expect(cy.elements).toHaveBeenCalledWith(":selected");
    });

    it("should select an element by ID", () => {
      graphEvents.selectElement("node1");
      expect(cy.getElementById).toHaveBeenCalledWith("node1");
      expect(mockElementCollection.select).toHaveBeenCalled();
    });

    it("should unselect all elements", () => {
      graphEvents.unselectAll();
      expect(cy.elements).toHaveBeenCalled();
      expect(mockElementCollection.unselect).toHaveBeenCalled();
    });
  });
});
