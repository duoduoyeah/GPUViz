import type { CytoscapeGraph } from "../types/cytoscapeGraph";
import { nodeHelper } from "./nodeHelper";
import { baseEdgeHelper as edgeHelper } from "./edgeHelper";
import { ComponentGraphExtractor } from "./componentGraphBuilder";
import type { ComponentGraph } from "./componentGraphBuilder";
/**
 * CytoscapeGraph class to build and manage cytoscape graph representations
 */
export class CytoscapeGraphBuilder {
  private graphExtractor: ComponentGraphExtractor;


  constructor(graphExtractor: ComponentGraphExtractor) {
    this.graphExtractor = graphExtractor;
  }

  buildCyGraph(componentGraph: ComponentGraph, updateComponentGraph = true): CytoscapeGraph {
    if (updateComponentGraph) {
      this.graphExtractor.updateComponentGraph(componentGraph);
    }
    const nodes = nodeHelper.buildGraphNodes(componentGraph.components);
    const edges = edgeHelper.buildGraphEdges(componentGraph.edges);

    return {
      nodes,
      edges,
    };
  }

  createGraphAtLevel(level: number): CytoscapeGraph {
    return this.buildCyGraph(this.graphExtractor.createGraphAtLevel(level));
  }

  selectComponent(componentId: string): CytoscapeGraph {
    const componentGraph = this.graphExtractor.appendComponent(componentId);
    if (!componentGraph) {
      return {
        nodes: [],
        edges: []
      };
    }
    return this.buildCyGraph(componentGraph);
  }


  tidyGraph(): CytoscapeGraph {
    const componentGraph = this.graphExtractor.consolidateGraph();
    return this.buildCyGraph(componentGraph, false);
  }

  completeGraph(): CytoscapeGraph {
    return this.buildCyGraph(this.graphExtractor.getGraph(), false);
  }
}
