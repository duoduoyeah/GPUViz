import type { Graph } from "../types/cytoscapeGraph";
import { nodeHelper } from "./nodeHelper";
import { baseEdgeHelper as edgeHelper } from "./edgeHelper";
import { ComponentGraphExtractor } from "./componentGraph";
import type { ComponentGraph } from "./componentGraph";
/**
 * CytoscapeGraph class to build and manage cytoscape graph representations
 */
export class CytoscapeGraph {
  private graphExtractor: ComponentGraphExtractor;

  constructor(graphExtractor: ComponentGraphExtractor) {
    this.graphExtractor = graphExtractor;
  }

  buildCyGraph(componentGraph: ComponentGraph): Graph {
    const nodes = nodeHelper.buildGraphNodes(componentGraph.components);
    const edges = edgeHelper.buildGraphEdges(componentGraph.edges);
    
    // Return the graph
    return {
      nodes,
      edges,
    };
  }

  createGraphAtLevel(level: number): Graph {
    return this.buildCyGraph(this.graphExtractor.createGraphAtLevel(level));
  }

  selectComponent(componentId: string): Graph {
    const componentGraph = this.graphExtractor.appendComponent(componentId);
    if (!componentGraph) {
      return {
        nodes: [],
        edges: []
      };
    }
    return this.buildCyGraph(componentGraph);
  }
}
