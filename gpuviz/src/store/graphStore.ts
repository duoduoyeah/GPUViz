import { create } from 'zustand';

interface Position {
    x: number;
    y: number;
}

interface GraphNode {
    data: {
        id: string;
        label: string;
        type: string;
        color: string;
        properties: Record<string, any>;
    };
    position: Position;
    classes: string[];
}

interface GraphEdge {
    data: {
        id: string;
        source: string;
        target: string;
        type: string;
    };
}

interface GraphStore {
    nodes: GraphNode[];
    edges: GraphEdge[];
    setGraphData: (nodes: GraphNode[], edges: GraphEdge[]) => void;
    updateNodePosition: (nodeId: string, position: Position) => void;
}

const useGraphStore = create<GraphStore>((set) => ({
    nodes: [],
    edges: [],
    setGraphData: (nodes, edges) => set({ nodes, edges }),
    updateNodePosition: (nodeId, position) => set((state) => ({
        nodes: state.nodes.map(node => 
            node.data.id === nodeId 
                ? { ...node, position } 
                : node
        )
    }))
}));

export default useGraphStore;