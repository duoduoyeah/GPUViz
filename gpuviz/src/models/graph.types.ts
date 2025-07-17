export{}

export interface GraphNode {
    data: {
        id: string;
        label: string;
        type: string;
        color: string;
        properties: Record<string, any>;
    };
    position: { x: number; y: number };
    classes: string[];
}

export interface GraphEdge {
    data: {
        id: string;
        source: string;
        target: string;
        type: string;
    };
}