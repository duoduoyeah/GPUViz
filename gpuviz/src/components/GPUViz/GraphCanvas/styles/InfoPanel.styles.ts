import type { CSSProperties } from "react";

export const infoPanelStyles = {
  // Component info panel (left-side panel)
  componentInfo: {
    position: "fixed",
    top: "20px",
    left: "280px",
    backgroundColor: "#ffffff",
    border: "1px solid #e0e0e0",
    borderRadius: "4px",
    padding: "16px",
    minWidth: "250px",
    maxWidth: "350px",
    maxHeight: "calc(100vh - 120px)",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    zIndex: 999,
    transform: "translateZ(0)",
    overflowY: "auto",
  } as CSSProperties,

  componentInfoTitle: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "12px",
    borderBottom: "2px solid #2196f3",
    paddingBottom: "6px",
  } as CSSProperties,

  componentInfoSection: {
    marginBottom: "12px",
  } as CSSProperties,

  componentInfoSectionTitle: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#555",
    marginBottom: "6px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  } as CSSProperties,

  componentInfoContent: {
    fontSize: "12px",
    color: "#666",
    lineHeight: "1.5",
  } as CSSProperties,

  componentInfoField: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "4px",
    fontSize: "12px",
  } as CSSProperties,

  componentInfoLabel: {
    fontWeight: "500",
    color: "#777",
  } as CSSProperties,

  componentInfoValue: {
    color: "#333",
    fontFamily: "monospace",
  } as CSSProperties,

  componentInfoCloseButton: {
    position: "absolute",
    top: "8px",
    right: "8px",
    background: "none",
    border: "none",
    fontSize: "18px",
    cursor: "pointer",
    color: "#999",
    width: "24px",
    height: "24px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  } as CSSProperties,

  // Action buttons
  actionButton: {
    padding: "4px 8px",
    fontSize: "11px",
    color: "white",
    border: "none",
    borderRadius: "3px",
    cursor: "pointer",
  } as CSSProperties,

  drillDownButton: {
    backgroundColor: "#2196f3",
    marginRight: "8px",
  } as CSSProperties,

  highlightButton: {
    backgroundColor: "#4caf50",
  } as CSSProperties,
};