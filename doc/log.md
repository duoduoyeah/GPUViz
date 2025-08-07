[Pin]
* Goal: Tree Structure → Graph Structure at Specific Level (Cytoscape-ready graph data)
* Check Hooks for Components and Buffer of Port
* we run a larger workload to get another connections
* user input -> panel side logic -> modify the data -> give to cytoscape to update the graph

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
