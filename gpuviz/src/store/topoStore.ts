import { create } from "zustand";
import { ComponentGraphExtractor, ComponentViewerImpl } from "../models/component";
import {CytoscapeGraphBuilder} from "../models/cytoscapeGraphBuilder";
import type {CytoscapeGraph} from "../types";
// import type {ChainCache, ComponentCache} from "./storeCache";
import * as Cache from "./typostoreCache";


type ComponentCache = Cache.ComponentCache;
type ChainCache = Cache.ChainCache;

// Define the store state interface
interface TopoStoreState {
  // Data state
  cytoscapeGraphBuilder: CytoscapeGraphBuilder | null;
  currentGraph: CytoscapeGraph | null;
  activeLevel: number;
  componentCache: ComponentCache | null;
  chainCache: ChainCache | null;

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

  //Init methods
  loadTopology: (data: any) => void;

  // grpah Actions
  setActiveLevel: (level: number) => void;
  getNodeInfo: (nodeId: string | null) => void;
  enterComponentView: (componentId: string) => void;
  modifyGraph: (type: "all" | "tidy") => void;

  // chain graph
  // getChainLevels(): string[];
  // getChainIdsByLevel(level: string): Chain[];
  // viewChainGraphById(level: string, id: Chain): void;

}

// Create the store
const useGpuStore = create<TopoStoreState>((set, get) => ({
  // Initial state
  cytoscapeGraphBuilder: null,
  currentGraph: null,
  activeLevel: 1,
  componentCache: null,
  chainCache: null,

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
      const componentViewer = new ComponentViewerImpl(componentTree);
      const componentGraphExtractor = new ComponentGraphExtractor(componentViewer);

      const cytoscapeGraphBuilder = new CytoscapeGraphBuilder(componentGraphExtractor);
    
      // 3. Create initial graph at default level
      const currentGraph = cytoscapeGraphBuilder.createGraphAtLevel(get().activeLevel);

      // Update store with processed data
      set({
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

  //TODO: init messages related data
  loadMessages: () => {},

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

  getNodeInfo: (nodeId) => {
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


  // Handle component selection for graph updates (e.g., on double-click)
  enterComponentView: (componentId: string) => {
    const { cytoscapeGraphBuilder, modifyGraph } = get();
    
    if (!cytoscapeGraphBuilder) {
      console.warn("Cannot select component: cytoscapeGraph is null");
      return;
    }
    
    // Use the doubleClickComponent method to get the new graph
    const newGraph = cytoscapeGraphBuilder.enterComponentView(componentId);
    set({ currentGraph: newGraph });
    
    if (typeof modifyGraph === "function") {
      modifyGraph("tidy");
    }

    console.log("Current graph after enterComponentView:", get().currentGraph);
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
