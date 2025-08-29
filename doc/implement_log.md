
## TODO

* the display has some problem, check the fit method
-> the width got when impl layout is wrong.



---
8.30
1. File and string in input
2. gpuStore, the messages related data
3. the chainSight page, method to get the chain
4. 


---
8.29
1. create new page that configure the gpuviz
2. finish the work rest before.

---
8.27
1. test sqlite file import
-> read sqlite file
-> new page for setting the input file

2. chainSight first design
3. chainSight part, simplify to only one chain review.

---
08-22
1. Add a way to import sqlite file.

--
08-21
1.  debug the width problem when layout
 -> I guess the canvas width do not consider the panel at the left, thats why it is a little bit wider
 than the best width.
---
08-18
1. start from CU, if touch stuff not in SA, then can not be back again, and continue,
2. give the components in the chain, the position.


---
08-14
1. create combined component, port and edge.

currently working on CombinedEdge,
need a method to add each sub Edge into it.

---
08-12
## click to display node info

in cytoscapeGraph, I want to do this:
1. for each/all some component, I will add a type to it.
2. when many same-type components show in the graph, they will
range(排列) in a more organized way.


---
08-06-2025

## appendComponent
1. collectEdgesFromNode(node) 
  get all edge of the original node
  (think a name for this func) this func will:
  input: a node

  do: 
  a.for current node, get all ports of it,
  create edge from the port.
  b. then, get to its children, do the 1.
  c. recusively go thourgh all children.
  d. return a list of all edges.

2. getDescendantsUpToLevel(node, level)
  get the n-level chilren of the original node
  a func, that return the a list of node include the original node,
  we call this list shownNodes.

3. filterAndAdjustEdges(edges, shownNodes, rootNode) 
  filter edge -> remove some, modify some
  for edge that both sides are in the shownNodes, okay
  for any side of an edge, if this side is still a descendant
  of the original node, find its lowest level available node 
  in the shownNode that is the ancestor of this side.(modify the info
  of the edge)

  For any side of an edge that this side is not in the original
  node at all, show it directly.(Do not modify the info of this edge,
  later the node will be added)

4. add nodes -> for those node in the edge list but not in shownNodes,
  add it.

4. show the image.

Here’s a concise and clear rewrite of your method description, including better function naming and clearer structure:

```markdown
  ### 1. `collectEdgesFromNode(node)`

  **Purpose:** Recursively collect all edges starting from a given node.
  **Input:** `node` — the root node
  **Process:**

  * For the current node:

    * Iterate over its ports and collect edges.
  * Recursively repeat for all its children.

    **Returns:** A list of all edges from the node and its descendants.

  ### 2. `getDescendantsUpToLevel(node, level)`

  **Purpose:** Get the node and all its descendants up to `n` levels deep.
  **Input:**

  * `node` — the starting node
  * `level` — depth of traversal
    **Returns:** A list of nodes to be shown (`shownNodes`), including the original node.


  ### 3. `filterAndAdjustEdges(edges, shownNodes, rootNode)`

  **Purpose:** Filter and adjust edges based on visibility and hierarchy.
  **Input:**

  * `edges` — all collected edges
  * `shownNodes` — the visible set of nodes
  * `rootNode` — the original root

  for each edge:
    first remove those edge that both side are not in the rootNode.
    for each side(source and target port):
      get the component of this port.
      if this component is within rootNode
      if this component is not within rootNode


  ### 4. `addMissingNodesFromEdges(edges, shownNodes)`

  **Purpose:** Add nodes that are part of the filtered edges but not yet in `shownNodes`.
  **Returns:** Updated `shownNodes` with these missing nodes included.

```

--- 
# Middle

1. Where we could find the document of cytoscape
Find it!  https://js.cytoscape.org/#demos

2. View some basic examples of cytoscape to design our
graph interface.

3. cytoscape lib, git clone
-> main.md, doc, demo

4. Define this problem: buildGraphNodes method in componentGraph:
considering: what if level 2 component connected to level 3 component.

----
# Small

1. what graph structure you recommend?, I have 1000 nodes and 2000 edges.

2. [DEFINE] buildGraphNodes method in componentGraph:

```
Problem Definition: Building Graph Edges from ComponentNode Ports
In a component graph representation, each ComponentNode contains a set of ports, where each Port may have incoming and/or outgoing connections to other Port instances.

Objective
Implement the buildGraphEdges method in the ComponentGraph class. This method constructs a list of GraphEdge objects representing the directed connections (edges) between ComponentNodes, based on their ports' relationships.


Graph Edge Rules
Each Port may reference:

Zero or more incomingPort references (i.e. ports that send data to this port).

Zero or more outgoingPort references (i.e. ports that this port sends data to).


Notes:

we should not have two edges that has the same id, source and target.

```


3. in gpuStore.ts, at the end add a method selectComponent which will return void but modify the currentGraph, please please do not impl this method, just write it and pass, I will modify it later.
Also, at those place you think good, add other code like, when double click, which file which function will call this method that let the currentgraph to be updated

4.appendComponent in componentGraph:
1. get current component
2. get all children of specific level.

5. modify the buildGraphEdge method in componentGraph:

we will input a list of node that will included in the graph.
for edge: 
 a. the two side components of this edge are all included in the graph.
 b. source node in the list, while target is not in the list.
 c. target is in the list, while source is not in the list.

6. modify the buildgraphNode method, delte all node 
that do not contain port at all.

7. suppose in a graph, there are two relationship.
the main one is parent-chilren, except root node, all node has
parent.
The second is the connection, every two different component
may have(not necessary) an edge.

My current goal is to impl the appendComponent method.
In this method, I only need to show 1 node in this graph, however:
I need to include the children of this node.(level 1, so the chilren of chilren is no need, childrenLevel is set to 1)

-> so, curently we have a node list. (level 1 children included, lets call this list init_list)
-> now we need another list, connectionlist, this list include those node that are
not in the init_list, but do have connections to any node in the init_list, or have
connections to any level chilren of any node in the init_list.

In the end, we have node: origin node, its level 1 children, the connection related nodes.
we have edge:
  1. if one side of edge is origin node or its level 1 chilren, and the other is also,
  then its easy right, the source and target is the node.
  2. if one side of edge is origin node or its level 1 chilren, and the other is not,
  we need to show the other side node also.
  3. if one side is outside, while other side is not the node neither the level 1 children, but 
  a more than level 1 chilren, then we record the edge as one side is the level 1 chilren and the
  other side is the outside node.

