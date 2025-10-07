import React, { useState } from "react";
import { extractUnits } from "./Extractor";
import Sidebar from "./Components/Sidebar";
import UnitDetails from "./Components/UnitDetails";
import Demo from "./demo.json";

import "./App.css";

function App() {
  const [units, setUnits] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [keywordsList, setKeywordList] = useState(null);

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        const extracted = extractUnits(json);
        const armyRules = extracted[0].find(u => u.name.toLowerCase() === "army rules");

        const sortedUnits = [
          ...(armyRules ? [armyRules] : []),
          ...extracted[0]
            .filter(u => u.name.toLowerCase() !== "army rules")
            .sort((a, b) => a.name.localeCompare(b.name)),
        ];
        setUnits(sortedUnits);
        setSelectedUnit(armyRules ? sortedUnits[1] : sortedUnits[0] || null);
        setKeywordList(extracted[1]);

      } catch (err) {
        alert("Invalid JSON file");
        console.error(err);
      }
    };
    reader.readAsText(file);
  }

  function onClear() {
    setUnits(null)
    setSelectedUnit(null)
  }

  function onDemo() {
    const armyRules = Demo.find(u => u.name.toLowerCase() === "army rules");

    const sortedUnits = [
      ...(armyRules ? [armyRules] : []),
      ...Demo
        .filter(u => u.name.toLowerCase() !== "army rules")
        .sort((a, b) => a.name.localeCompare(b.name)),
    ];
    setUnits(sortedUnits);
    setSelectedUnit(armyRules ? sortedUnits[1] : sortedUnits[0] || null);
    setKeywordList([]);
  }

  // Show file input before anything else
  if (!units) {
    return (
      <div className="file-upload">
        <h2>Upload a roster JSON file</h2>
        <label className="upload-btn">
          Choose File
          <input type="file" accept=".json" onChange={handleFileChange} hidden />
        </label>
        <label className="upload-btn" onClick={onDemo}>
          Demo
        </label>
      </div>
    );
  }

  // Main app once JSON is loaded
  return (
    <div className="app-layout">
      <Sidebar units={units} keywords={keywordsList} onSelect={setSelectedUnit} handleClear={onClear} />
      <main className="content">
        {selectedUnit ? (
          <UnitDetails unit={selectedUnit} keywords={keywordsList} faction={units.faction} />
        ) : (
          <p className="placeholder">Select a unit to view details</p>
        )}
      </main>
    </div>
  );
}

export default App;
