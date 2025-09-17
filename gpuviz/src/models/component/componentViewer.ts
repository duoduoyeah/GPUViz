import type {ComponentNode, ComponentTree, ComponentViewer } from "../../types";



export class ComponentViewerImpl implements ComponentViewer {
    tree: ComponentTree;
    componentList: ComponentNode[];
    componentTypeMap: Record<string, ComponentNode[]>;

    constructor(tree: ComponentTree) {
        this.tree = tree;
        this.componentList = this.setComponentList(this.tree);
        this.componentTypeMap = this.setComponentTypeMap(this.componentList);
    }

    private setComponentList(tree: ComponentTree): ComponentNode[] {
        const componentList: ComponentNode[] = [];

        const traverse = (node: ComponentNode) => {
            componentList.push(node);
            node.children.forEach(child => traverse(child));
        };

        traverse(tree.root);
        return componentList;
    }

    private setComponentTypeMap(list: ComponentNode[]): Record<string, ComponentNode[]> {
        const typeMap: Record<string, ComponentNode[]> = {};

        list.forEach(node => {
            const type = node.getType(); 
            if (!typeMap[type]) {
                typeMap[type] = [];
            }
            typeMap[type].push(node);
        });

        return typeMap;
    }

    getIdListByType(type: string): string[] {
        if (this.componentTypeMap[type]) {
        return this.componentTypeMap[type].map(component => component.getId()) || [];
        } else {
            return [];
        }
    }

    getTree(): ComponentTree {
        return this.tree;
    }

    getTypeMap(): Record<string, ComponentNode[]> {
        return this.componentTypeMap;
    }

}