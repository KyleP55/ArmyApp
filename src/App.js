import React, { useState } from "react";
import unitsData from "./Nids.json"; // your parsed JSON
import { extractUnits } from "./Extractor";
import Sidebar from "./Components/Sidebar";
import UnitDetails from "./Components/UnitDetails";

import "./App.css";

function App() {
  const units = extractUnits(unitsData);
  const [selectedUnit, setSelectedUnit] = useState(units[0] || null);

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
