import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavigationPanel from "./components/navigation/NavigationPanel";
import NewPage from "./components/pages/Daisen";
import ChainSight from "./components/ChainSight/ChainSight";
import Gpuviz from "./components/GPUViz/Gpuviz";
import Index from "./components/index/Index";
import "./App.css";

const App: React.FC = () => {

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
