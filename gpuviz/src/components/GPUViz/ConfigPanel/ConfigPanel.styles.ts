import type { CSSProperties } from "react";

export var CONFIG_PANEL_WIDTH = "250px";

export const styles = {
  collapsedContainer: {
    width: "40px",
    height: "100vh",
    backgroundColor: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    borderRight: "1px solid #ddd",
  } as CSSProperties,

  mainContainer: {
    width: CONFIG_PANEL_WIDTH,
    height: "100vh",
    backgroundColor: "#ffffff",
    borderRight: "1px solid #ddd",
    display: "flex",
    flexDirection: "column",
    color: "#333333",
  } as CSSProperties,

  header: {
    display: "flex",
    alignItems: "center",
    padding: "16px",
    borderBottom: "1px solid #ddd",
  } as CSSProperties,

  chevronButton: {
    marginRight: "8px",
    cursor: "pointer",
    background: "transparent",
    border: "none",
    fontSize: "16px",
    padding: "4px",
  } as CSSProperties,

  title: {
    fontWeight: "bold",
    color: "#333333",
  } as CSSProperties,

  section: {
    padding: "16px",
    borderBottom: "1px solid #ddd",
    color: "#333333",
  } as CSSProperties,

  levelInput: {
    marginLeft: "8px",
    width: "60px",
    padding: "4px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    marginBottom: "16px", // Add space below input
    display: "block", // Ensure input is on its own line
  } as CSSProperties,

  filterButtonGroup: {
    marginTop: "8px",
  } as CSSProperties,

  filterButton: (isActive: boolean): CSSProperties => ({
    padding: "6px 12px",
    marginRight: "4px",
    backgroundColor: isActive ? "#4CAF50" : "#fff",
    color: isActive ? "#fff" : "#000",
    border: "1px solid #ccc",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
  }),

  itemList: {
    flex: 1,
    overflowY: "auto",
    padding: "16px",
    borderBottom: "1px solid #ddd",
  } as CSSProperties,

  itemLabel: {
    display: "block",
    marginBottom: "8px",
    cursor: "pointer",
    color: "#333333",
  } as CSSProperties,

  itemCheckbox: {
    marginRight: "8px",
  } as CSSProperties,

  submitSection: {
    padding: "16px",
  } as CSSProperties,

  submitButton: {
    width: "90%",
    padding: "8px",
    backgroundColor: "#2196F3",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    marginTop: "8px", // Add space above button
    display: "block", // Ensure button is on its own line
  } as CSSProperties,
};
