You're absolutely right! Level-based filtering is much cleaner for your use case. Let me break down how to tackle this complex problem systematically.

## Problem Decomposition Strategy

### 1. **Identify the Core Transformations**
Your main challenge: `Tree Structure → Graph Structure at Specific Level`

Break this into:
- **Input**: ComponentNode tree from builder
- **Level Selection**: Which hierarchy level to show
- **Node Extraction**: Get components at that level
- **Edge Creation**: Find connections between those components
- **Output**: Cytoscape-ready graph data

### 2. **Start with Simple Cases First**
Don't try to solve everything at once:

**Stage 1: Single Level, No Connections**
- `getComponentsAtLevel(level: string)` - Just extract nodes
- Test with simple tree traversal

**Stage 2: Add Connection Logic**
- Handle only direct connections first

**Stage 3: Add Cross-Level Connections**
- Handle connections that go through hierarchy (CU → L2Cache)
- This is the trickiest part

**Stage 4: Optimize and Polish**
- Performance, edge cases, complex hierarchies

### 3. **Concrete Method Structure for ComponentGraph**

```typescript
5. `buildGraphNodes(components)` - Convert ComponentNode[] to GraphNode[]

6. `buildGraphEdges(connections)` - Convert port connections to graph edges

7. `assembleGraph(nodes, edges)` - Combine into final graph structure
```

### 4. **Debugging Strategy**
- Test each method with console.log
- Start with your smallest JSON sample
- Print intermediate results at each step
- Visualize the tree structure first (text output)

### 5. **Handle the Tricky Parts**
The hardest part will be **cross-level connections**. For example:
- You're at SA level showing SA[0], SA[1], L2Cache
- But there's a connection CU[0] → L2Cache
- You need to show this as SA[0] → L2Cache

Would you like me to elaborate on any of these phases, or shall we start implementing Stage 1 with the level extraction logic?