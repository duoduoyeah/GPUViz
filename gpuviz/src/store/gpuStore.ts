import { create } from "zustand";
import { ComponentTree } from "../models/componentTree";
import { ComponentGraph } from "../models/componentGraph";
import { ComponentNodeBuilder } from "../models/componentNodeBuilder";
import type { NodeInfo, Graph } from "../types";

// Define the store state interface
interface GpuStoreState<T extends NodeInfo> {
  // Data state
  rawData: any | null;
  componentTree: ComponentTree<T> | null;
  componentGraph: ComponentGraph<T> | null;
  currentGraph: Graph | null;
  activeLevel: number;

  // UI state
  loading: boolean;
  error: string | null;
  selectedNode: string | null;

  // Filter and view settings
  filters: {
    componentTypes: string[];
    showConnections: boolean;
  };

  // Actions
  loadData: (data: any) => void;
  setActiveLevel: (level: number) => void;
  selectNode: (nodeId: string | null) => void;
  setFilter: (filterType: string, value: any) => void;
  toggleConnectionVisibility: () => void;
}

// Create the store
const useGpuStore = create<GpuStoreState<NodeInfo>>((set, get) => ({
  // Initial state
  rawData: null,
  componentTree: null,
  componentGraph: null,
  currentGraph: null,
  activeLevel: 1,

  loading: false,
  error: null,
  selectedNode: null,

  filters: {
    componentTypes: [],
    showConnections: false,
  },

  // Actions
  loadData: (data) => {
    set({ loading: true, error: null });

    try {
      // Create a default NodeInfo object
      const defaultInfo: NodeInfo = {};

      // Initialize the component node builder
      const builder = new ComponentNodeBuilder<NodeInfo>(defaultInfo);

      // 1. Convert raw data to component tree
      const rootComponents = builder.buildFromJson(data);
      const componentTree = new ComponentTree<NodeInfo>(rootComponents);

      // 2. Create component graph from tree
      const componentGraph = new ComponentGraph<NodeInfo>(componentTree);

      // 3. Create initial graph at default level
      const currentGraph = componentGraph.createGraphAtLevel(get().activeLevel);

      // Update store with processed data
      set({
        rawData: data,
        componentTree,
        componentGraph,
        currentGraph,
        loading: false,
      });
    } catch (error) {
      set({
        loading: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    }
  },

  setActiveLevel: (level) => {
    const { componentTree, componentGraph } = get();
    if (!componentTree || !componentGraph) {
      console.warn(
        "Cannot set active level: componentTree or componentGraph is null",
      );
      return;
    }

    const treeDepth = componentTree.getDepth();
    if (level > treeDepth || level < 0) {
      console.warn(
        `Invalid level ${level}: must be between 0 and ${treeDepth}`,
      );
      set({
        error: `Level must be between 0 and ${treeDepth}. Received: ${level}`,
      });
      return;
    }

    set({ activeLevel: level, error: null });

    const currentGraph = componentGraph.createGraphAtLevel(level);

    console.log(
      `🔄 currentGraph updated in setActiveLevel (level ${level}):`,
      currentGraph,
    );
    console.log("Graph nodes count:", currentGraph?.nodes?.length);
    console.log("Graph edges count:", currentGraph?.edges?.length);

    set({ currentGraph });
  },

  selectNode: (nodeId) => {
    set({ selectedNode: nodeId });
  },

  setFilter: (filterType, value) => {
    set((state) => ({
      filters: {
        ...state.filters,
        [filterType]: value,
      },
    }));

    // Apply filters to update visualization
    // TODO: Implement filtering logic
  },

  toggleConnectionVisibility: () => {
    set((state) => ({
      filters: {
        ...state.filters,
        showConnections: !state.filters.showConnections,
      },
    }));

    // TODO: Update graph based on connection visibility
  },
}));

export default useGpuStore;
