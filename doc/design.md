### GPUViz

A web project where users can configure a GPU (e.g., memory size, core count) and visualize the GPU architecture as a graph. The graph will consist of simple, rectangular blocks, each with a slightly thicker border, arranged to avoid a cramped appearance. Each block will be colored.

### Graph Structure

- **Levels**: The graph will have multiple zoom levels.
  - **Top level**: Displays a high-level view of the GPU, showing large components like shader arrays.
  - **Second level**: Zooms in to reveal more details within components, such as the structure of a shader array.
  - **Third level**: Zooms further to show even finer details, like the structure within a compute unit.

- **Middle-gap level**: Between component levels, a middle level will show the connections between components, providing more insight into how they interact.
  - For example, between the top and second levels, it will show multiple shader arrays and their connections.

### Performance Requirements
- The graph must be responsive and render quickly,
- The overall backend database may contain around 1k ~ 100k components and 100k connections, but for each rendered view, there will be at most 1k components and 1k connections.
- The graph should be able to handle dynamic updates.

### Project Phases

- **Phase 1**: Initial design of the basic structure and levels.
- **Phase 2**: Focus on the middle-gap-level to display connections in more detail.
- **Phase 3**: There will be multi-gpus graph support, then something like PCIE, etc


### Tech Stack
Core Rendering: Cytoscape.js
State Management: Redux/Zustand (for dynamic updates)
Data Processing: Web Workers (for large graph calculations)
UI Framework: React/Vue (for controls and UI)

<!-- Main: Canvas API
Second Options:Cytoscape.js, Konva.js (Canvas-based), D3.js (with Canvas) -->