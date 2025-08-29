
Ground level design;

1. We will graph the GPU in multi-level style, like this
level is SA level, and another level is CU level. This
is because if we put all components in the graph,
the graph will be too messy.

2. If the user is interested in one routine of the gpu,
most likely, the memory system, then we could graph out
one routine of this.(Immature, re-design later)

3. What we could report, we could report something that
shows the asymmetric, like the asymmetric among cu,
l1 level cache, extra.

4. Originally, by the exec time of the workload, we
could compute the usage ratio of TFLOPS, what if, we
could anlyze this in a detailed level, like stuck
in where, what part is not fully used.


## Express the components in a well-defined graph.
Considering some questions, like:
1. how to express the relationship between components,
there are serveral relationship:
a. component A consists of component B
b. component A is connected to component B(this means
these two component will directly send messages)
c. component A and component B is the same type(Like two CU)