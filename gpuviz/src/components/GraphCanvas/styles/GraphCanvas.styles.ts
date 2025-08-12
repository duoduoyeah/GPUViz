import type { CSSProperties } from "react";

export const styles = {
  container: {
    position: "relative",
    width: "100%",
    height: "100%",
    backgroundColor: "#f9f9f9",
    overflow: "hidden",
  } as CSSProperties,

  graphContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: "#ffffff",
    border: "1px solid #e0e0e0",
  } as CSSProperties,

  loadingContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "16px",
  } as CSSProperties,

  loadingSpinner: {
    width: "40px",
    height: "40px",
    border: "4px solid #f3f3f3",
    borderTop: "4px solid #3498db",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  } as CSSProperties,

  loadingText: {
    fontSize: "16px",
    color: "#666",
    fontWeight: "500",
  } as CSSProperties,

  errorContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    padding: "20px",
    backgroundColor: "#ffebee",
    border: "1px solid #e57373",
    borderRadius: "4px",
    maxWidth: "400px",
    textAlign: "center",
  } as CSSProperties,

  errorText: {
    color: "#c62828",
    fontSize: "14px",
    fontWeight: "500",
  } as CSSProperties,

  emptyContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    textAlign: "center",
  } as CSSProperties,

  emptyText: {
    fontSize: "18px",
    color: "#999",
    fontWeight: "500",
  } as CSSProperties,

  errorNotification: {
    position: "fixed", // Changed from absolute to fixed for more stable positioning
    top: "16px",
    right: "16px",
    backgroundColor: "#ffebee",
    border: "1px solid #f44336",
    borderRadius: "4px",
    padding: "12px",
    maxWidth: "300px",
    zIndex: 1000,
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
    transform: "translateZ(0)", // Force hardware acceleration for smoother rendering
  } as CSSProperties,

  errorNotificationTitle: {
    color: "#c62828",
    fontWeight: "bold",
    fontSize: "14px",
    marginBottom: "4px",
  } as CSSProperties,

  errorNotificationMessage: {
    color: "#d32f2f",
    fontSize: "12px",
    lineHeight: "1.4",
  } as CSSProperties,

  // CSS animation for loading spinner
  "@keyframes spin": {
    "0%": { transform: "rotate(0deg)" },
    "100%": { transform: "rotate(360deg)" },
  } as CSSProperties,
};

// Layout configuration
export const cytoscapeLayout = {
  name: "grid",
  fit: true,
  padding: 20,
};
