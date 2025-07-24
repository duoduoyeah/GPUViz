import { create } from 'zustand';
import { ComponentTree } from '../models/componentTree';
import { ComponentGraph } from '../models/componentGraph';
import type { NodeInfo } from '../types';

// Define the store state interface
interface GpuStoreState<T extends NodeInfo> {
  // Data state
  rawData: any | null;
  componentTree: ComponentTree<T> | null;
  componentGraph: ComponentGraph<T> | null;
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
  activeLevel: 0,
  
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
      // TODO: Implement data processing logic
      // 1. Convert raw data to component tree
      // 2. Create component graph from tree
      
      // Placeholder implementation:
      set({
        rawData: data,
        loading: false,
        // componentTree and componentGraph will be created here
      });
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    }
  },
  
  setActiveLevel: (level) => {
    set({ activeLevel: level });
    
    // When level changes, we may need to update the graph
    const { componentTree, componentGraph } = get();
    if (componentTree && componentGraph) {
      // TODO: Update graph for the new level
    }
  },
  
  selectNode: (nodeId) => {
    set({ selectedNode: nodeId });
  },
  
  setFilter: (filterType, value) => {
    set((state) => ({
      filters: {
        ...state.filters,
        [filterType]: value,
      }
    }));
    
    // Apply filters to update visualization
    // TODO: Implement filtering logic
  },
  
  toggleConnectionVisibility: () => {
    set((state) => ({
      filters: {
        ...state.filters,
        showConnections: !state.filters.showConnections,
      }
    }));
    
    // TODO: Update graph based on connection visibility
  },
}));

export default useGpuStore;
