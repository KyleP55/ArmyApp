import React, { useState } from "react";
import { extractUnits } from "./Extractor";
import Sidebar from "./Components/Sidebar";
import UnitDetails from "./Components/UnitDetails";
import Demo from "./demo.json";
import KeywordDemo from "./keywords.json";

import "./App.css";
import icon from "./Icons/war.png";

function App() {
  const [units, setUnits] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [keywordsList, setKeywordList] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

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
    setUnits(null);
    setSelectedUnit(null);
    setKeywordList(null);
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
    setKeywordList(KeywordDemo);
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
        <br />
        <br />
        <p>Credits:</p>
        <div>
          <img src={icon} />
          <a href="https://www.flaticon.com/free-icons/war" title="war icons">War icons created by Freepik - Flaticon</a>
        </div>
      </div>
    );
  }

  // Main app once JSON is loaded
  return (<>
    <div className="mobile-header">
      <button className="hamburger" onClick={() => setDrawerOpen(true)}>☰</button>
      <h1 className="mobile-title">Army Builder</h1>
    </div>

    <div className="app-layout">
      {/* Drawer wrapper */}
      <div className={`drawer ${drawerOpen ? "open" : ""}`}>
        <Sidebar
          units={units}
          keywords={keywordsList}
          onSelect={(u) => {
            setSelectedUnit(u);
            setDrawerOpen(false); // close after selecting
          }}
          handleClear={onClear}
        />
      </div>

      {/* Backdrop */}
      <div
        className={`drawer-backdrop ${drawerOpen ? "visible" : ""}`}
        onClick={() => setDrawerOpen(false)}
      />

      {/* Main content (desktop still shows sidebar normally) */}
      <main className="content">
        {selectedUnit ? (
          <UnitDetails unit={selectedUnit} keywords={keywordsList} faction={units.faction} />
        ) : (
          <p className="placeholder">Select a unit to view details</p>
        )}
      </main>
    </div>
  </>
  );
}

export default App;
