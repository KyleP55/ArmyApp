import { useState, useEffect } from "react";
import Sidebar from "../Components/Sidebar";
import UnitDetails from "../Components/UnitDetails";

function UnitsPage({ units, selectedUnit, onClear, onSelect, faction }) {

    return (
        <div className="pageLayout">
            <Sidebar units={units} onSelect={onSelect} handleClear={onClear} />
            <main className="content">
                {selectedUnit ? (
                    <UnitDetails unit={selectedUnit} faction={faction} />
                ) : (
                    <p className="placeholder">Select a unit to view details</p>
                )}
            </main>
        </div>
    )
}

export default UnitsPage;