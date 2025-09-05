import React, { useEffect, useRef } from "react";
import { AppLayout } from "../Layout/AppLayout";
import { ConfigPanel } from "./ConfigPanel/ConfigPanel";
import GraphCanvas, { type GraphCanvasHandles } from "../GraphCanvas/GraphCanvas";
import useGpuStore from "../../store/gpuStore";
import { loadDataFromFile } from "../index/DataLoader";


const gpuviz: React.FC = () => {
	const { setActiveLevel, modifyGraph, loading, error, currentGraph } = useGpuStore();
	const graphCanvasRef = useRef<GraphCanvasHandles>(null);

  useEffect(() => {
    if (!currentGraph) {
      loadDataFromFile();
    }
  }, [currentGraph]);

	const handleConfigSubmit = (config: {
		filter: "all" | "tidy";
		selectedItems: string[];
	}) => {
		console.log("Config updated:", config);
		modifyGraph(config.filter);
		// TODO: Apply selectedItems
	};

	const handleLevelChange = (level: number) => {
		console.log("Level updated:", level);
		setActiveLevel(level);
	};

	if (loading && !error) {
		return <div className="loading-container">Loading GPU visualization data...</div>;
	}
	if (error) {
		return (
			<div className="error-container">
				<div className="error-title">Failed to Load Data</div>
				<div className="error-message">{error}</div>
				<button onClick={() => window.location.reload()} className="retry-button">Retry</button>
			</div>
		);
	}

	return (
		<AppLayout
			leftPanel={
				<ConfigPanel
					onSubmit={handleConfigSubmit}
					onLevelChange={handleLevelChange}
					graphCanvasRef={graphCanvasRef}
				/>
			}
			rightPanel={<GraphCanvas ref={graphCanvasRef} />}
		/>
	);
};

export default gpuviz;
