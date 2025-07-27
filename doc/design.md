### GPUViz

A web project where users can configure a GPU (e.g., memory size, core count) and visualize the GPU architecture as a graph. The graph will consist of simple, rectangular blocks, each with a slightly thicker border, arranged to avoid a cramped appearance. Each block will be colored.

### Graph

- **Levels**: The graph will have multiple zoom levels.
  - **Top level**: Displays a high-level view of the GPU, showing large components like shader arrays.
  - **Second level**: Zooms in to reveal more details within components, such as the structure of a shader array.
  - **Third level**: Zooms further to show even finer details, like the structure within a compute unit.

- **Middle-gap level**: Between component levels, a middle level will show the connections between components, providing more insight into how they interact.
  - For example, between the top and second levels, it will show multiple shader arrays and their connections.

- **Connections**: 
* Current: Instead of straight lines, use edge bundling (curved edges grouped together) to visually group many connections.

The connections of different part will not use arrow to express, since this express method will make the graph really messy(we have a hundred of compoents, and I don't want the user could not find what he want).

Currently, I'm considering using the broader between those components(component with many connections will be rectangle long bar, while compoennts with few will be a square). So, the long edge of the bar could
connect to many, like a dozen of square. Also, the square could use one 
edge to connect to more than one if needed, what do you think this design?

### Graph Requirements
Components are long-bar rectangle or square.

### Performance Requirements
- The graph must be responsive and render quickly,
- The overall backend database may contain around 1k ~ 100k components and 100k connections, but for each rendered view, there will be at most 1k components and 1k connections.
- The graph should be able to handle dynamic updates.

### Project Phases

- **Phase A1**: Initial design of the basic structure and levels.
- **Phase A2**: Connected to mgpusim, or to say, get data from mgpusim.
- **Phase A3**: Focus on the middle-gap-level to display connections in more detail.
- **Phase A4**: Available of memory routine.

- **Phase B1**: Focus on the middle-gap-level to display connections in more detail.
- **Phase B2**: There will be multi-gpus graph support, then something like PCIE, etc
- **Phase B3**: 

### Tech Stack
Core Rendering: Cytoscape.js
State Management: Redux/Zustand (for dynamic updates)
Data Processing: Web Workers (for large graph calculations)
UI Framework: React/Vue (for controls and UI)

Later, we could try: Sigma.js 
<!-- Main: Canvas API
Second Options:Cytoscape.js, Konva.js (Canvas-based), D3.js (with Canvas) -->