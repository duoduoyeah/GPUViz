import React from "react";
import { debugPanelStyles } from "./styles/DebugPanel.styles";
import type { CytoscapeGraph } from "../../types";
import type { LayoutType } from "./styles/GraphConfig.style";

interface DebugPanelProps {
  isReady: boolean;
  currentGraph: CytoscapeGraph | null;
  currentLayout: LayoutType;
  initSuccessful: boolean;
  error: string | null;
  showDebugPanel?: boolean;
  onToggleDebugPanel?: () => void;
}

const DebugPanel: React.FC<DebugPanelProps> = ({
  isReady,
  currentGraph,
  currentLayout,
  initSuccessful,
  error,
  showDebugPanel = true,
  onToggleDebugPanel,
}) => {
  if (!isReady || !showDebugPanel) {
    return null;
  }

  return (
    <div style={debugPanelStyles.container}>
      {onToggleDebugPanel && (
        <button 
          style={debugPanelStyles.closeButton}
          onClick={onToggleDebugPanel}
          title="Close debug panel"
        >
          ×
        </button>
      )}
      
      <div style={debugPanelStyles.title}>Graph Debug Info</div>
      <div style={debugPanelStyles.content}>
        <div style={{ marginBottom: "4px" }}>
          <strong>Layout:</strong> {currentLayout}
        </div>
        <div style={{ marginBottom: "4px" }}>
          <strong>Nodes:</strong> {currentGraph?.nodes.length || 0}
        </div>
        <div style={{ marginBottom: "4px" }}>
          <strong>Edges:</strong> {currentGraph?.edges.length || 0}
        </div>
        <div style={{ marginBottom: "4px" }}>
          <strong>Status:</strong>{" "}
          <span style={{ 
            color: isReady ? "#4caf50" : "#f44336",
            fontWeight: "bold" 
          }}>
            {isReady ? "Ready" : "Not Ready"}
          </span>
        </div>
        <div style={{ marginBottom: "4px" }}>
          <strong>Init:</strong>{" "}
          <span style={{ 
            color: initSuccessful ? "#4caf50" : "#ff9800",
            fontWeight: "bold" 
          }}>
            {initSuccessful ? "Success" : "Pending"}
          </span>
        </div>
        {error && (
          <div style={{ marginBottom: "4px" }}>
            <strong>Error:</strong>{" "}
            <span style={{ color: "#f44336", fontWeight: "bold" }}>
              Present
            </span>
          </div>
        )}
        
        {/* Additional debug information */}
        <div style={{ 
          marginTop: "8px", 
          paddingTop: "8px", 
          borderTop: "1px solid #e0e0e0",
          fontSize: "11px",
          color: "#888"
        }}>
          <div>Memory: {(performance as any).memory ? 
            `${Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024)}MB` : 
            'N/A'}
          </div>
          <div>Timestamp: {new Date().toLocaleTimeString()}</div>
        </div>
      </div>
    </div>
  );
};

export default DebugPanel;
