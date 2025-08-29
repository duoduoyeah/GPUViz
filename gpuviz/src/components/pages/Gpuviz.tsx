import React, { useEffect, useRef } from "react";
import { AppLayout } from "../Layout/AppLayout";
import { ConfigPanel } from "../ConfigPanel/ConfigPanel";
import GraphCanvas, { type GraphCanvasHandles } from "../GraphCanvas/GraphCanvas";
import useGpuStore from "../../store/gpuStore";
// import { DEFAULT_DATA_PATH } from "../../config/default"; //deprecate

const gpuviz: React.FC = () => {
	const { setActiveLevel, modifyGraph, loading, error } = useGpuStore();
	const graphCanvasRef = useRef<GraphCanvasHandles>(null);

	// useEffect(() => {
	// 	const loadDefaultData = async () => {
	// 		try {
	// 			const response = await fetch(DEFAULT_DATA_PATH);
	// 			if (!response.ok) {
	// 				throw new Error(`Failed to load data: ${response.statusText}`);
	// 			}
	// 			const jsonData = await response.json();
	// 			loadTopology(jsonData);
	// 		} catch (err) {
	// 			console.error("Error loading default data:", err);
	// 		}
	// 	};
	// 	if (!componentTree && !loading && !error) {
	// 		loadDefaultData();
	// 	}
	// }, [loadTopology, componentTree, loading, error]);

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
