import {
  GRAPH_CONFIG,
  DEFAULT_CYTOSCAPE_STYLES,
  LAYOUT_PRESETS,
  COMPONENT_SHAPES,
  DEFAULT_GRAPH_OPTIONS,
} from "../../components/GPUViz/GraphCanvas/styles/GraphConfig.style";

describe("GraphConfig", () => {
  // Test configuration constants
  describe("GRAPH_CONFIG", () => {
    it("should contain valid numeric constants", () => {
      expect(GRAPH_CONFIG.DEFAULT_NODE_WIDTH).toBeGreaterThan(0);
      expect(GRAPH_CONFIG.DEFAULT_NODE_HEIGHT).toBeGreaterThan(0);
      expect(GRAPH_CONFIG.DEFAULT_PADDING).toBeGreaterThanOrEqual(0);
      expect(GRAPH_CONFIG.ANIMATION_DURATION).toBeGreaterThanOrEqual(0);
      expect(GRAPH_CONFIG.MIN_ZOOM).toBeGreaterThan(0);
      expect(GRAPH_CONFIG.MAX_ZOOM).toBeGreaterThan(0);
    });

    it("should contain valid color constants", () => {
      expect(GRAPH_CONFIG.DEFAULT_NODE_COLOR).toMatch(/^#([0-9a-f]{3}){1,2}$/i);
      expect(GRAPH_CONFIG.DEFAULT_NODE_BORDER_COLOR).toMatch(
        /^#([0-9a-f]{3}){1,2}$/i,
      );
      expect(GRAPH_CONFIG.SELECTED_NODE_COLOR).toMatch(
        /^#([0-9a-f]{3}){1,2}$/i,
      );
      expect(GRAPH_CONFIG.SELECTED_NODE_BORDER_COLOR).toMatch(
        /^#([0-9a-f]{3}){1,2}$/i,
      );
    });
  });

  // Validate style definitions structure
  describe("DEFAULT_CYTOSCAPE_STYLES", () => {
    it("should be a non-empty array", () => {
      expect(Array.isArray(DEFAULT_CYTOSCAPE_STYLES)).toBe(true);
      expect(DEFAULT_CYTOSCAPE_STYLES.length).toBeGreaterThan(0);
    });

    it("should have valid structure for each style object", () => {
      for (const style of DEFAULT_CYTOSCAPE_STYLES) {
        expect(style).toHaveProperty("selector");
        expect(typeof style.selector).toBe("string");
        expect(style).toHaveProperty("style");
        expect(typeof style.style).toBe("object");
      }
    });

    it("should contain selectors for node, edge, and selected", () => {
      const selectors = DEFAULT_CYTOSCAPE_STYLES.map((s) => s.selector);
      expect(selectors).toContain("node");
      expect(selectors).toContain("edge");
      expect(selectors).toContain(":selected");
    });
  });

  // Check layout preset completeness
  describe("LAYOUT_PRESETS", () => {
    const requiredLayouts = ["grid", "hierarchical", "force", "circle"];

    it("should contain all required layout presets", () => {
      for (const layout of requiredLayouts) {
        expect(LAYOUT_PRESETS).toHaveProperty(layout);
      }
    });

    it("should have a valid name property for each layout", () => {
      for (const key in LAYOUT_PRESETS) {
        const layoutName = key as keyof typeof LAYOUT_PRESETS;
        expect(LAYOUT_PRESETS[layoutName]).toHaveProperty("name");
        expect(typeof LAYOUT_PRESETS[layoutName].name).toBe("string");
      }
    });
  });

  // Verify shape mappings
  describe("COMPONENT_SHAPES", () => {
    it("should contain a default shape", () => {
      expect(COMPONENT_SHAPES).toHaveProperty("default");
      expect(typeof COMPONENT_SHAPES.default).toBe("string");
    });

    it("should have string values for all shape mappings", () => {
      for (const key in COMPONENT_SHAPES) {
        const shapeName = key as keyof typeof COMPONENT_SHAPES;
        expect(typeof COMPONENT_SHAPES[shapeName]).toBe("string");
      }
    });
  });

  // Verify default graph options
  describe("DEFAULT_GRAPH_OPTIONS", () => {
    it("should be a valid object", () => {
      expect(typeof DEFAULT_GRAPH_OPTIONS).toBe("object");
      expect(DEFAULT_GRAPH_OPTIONS).not.toBeNull();
    });

    it("should reference the default styles and a valid layout", () => {
      expect(DEFAULT_GRAPH_OPTIONS.style).toBe(DEFAULT_CYTOSCAPE_STYLES);
      expect(Object.values(LAYOUT_PRESETS)).toContain(
        DEFAULT_GRAPH_OPTIONS.layout,
      );
    });

    it("should have valid zoom and interaction settings", () => {
      expect(DEFAULT_GRAPH_OPTIONS.minZoom).toBe(GRAPH_CONFIG.MIN_ZOOM);
      expect(DEFAULT_GRAPH_OPTIONS.maxZoom).toBe(GRAPH_CONFIG.MAX_ZOOM);
      expect(typeof DEFAULT_GRAPH_OPTIONS.zoomingEnabled).toBe("boolean");
      expect(typeof DEFAULT_GRAPH_OPTIONS.userPanningEnabled).toBe("boolean");
    });
  });
});
