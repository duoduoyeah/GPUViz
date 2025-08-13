//   @validateComponentGraph
//   consolidateGraph(): ComponentGraph {
//     const tidyGraph: ComponentGraph = {
//       components: [],
//       edges: []
//     };
//     const currentType: Set<string> = new Set();
//     const currentComponents: Set<string> = new Set();
//     const currentEdges: Set<string> = new Set();

//     for (const key in this.componentTypeMap) {
//       if (!currentType.has(key)) {
//         currentType.add(key);
//         //get the first component in the list to the tidyGraph
//         //use the edgeTypeMap to get all edges related to this component to the tidyGraph
//         const component = this.componentTypeMap[key][0];
//         if (component) {
//           tidyGraph.components.push(component);
//           currentComponents.add(component.name);

//           // Add all edges related to this component
//           const relatedEdges = this.edgeTypeMap.getEdges(component.name);
//           for (const edge of relatedEdges) {
//             if (currentEdges.has(edge.getId())) {
//               continue;
//             };
//             const source = edge.getSource();
//             const target = edge.getTarget();
            
//             if (!currentComponents.has(source.getName())) {
//               tidyGraph.components.push(source);
//               currentComponents.add(source.getName());
//               currentType.add(source.type)
//             }
            
//             if (!currentComponents.has(target.getName())) {
//               tidyGraph.components.push(target);
//               currentComponents.add(target.getName());
//               currentType.add(target.type)
//             }

//             currentEdges.add(edge.getId());
//             tidyGraph.edges.push(edge);
//           }
//         }
//       }
//     }
//     return tidyGraph;
//   }