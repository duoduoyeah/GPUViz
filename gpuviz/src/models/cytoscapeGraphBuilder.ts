import type { CytoscapeGraph } from "../types/cytoscapeGraph.type";
import { componentHelper } from "./component/componentHelper";
import { baseEdgeHelper as edgeHelper } from "./edge/edgeHelper";
import { ComponentGraphExtractor } from "./component/componentGraphExtractor";
import type { ComponentGraph } from "./component/componentGraphExtractor";

/**
 * CytoscapeGraph class to build and manage cytoscape graph representations
 */
function safeGraphReturn(
  fn: () => ComponentGraph | undefined,
  builder: CytoscapeGraphBuilder,
  updateComponentGraph = true
): CytoscapeGraph {
  try {
    const componentGraph = fn();
    if (!componentGraph) {
      return { nodes: [], edges: [] };
    }
    return builder.buildCyGraph(componentGraph, updateComponentGraph);
  } catch (e) {
    console.error(e);
    // Return a single node with no edges, following the GraphNode interface
    return {
      nodes: [
        {
          data: {
            id: "error-node",
            label: "Error",
            shape: "square",
            type: "error"
          }
        }
      ],
      edges: []
    };
  }
}

export class CytoscapeGraphBuilder {
  private graphExtractor: ComponentGraphExtractor;

  constructor(graphExtractor: ComponentGraphExtractor) {
    this.graphExtractor = graphExtractor;
  }

  buildCyGraph(componentGraph: ComponentGraph, updateComponentGraph = true): CytoscapeGraph {
    if (updateComponentGraph) {
      this.graphExtractor.updateComponentGraph(componentGraph);
    }
    const nodes = componentHelper.buildGraphNodes(componentGraph.components);
    const edges = edgeHelper.buildGraphEdges(componentGraph.edges);

    return {
      nodes,
      edges,
    };
  }

  createGraphAtLevel(level: number): CytoscapeGraph {
    return safeGraphReturn(
      () => this.graphExtractor.createGraphAtLevel(level),
      this
    );
  }

  enterComponentView(componentId: string): CytoscapeGraph {
    return safeGraphReturn(
      () => this.graphExtractor.appendComponent(componentId),
      this
    );
  }

  tidyGraph(): CytoscapeGraph {
    return safeGraphReturn(
      () => this.graphExtractor.consolidateGraph(),
      this,
      false
    );
  }

  completeGraph(): CytoscapeGraph {
    return safeGraphReturn(
      () => this.graphExtractor.getGraph(),
      this,
      false
    );
  }
}
