import React from "react";
import { infoPanelStyles } from "./styles/InfoPanel.styles";
import type { Graph, GraphNode } from "../../../types";

interface InfoPanelProps {
  selectedNodeInfo: GraphNode | null;
  currentGraph: Graph | null;
  getNodeInfo: (id: string | null) => void;
  selectComponent: (id: string) => void;
}

const InfoPanel: React.FC<InfoPanelProps> = ({
  selectedNodeInfo,
  currentGraph,
  getNodeInfo,
  selectComponent,
}) => {
  if (!selectedNodeInfo) {
    return null;
  }

  return (
    <div style={infoPanelStyles.componentInfo}>
      <button 
        style={infoPanelStyles.componentInfoCloseButton}
        onClick={() => getNodeInfo(null)}
        title="Close panel"
      >
        ×
      </button>
      
      <div style={infoPanelStyles.componentInfoTitle}>
        Component Details
      </div>
      
      <div style={infoPanelStyles.componentInfoSection}>
        <div style={infoPanelStyles.componentInfoSectionTitle}>Basic Info</div>
        <div style={infoPanelStyles.componentInfoField}>
          <span style={infoPanelStyles.componentInfoLabel}>ID:</span>
          <span style={infoPanelStyles.componentInfoValue}>{selectedNodeInfo.data.id}</span>
        </div>
        <div style={infoPanelStyles.componentInfoField}>
          <span style={infoPanelStyles.componentInfoLabel}>Label:</span>
          <span style={infoPanelStyles.componentInfoValue}>{selectedNodeInfo.data.label}</span>
        </div>
        <div style={infoPanelStyles.componentInfoField}>
          <span style={infoPanelStyles.componentInfoLabel}>Type:</span>
          <span style={infoPanelStyles.componentInfoValue}>{selectedNodeInfo.data.type}</span>
        </div>
        {selectedNodeInfo.data.shape && (
          <div style={infoPanelStyles.componentInfoField}>
            <span style={infoPanelStyles.componentInfoLabel}>Shape:</span>
            <span style={infoPanelStyles.componentInfoValue}>{selectedNodeInfo.data.shape}</span>
          </div>
        )}
        {selectedNodeInfo.data.parent && (
          <div style={infoPanelStyles.componentInfoField}>
            <span style={infoPanelStyles.componentInfoLabel}>Parent:</span>
            <span style={infoPanelStyles.componentInfoValue}>{selectedNodeInfo.data.parent}</span>
          </div>
        )}
      </div>

      <div style={infoPanelStyles.componentInfoSection}>
        <div style={infoPanelStyles.componentInfoSectionTitle}>Connections</div>
        <div style={infoPanelStyles.componentInfoContent}>
          {currentGraph && (
            <>
              <div style={infoPanelStyles.componentInfoField}>
                <span style={infoPanelStyles.componentInfoLabel}>Incoming:</span>
                <span style={infoPanelStyles.componentInfoValue}>
                  {currentGraph.edges.filter(edge => edge.data.target === selectedNodeInfo.data.id).length}
                </span>
              </div>
              <div style={infoPanelStyles.componentInfoField}>
                <span style={infoPanelStyles.componentInfoLabel}>Outgoing:</span>
                <span style={infoPanelStyles.componentInfoValue}>
                  {currentGraph.edges.filter(edge => edge.data.source === selectedNodeInfo.data.id).length}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      <div style={infoPanelStyles.componentInfoSection}>
        <div style={infoPanelStyles.componentInfoSectionTitle}>Actions</div>
        <div style={infoPanelStyles.componentInfoContent}>
          <button 
            onClick={() => selectComponent(selectedNodeInfo.data.id)}
            style={{
              ...infoPanelStyles.actionButton,
              ...infoPanelStyles.drillDownButton,
            }}
          >
            Drill Down
          </button>
          <button 
            onClick={() => {
              // You can add more actions here, like highlighting connected nodes
              console.log("Highlight connections for:", selectedNodeInfo.data.id);
            }}
            style={{
              ...infoPanelStyles.actionButton,
              ...infoPanelStyles.highlightButton,
            }}
          >
            Highlight
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfoPanel;