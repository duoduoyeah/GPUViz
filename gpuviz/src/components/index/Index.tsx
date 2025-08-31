import React from "react";
import styles from "./Index.module.css";
import SQLITE_PATH from "../../config/default"; 
import { loadDataFromFile } from "./DataLoader";

const Index: React.FC = () => {
  return (
  <div className={styles["index-page"]}>
    <h1>Config</h1>
    <p>Start by importing your GPU visualization data file.</p>
    <p>Supported formats: <b>.sqlite</b></p>
    <div style={{ margin: "16px 0" }}>
      <label htmlFor="data-file" style={{ marginRight: "12px" }}>
        <input
          id="data-file"
          type="file"
          accept=".json,.sqlite,.sqlite3,application/json,application/x-sqlite3"
          style={{ display: "none" }}
          onChange={e => {
            const file = e.target.files?.[0];
            if (file) {
              alert(`Selected file: ${file.name}`);
              // TODO: handle file upload/processing
            }
          }}
        />
        <span className={styles["plain-button"]}>Choose File</span>
      </label>
      <span style={{ margin: "0 12px", fontWeight: "bold" }}>OR</span>
      <button
        type="button"
        className={styles["plain-button"]}
        onClick={() => {
          // TODO: use default file logic here
          loadDataFromFile(SQLITE_PATH);
        }}
      >Use Default File</button>
    </div>
  </div>
  );
};

export default Index;
