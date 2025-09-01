import React from "react";
import styles from "./Index.module.css";
import { SQLITE_PATH } from "../../config/default";

const Index: React.FC = () => {
  return (
    <div className={styles["index-page"]}>
      <h1>Config</h1>
      <p>The following SQLite file is currently in use:</p>
      <div style={{ margin: "16px 0", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}>
        <p><b>SQLite Path:</b> {SQLITE_PATH}</p>
      </div>
    </div>
  );
};

export default Index;
