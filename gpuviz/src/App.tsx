import React, { useEffect, useRef } from "react";
import { AppLayout } from "./components/Layout/AppLayout";
import { ConfigPanel } from "./components/ConfigPanel/ConfigPanel";
import GraphCanvas, {
  type GraphCanvasHandles,
} from "./components/GraphCanvas/GraphCanvas";
import useGpuStore from "./store/gpuStore";
import { DEFAULT_DATA_PATH } from "./config/default";
import "./App.css";

const App: React.FC = () => {
  const { loadData, setActiveLevel, loading, error, rawData } = useGpuStore();
  const graphCanvasRef = useRef<GraphCanvasHandles>(null);

  // Load default data on app initialization
  useEffect(() => {
    const loadDefaultData = async () => {
      try {
        const response = await fetch(DEFAULT_DATA_PATH);
        if (!response.ok) {
          throw new Error(`Failed to load data: ${response.statusText}`);
        }
        const jsonData = await response.json();
        loadData(jsonData);
      } catch (err) {
        console.error("Error loading default data:", err);
        // Error is handled by the store, no need for local state
      }
    };

    // Only load data if we don't have any yet
    if (!rawData && !loading && !error) {
      loadDefaultData();
    }
  }, [loadData, rawData, loading, error]);

  // Handle config panel updates
  const handleConfigSubmit = (config: {
    level: number;
    filter: "all" | "memory" | "compute";
    selectedItems: string[];
  }) => {
    console.log("Config updated:", config);

    // Update active level in the store
    setActiveLevel(config.level);

    // TODO: Apply filters and selectedItems
    // This will be implemented when filtering is added to the store
  };

  // Show initial loading state
  if (!rawData && loading && !error) {
    return (
      <div className="loading-container">Loading GPU visualization data...</div>
    );
  }

  // Show error state if data loading failed
  if (error && !rawData) {
    return (
      <div className="error-container">
        <div className="error-title">Failed to Load Data</div>
        <div className="error-message">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="retry-button"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="App">
      <AppLayout
        leftPanel={
          <ConfigPanel
            onSubmit={handleConfigSubmit}
            graphCanvasRef={graphCanvasRef}
          />
        }
        rightPanel={<GraphCanvas ref={graphCanvasRef} />}
      />
    </div>
  );
};

export default App;
