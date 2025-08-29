import type { ComponentNode } from "../../types";
import { ChainImpl } from "./chain";

export class ChainBuilder {
	private headNode: ComponentNode | null = null;
	private middleNodes: ComponentNode[] = [];
	private tailNode: ComponentNode | null = null;
	private name: string = "";

	withName(name: string): this {
		this.name = name;
		return this;
	}

	withHeadNode(node: ComponentNode): this {
		this.headNode = node;
		return this;
	}

	withMiddleNodes(nodes: ComponentNode[]): this {
		this.middleNodes = nodes;
		return this;
	}

	withTailNode(node: ComponentNode): this {
		this.tailNode = node;
		return this;
	}

	build(): ChainImpl {
		if (!this.headNode || !this.tailNode) {
			throw new Error("Head node and tail node must be set.");
		}
		const nodes = [this.headNode, ...this.middleNodes, this.tailNode];
		return new ChainImpl(this.name, nodes);
	}
}
