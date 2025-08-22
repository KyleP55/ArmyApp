import React, { useState } from "react";
import { extractUnits } from "./Extractor";
import Sidebar from "./Components/Sidebar";
import UnitDetails from "./Components/UnitDetails";

import "./App.css";

function App() {
  const [units, setUnits] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        const extracted = extractUnits(json);
        setUnits(extracted);
        setSelectedUnit(extracted[0] || null);
      } catch (err) {
        alert("Invalid JSON file");
        console.error(err);
      }
    };
    reader.readAsText(file);
  }

  // Show file input before anything else
  if (!units) {
    return (
      <div className="file-upload">
        <h2>Upload a roster JSON file</h2>
        <input type="file" accept=".json" onChange={handleFileChange} />
      </div>
    );
  }

  // Main app once JSON is loaded
  return (
    <div className="app-layout">
      <Sidebar units={units} onSelect={setSelectedUnit} />
      <main className="content">
        {selectedUnit ? (
          <UnitDetails unit={selectedUnit} />
        ) : (
          <p className="placeholder">Select a unit to view details</p>
        )}
      </main>
    </div>
  );
}

export default App;
