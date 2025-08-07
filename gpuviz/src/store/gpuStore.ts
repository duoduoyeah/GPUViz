import { create } from "zustand";
import { ComponentTree } from "../models/componentTree";
import { ComponentGraphExtractor } from "../models/componentGraph";
import {CytoscapeGraph} from "../models/cytoscapeGraph"
import { ComponentNodeBuilder } from "../models/componentNodeBuilder";
import type { NodeInfo, Graph } from "../types";

// Define the store state interface
interface GpuStoreState {
  // Data state
  rawData: any | null;
  cytoscapeGraph: CytoscapeGraph | null;
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
  selectComponent: (componentId: string) => void;
}

// Create the store
const useGpuStore = create<GpuStoreState>((set, get) => ({
  // Initial state
  rawData: null,
  cytoscapeGraph: null,
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
      const builder = new ComponentNodeBuilder(defaultInfo);


      const rootComponents = builder.buildFromJson(data);
      const componentTree = new ComponentTree(rootComponents);

      const componentGraphExtractor = new ComponentGraphExtractor(componentTree);

      const cytoscapeGraph = new CytoscapeGraph(componentGraphExtractor);
    
      // 3. Create initial graph at default level
      const currentGraph = cytoscapeGraph.createGraphAtLevel(get().activeLevel);

      // Update store with processed data
      set({
        rawData: data,
        cytoscapeGraph,
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
    const { cytoscapeGraph } = get();
    
    if (!cytoscapeGraph) {
      console.warn("Cannot set active level: cytoscapeGraph is null");
      return;
    }

    const currentGraph = cytoscapeGraph.createGraphAtLevel(level);
    
    set({ 
      activeLevel: level,
      currentGraph 
    });
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

  // Handle component selection for graph updates (e.g., on double-click)
  selectComponent: (componentId: string) => {
    const { cytoscapeGraph } = get();
    
    if (!cytoscapeGraph) {
      console.warn("Cannot select component: cytoscapeGraph is null");
      return;
    }
    
    // Use the doubleClickComponent method to get the new graph
    const newGraph = cytoscapeGraph.selectComponent(componentId);
    
    set({ currentGraph: newGraph });
  },

}));

export default useGpuStore;
