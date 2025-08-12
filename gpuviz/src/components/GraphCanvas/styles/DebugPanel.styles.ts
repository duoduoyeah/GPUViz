import type { CSSProperties } from "react";

export const debugPanelStyles = {
  // Debug panel container (uses nodeInfo styling but semantically for debug panel)
  container: {
    position: "fixed", // Changed from absolute to fixed for more stable positioning
    top: "80px",
    right: "16px",
    backgroundColor: "#ffffff",
    border: "1px solid #e0e0e0",
    borderRadius: "4px",
    padding: "12px",
    minWidth: "200px",
    maxWidth: "300px", // Added max-width to prevent expansion
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    zIndex: 999,
    transform: "translateZ(0)", // Force hardware acceleration for smoother rendering
  } as CSSProperties,

  title: {
    fontSize: "14px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "8px",
    borderBottom: "1px solid #e0e0e0",
    paddingBottom: "4px",
  } as CSSProperties,

  content: {
    fontSize: "12px",
    color: "#666",
    lineHeight: "1.4",
  } as CSSProperties,

  closeButton: {
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
};