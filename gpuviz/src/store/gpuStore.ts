import { create } from "zustand";
import { ComponentTree } from "../models/componentTree";
import { ComponentGraphExtractor } from "../models/componentGraphBuilder";
import {CytoscapeGraphBuilder} from "../models/cytoscapeGraphBuilder"
import type {CytoscapeGraph } from "../types";

// Define the store state interface
interface GpuStoreState {
  // Data state
  componentTree: ComponentTree | null;
  cytoscapeGraphBuilder: CytoscapeGraphBuilder | null;
  currentGraph: CytoscapeGraph | null;
  activeLevel: number;

  // UI state
  loading: boolean;
  error: string | null;
  selectedNode: string | null;
  selectedNodeInfo: any | null;

  // Filter and view settings
  filters: {
    componentTypes: string[];
    showConnections: boolean;
  };

  // Actions
  loadTopology: (data: any) => void;
  setActiveLevel: (level: number) => void;
  selectNode: (nodeId: string | null) => void;
  setFilter: (filterType: string, value: any) => void;
  toggleConnectionVisibility: () => void;
  selectComponent: (componentId: string) => void;
  modifyGraph: (type: "all" | "tidy") => void;
}

// Create the store
const useGpuStore = create<GpuStoreState>((set, get) => ({
  // Initial state
  componentTree: null,
  cytoscapeGraphBuilder: null,
  currentGraph: null,
  activeLevel: 1,

  loading: false,
  error: null,
  selectedNode: null,
  selectedNodeInfo: null,

  filters: {
    componentTypes: [],
    showConnections: false,
  },

  // Actions
  loadTopology: (componentTree) => {
    set({ loading: true, error: null });

    try {
      // Create a default NodeInfo object
      // const defaultInfo: NodeInfo = {};

      // // Initialize the component node builder
      // const builder = new ComponentNodeBuilder(defaultInfo);


      // const rootComponents = builder.buildFromJson(data);
      // const componentTree = new ComponentTree(rootComponents);

      const componentGraphExtractor = new ComponentGraphExtractor(componentTree);

      const cytoscapeGraphBuilder = new CytoscapeGraphBuilder(componentGraphExtractor);
    
      // 3. Create initial graph at default level
      const currentGraph = cytoscapeGraphBuilder.createGraphAtLevel(get().activeLevel);

      // Update store with processed data
      set({
        componentTree: componentTree,
        cytoscapeGraphBuilder,
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
    const { cytoscapeGraphBuilder } = get();
    
    if (!cytoscapeGraphBuilder) {
      console.warn("Cannot set active level: cytoscapeGraph is null");
      return;
    }

    const currentGraph = cytoscapeGraphBuilder.createGraphAtLevel(level);
    
    set({ 
      activeLevel: level,
      currentGraph 
    });
  },

  selectNode: (nodeId) => {
    const { currentGraph } = get();
    set({ selectedNode: nodeId });
    
    // Find and set node info when a node is selected
    if (nodeId && currentGraph) {
      const selectedNodeData = currentGraph.nodes.find(node => node.data.id === nodeId);
      set({ selectedNodeInfo: selectedNodeData || null });
    } else {
      set({ selectedNodeInfo: null });
    }
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
    const { cytoscapeGraphBuilder, modifyGraph } = get();
    
    if (!cytoscapeGraphBuilder) {
      console.warn("Cannot select component: cytoscapeGraph is null");
      return;
    }
    
    // Use the doubleClickComponent method to get the new graph
    const newGraph = cytoscapeGraphBuilder.selectComponent(componentId);
    set({ currentGraph: newGraph });
    
    if (typeof modifyGraph === "function") {
      modifyGraph("tidy");
    }

    console.log("Current graph after selectComponent:", get().currentGraph);
  },

  modifyGraph: (type: "all" | "tidy") => {
    const { cytoscapeGraphBuilder } = get();
    
    if (!cytoscapeGraphBuilder) {
      console.warn("Cannot modify graph: cytoscapeGraphBuilder is null");
      return;
    }
    
    let newGraph: CytoscapeGraph;
    
    if (type === "all") {
      newGraph = cytoscapeGraphBuilder.completeGraph();
    } else if (type === "tidy") {
      newGraph = cytoscapeGraphBuilder.tidyGraph();
    } else {
      console.warn(`Unknown graph type: ${type}`);
      return;
    }
    
    set({ currentGraph: newGraph });
  }, 
}));

export default useGpuStore;
