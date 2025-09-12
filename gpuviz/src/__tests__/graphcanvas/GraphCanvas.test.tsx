import { render, screen, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import GraphCanvas from "../../components/GPUViz/GraphCanvas/GraphCanvas";
import useGpuStore from "../../store/topoStore";
import { GraphCore } from "../../components/GPUViz/GraphCanvas/GraphCore";
import { GraphEvents } from "../../components/GPUViz/GraphCanvas/GraphEvents";
import type { ComponentKind } from "../../types";

// Mock GraphCore and GraphEvents
jest.mock("../../components/GraphCanvas/GraphCore");
jest.mock("../../components/GraphCanvas/GraphEvents");

const mockGraphCore = GraphCore as jest.MockedClass<typeof GraphCore>;
const mockGraphEvents = GraphEvents as jest.MockedClass<typeof GraphEvents>;

// Mock the store
const originalState = useGpuStore.getState();
beforeEach(() => {
  act(() => {
    useGpuStore.setState(originalState, true);
  });
  // Reset mocks before each test
  mockGraphCore.mockClear();
  mockGraphEvents.mockClear();
});

const mockNode = (id: string) => ({
  data: {
    id,
    label: `Node ${id}`,
    shape: "square" as ComponentKind,
    type: "component",
  },
});

describe("GraphCanvas Component", () => {
  // Test initial rendering and loading state
  test("should show loading state initially", () => {
    act(() => {
      useGpuStore.setState({
        loading: true,
        error: null,
        currentGraph: null,
      });
    });
    render(<GraphCanvas />);
    expect(screen.getByText("Loading graph...")).toBeInTheDocument();
  });

  // Test error state rendering
  test("should show error message when there is an error", () => {
    act(() => {
      useGpuStore.setState({
        loading: false,
        error: "Test Error",
        currentGraph: null,
      });
    });
    render(<GraphCanvas />);
    expect(screen.getByText("Error: Test Error")).toBeInTheDocument();
  });

  // Test empty state rendering
  test("should show empty message when there is no graph data", () => {
    act(() => {
      useGpuStore.setState({
        loading: false,
        error: null,
        currentGraph: { nodes: [], edges: [] },
      });
    });
    render(<GraphCanvas />);
    expect(screen.getByText("No graph data available")).toBeInTheDocument();
  });

  // Test successful rendering with graph data
  test("should render the graph container when data is available", () => {
    act(() => {
      useGpuStore.setState({
        loading: false,
        error: null,
        currentGraph: { nodes: [mockNode("n1")], edges: [] },
      });
    });
    render(<GraphCanvas />);
    // Check if the container for the graph is rendered
    const container = screen.getByTestId("graph-canvas-container");
    expect(container).toBeInTheDocument();
  });

  // Test React lifecycle integration (initialization)
  describe("Lifecycle and Initialization", () => {
    let mockCytoscapeInstance: any;

    beforeEach(() => {
      mockCytoscapeInstance = {
        on: jest.fn(),
        destroy: jest.fn(),
      };

      // Mock methods of GraphCore
      mockGraphCore.prototype.init = jest.fn();
      mockGraphCore.prototype.destroy = jest.fn();
      mockGraphCore.prototype.getCytoscapeInstance = jest
        .fn()
        .mockReturnValue(mockCytoscapeInstance);
      mockGraphCore.prototype.updateGraph = jest.fn();
      mockGraphCore.prototype.applyLayout = jest.fn();

      // Mock methods of GraphEvents
      mockGraphEvents.prototype.setCytoscapeInstance = jest.fn();
      mockGraphEvents.prototype.on = jest.fn();
      mockGraphEvents.prototype.destroy = jest.fn();
    });

    test("should initialize GraphCore and GraphEvents on mount", () => {
      act(() => {
        useGpuStore.setState({
          loading: false,
          error: null,
          currentGraph: { nodes: [mockNode("n1")], edges: [] },
        });
      });

      render(<GraphCanvas />);

      expect(mockGraphCore.prototype.init).toHaveBeenCalledTimes(1);
      expect(
        mockGraphCore.prototype.getCytoscapeInstance,
      ).toHaveBeenCalledTimes(1);
      expect(
        mockGraphEvents.prototype.setCytoscapeInstance,
      ).toHaveBeenCalledWith(mockCytoscapeInstance);
      expect(mockGraphEvents.prototype.on).toHaveBeenCalledWith(
        "nodeClick",
        expect.any(Function),
      );
      expect(mockGraphEvents.prototype.on).toHaveBeenCalledWith(
        "canvasClick",
        expect.any(Function),
      );
    });

    test("should call destroy on unmount", () => {
      act(() => {
        useGpuStore.setState({
          loading: false,
          error: null,
          currentGraph: { nodes: [mockNode("n1")], edges: [] },
        });
      });

      const { unmount } = render(<GraphCanvas />);
      unmount();

      expect(mockGraphEvents.prototype.destroy).toHaveBeenCalledTimes(1);
      expect(mockGraphCore.prototype.destroy).toHaveBeenCalledTimes(1);
    });

    test("should update graph when currentGraph data changes in the store", () => {
      const initialState = {
        loading: false,
        error: null,
        currentGraph: { nodes: [mockNode("n1")], edges: [] },
      };
      act(() => {
        useGpuStore.setState(initialState);
      });

      const { rerender } = render(<GraphCanvas />);

      expect(mockGraphCore.prototype.updateGraph).toHaveBeenCalledWith(
        initialState.currentGraph,
      );

      const newGraph = { nodes: [mockNode("n2")], edges: [] };
      act(() => {
        useGpuStore.setState({ currentGraph: newGraph });
      });
      rerender(<GraphCanvas />);

      expect(mockGraphCore.prototype.updateGraph).toHaveBeenCalledWith(
        newGraph,
      );
    });
  });

  // Test component coordination and event handling
  describe("Component Coordination and Events", () => {
    let eventHandlers: { [key: string]: (data?: any) => void } = {};

    beforeEach(() => {
      eventHandlers = {};
      const mockCytoscapeInstance = { on: jest.fn(), destroy: jest.fn() };

      mockGraphCore.prototype.init = jest.fn();
      mockGraphCore.prototype.getCytoscapeInstance = jest
        .fn()
        .mockReturnValue(mockCytoscapeInstance);
      mockGraphCore.prototype.applyLayout = jest.fn();

      mockGraphEvents.prototype.setCytoscapeInstance = jest.fn();
      mockGraphEvents.prototype.on = jest.fn((event, handler) => {
        eventHandlers[event] = handler as (data?: any) => void;
      });
      mockGraphEvents.prototype.selectElement = jest.fn();
      mockGraphEvents.prototype.unselectAll = jest.fn();
    });

    test("should handle node click events and update store", () => {
      const selectNodeMock = jest.fn();
      act(() => {
        useGpuStore.setState({
          loading: false,
          error: null,
          currentGraph: { nodes: [mockNode("n1")], edges: [] },
          selectNode: selectNodeMock,
        });
      });

      render(<GraphCanvas />);

      act(() => {
        eventHandlers.nodeClick({ id: "n1" });
      });

      expect(selectNodeMock).toHaveBeenCalledWith("n1");
    });

    test("should handle canvas click events and update store", () => {
      const selectNodeMock = jest.fn();
      act(() => {
        useGpuStore.setState({
          loading: false,
          error: null,
          currentGraph: { nodes: [mockNode("n1")], edges: [] },
          selectNode: selectNodeMock,
        });
      });

      render(<GraphCanvas />);

      act(() => {
        eventHandlers.canvasClick();
      });

      expect(selectNodeMock).toHaveBeenCalledWith(null);
    });
  });
});
