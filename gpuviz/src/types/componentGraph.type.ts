import type {ComponentNode, Edge} from "."

export type ComponentGraph = {
  components: ComponentNode[];
  edges: Edge[];
};