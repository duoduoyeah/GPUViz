import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavigationPanel from "./components/navigation/NavigationPanel";
import NewPage from "./components/pages/Daisen";
import ChainSight from "./components/pages/ChainSight";
import Gpuviz from "./components/pages/Gpuviz";
import Index from "./components/index/Index";
import "./App.css";
import { exec } from "child_process";
import { SQLITE_PATH } from "./config/default";

const App: React.FC = () => {
  // Start the Go SQLite server when the app initializes
  exec(`go run ./src/models/dataLoader/go-sqlite-server/main.go -db=${SQLITE_PATH}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error starting Go SQLite server: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Go SQLite server stderr: ${stderr}`);
    }
    console.log(`Go SQLite server stdout: ${stdout}`);
  });

  return (
    <Router>
      <div style={{ display: "flex" }}>
        <NavigationPanel />
        <div style={{ marginLeft: 120, width: "100%" }}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/gpuviz" element={<Gpuviz />} />
            <Route path="/daisen" element={<NewPage />} />
            <Route path="/chainsight" element={<ChainSight />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
