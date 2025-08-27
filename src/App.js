import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { extractUnits } from "./Extractor";

import Header from "./Components/Header";
import UnitsPage from "./Pages/UnitsPage";
import AbilitiesPage from "./Pages/AbilitiesPage";

import AbilityDetails from "./Components/AbilityDetails";

import "./App.css";

function App() {
  const [units, setUnits] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null)
  const [faction, setFaction] = useState(null);

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        const extracted = extractUnits(json);
        setUnits(extracted);
        setSelectedUnit(extracted[0]);
        setFaction(extracted[0]?.faction);
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
        <label className="upload-btn">
          Choose File
          <input type="file" accept=".json" onChange={handleFileChange} hidden />
        </label>
      </div>
    );
  }

  // Main app once JSON is loaded
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Header />}>
          <Route index element={
            <UnitsPage units={units} selectedUnit={selectedUnit} onClear={() => setUnits(null)} onSelect={(u) => setSelectedUnit(u)} faction={faction} />
          } />
          <Route path="/abilities" element={<AbilitiesPage units={units} faction={faction} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
