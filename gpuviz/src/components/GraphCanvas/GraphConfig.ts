// Configuration constants, default styles, layout presets
export const GRAPH_CONFIG = {
  // Default dimensions
  DEFAULT_NODE_WIDTH: 120, // Increased from 60 to accommodate longer names
  DEFAULT_NODE_HEIGHT: 80, // Increased from 60 for better text display

  // Colors
  DEFAULT_NODE_COLOR: "#3498db",
  DEFAULT_NODE_BORDER_COLOR: "#2980b9",
  SELECTED_NODE_COLOR: "#e74c3c",
  SELECTED_NODE_BORDER_COLOR: "#c0392b",

  // Layout settings
  DEFAULT_PADDING: 20,

  // Animation settings
  ANIMATION_DURATION: 300,

  // Interaction settings
  ZOOM_SENSITIVITY: 0.1,
  MIN_ZOOM: 0.1,
  MAX_ZOOM: 3.0,
} as const;

// Cytoscape style configuration
export const DEFAULT_CYTOSCAPE_STYLES = [
  {
    selector: "node",
    style: {
      shape: "rectangle" as const,
      "background-color": GRAPH_CONFIG.DEFAULT_NODE_COLOR,
      label: "data(label)",
      "text-valign": "center" as const,
      "text-halign": "center" as const,
      color: "#fff",
      "font-size": "10px", // Reduced from 12px for better fit
      "font-weight": "bold" as const, // Fixed type compatibility
      width: `${GRAPH_CONFIG.DEFAULT_NODE_WIDTH}px`,
      height: `${GRAPH_CONFIG.DEFAULT_NODE_HEIGHT}px`,
      "border-width": "2px",
      "border-color": GRAPH_CONFIG.DEFAULT_NODE_BORDER_COLOR,
      "text-wrap": "wrap" as const,
      "text-max-width": "110px", // Increased from 50px to accommodate larger nodes
    },
  },
  {
    selector: "edge",
    style: {
      width: 2,
      "line-color": "#95a5a6",
      "target-arrow-color": "#95a5a6",
      "target-arrow-shape": "triangle" as const,
      "curve-style": "bezier" as const,
    },
  },
  {
    selector: ":selected",
    style: {
      "background-color": GRAPH_CONFIG.SELECTED_NODE_COLOR,
      "border-color": GRAPH_CONFIG.SELECTED_NODE_BORDER_COLOR,
    },
  },
];

// Layout presets
export const LAYOUT_PRESETS = {
  grid: {
    name: "grid",
    fit: true,
    padding: GRAPH_CONFIG.DEFAULT_PADDING,
    avoidOverlap: true,
    rows: undefined,
    cols: undefined,
  },

  hierarchical: {
    name: "breadthfirst",
    fit: true,
    padding: GRAPH_CONFIG.DEFAULT_PADDING,
    directed: true,
    spacingFactor: 1.5,
  },

  force: {
    name: "cose",
    fit: true,
    padding: GRAPH_CONFIG.DEFAULT_PADDING,
    nodeRepulsion: 2048,
    nodeOverlap: 4,
    idealEdgeLength: 32,
    edgeElasticity: 32,
    nestingFactor: 1.2,
    gravity: 1,
    numIter: 1000,
    initialTemp: 1000,
    coolingFactor: 0.99,
    minTemp: 1.0,
  },

  circle: {
    name: "circle",
    fit: true,
    padding: GRAPH_CONFIG.DEFAULT_PADDING,
    radius: undefined,
    startAngle: 0,
    sweep: undefined,
    clockwise: true,
    sort: undefined,
    animate: false,
    animationDuration: GRAPH_CONFIG.ANIMATION_DURATION,
  },
} as const;

export type LayoutType = keyof typeof LAYOUT_PRESETS;

// Component shape mappings
export const COMPONENT_SHAPES = {
  GPU: "rectangle",
  Memory: "round-rectangle",
  Core: "ellipse",
  Cache: "triangle",
  default: "rectangle",
} as const;

// Default graph options
export const DEFAULT_GRAPH_OPTIONS = {
  layout: LAYOUT_PRESETS.grid,
  style: DEFAULT_CYTOSCAPE_STYLES,
  zoomingEnabled: true,
  userZoomingEnabled: true,
  panningEnabled: true,
  userPanningEnabled: true,
  boxSelectionEnabled: false,
  selectionType: "single" as const,
  autoungrabify: false,
  autounselectify: false,
  minZoom: GRAPH_CONFIG.MIN_ZOOM,
  maxZoom: GRAPH_CONFIG.MAX_ZOOM,
};
