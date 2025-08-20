import React from "react";

function UnitDetails({ unit }) {
    console.log('unit', unit)
    return (
        <div className="unit-details">
            {/* Header */}
            <header className="unit-header">
                <h2>{unit.name}</h2>
                <span className="points">{unit.points} pts</span>
            </header>

            {/* Stats */}
            <section className="stats">
                <h3>Stats</h3>
                <div className="stats-grid">
                    {unit.stats.map((s, i) => (
                        <div key={i} className="stat">
                            <div className="stat-label">{s.label}</div>
                            <div className="stat-value">{s.value}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Weapons */}
            {unit.weapons && unit.weapons.length > 0 && (
                <section className="weapons">
                    {/* Ranged */}
                    <h4>Ranged Weapons</h4>
                    <table className="weapons-table">
                        <thead>
                            <tr>
                                <th>Name</th><th>Range</th><th>Type</th>
                                <th>A</th><th>S</th><th>AP</th><th>D</th><th>Abilities</th>
                            </tr>
                        </thead>
                        <tbody>
                            {unit.weapons
                                .filter(w => w.type?.toLowerCase().includes("ranged"))
                                .map((w, i) => (
                                    <tr key={i}>
                                        <td>
                                            {w.name}
                                            {w.keywords?.length > 0 && (
                                                <> [{w.keywords.join(", ")}]</>
                                            )}
                                        </td>
                                        <td>{w.range}</td><td>{w.type}</td>
                                        <td>{w.A}</td><td>{w.S}</td>
                                        <td>{w.AP}</td><td>{w.D}</td>
                                        <td>{w.abilities}</td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>

                    {/* Melee */}
                    <h4>Melee Weapons</h4>
                    <table className="weapons-table">
                        <thead>
                            <tr>
                                <th>Name</th><th>Range</th><th>Type</th>
                                <th>A</th><th>S</th><th>AP</th><th>D</th><th>Abilities</th>
                            </tr>
                        </thead>
                        <tbody>
                            {unit.weapons
                                .filter(w => w.type?.toLowerCase().includes("melee"))
                                .map((w, i) => (
                                    <tr key={i}>
                                        <td>
                                            {w.name}
                                            {w.keywords?.length > 0 && (
                                                <> [{w.keywords.join(", ")}]</>
                                            )}
                                        </td>
                                        <td>{w.range}</td><td>{w.type}</td>
                                        <td>{w.A}</td><td>{w.S}</td>
                                        <td>{w.AP}</td><td>{w.D}</td>
                                        <td>{w.abilities}</td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </section>
            )}

            {/* Abilities */}
            {unit.abilities?.length > 0 && (
                <section className="abilities">
                    <h3>Abilities</h3>
                    <ul>
                        {unit.abilities.map((a, i) => (
                            <li key={i}>
                                <strong>{a.name}: </strong> {a.description}
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {/* Keywords */}
            {unit.keywords?.length > 0 && (
                <section className="keywords">
                    <h3>Keywords</h3>
                    <p>{unit.keywords.join(", ")}</p>
                </section>
            )}
        </div>
    );
}

export default UnitDetails;
