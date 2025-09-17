[Pin]
* layout should be tidy, no lines cross each other
* delete component without any edge.
2. gpuStore, the messages related data, in map.
3. the chainSight page -> left panel
4. the chainSight page -> right-upper graph
5. the chainSight page -> right-down graph analyzer

6. gpuviz, add select component in the panel

---
## TODO
1. message builder

2. Edge metrics: think two metrics that correspond to daisen.
 -> amount / time
 -> variance when level is not the lowest level

---
9.17
1. chainViewer, chainGraphBuilder,
---
9.16
1. finish the chainGraphBuilder and chainViewer
2. 

---
9.12
1. update the gpuviz panel: add type and component_id to let the user pick what
he wanted.
-> later, view in ChainSight

2. update the message, first create only one Chain, but make sure there are
combined(SA leve, GPU level) and original. 

---
9.5
1. componentBuilder
2. // create parent component if none-exist in sqliteComponentBuilder.
---
9.4
1. DMA should be in the topology port table [Done, debug]
2. What about RDMA [Not a problem]
3. In the ports_connection, there may be duplicated connections [Not a problem for now]

---
8.31

1. File and string in input

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
8.7
validation of componentGraph

---
8.6
Goal: when slick one component, show this component 

---
8.5
Goal: design the data strucutre follow cytoscape.
We will add to graph: the parent relationship and the connection. [Done]

We need to modify the Level stuff: original, absolute level 1, level 2, level 3. New: give a list to let the user choose the
desired component level.

When double click one component: show all the sub-component in 
this component, show all the connections. we should have a method
like: get the mem routine, or something like this(later)

---
8.1
Goal: start connect stuff, made it readable(adjust the UI part)

gpuStore side, set the edge.

---
07.31
Goal: 
Debug: after an invalid level, the graph side error even the level is validated back. [Done]

---
07.30
Goal: graphcanvas side done, many bugs.
---
07.26
Goal: Step by step write a readable GraphCanvas.tsx

07.25
Goal: quickly show the first edition.
1. the panel side
2. the store
3. app.tsx
4. the graph side

07.24
Goal: Tree Structure → Graph Structure at Specific Level (Cytoscape-ready graph data)


07.23
Goal: successfully import data from mgpusim to GPUViz

* If one component has many ports that connect to many other ports,
then the edge of this square is not enough.

1. 

07-18

07-17
1. Initial Version
