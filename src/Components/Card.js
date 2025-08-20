import React from "react";
import "./Card.css";

const Card = ({ unit, theme = "default" }) => {

    return (
        <div className={`card theme-${theme}`}>
            {/* Header */}
            <div className="card-header">
                <h2 className="card-title">{unit.name}</h2>
                <span className="card-points">{unit.points} pts</span>
            </div>

            {/* Stats */}
            <div className="card-stats">
                <div className="stats-grid">
                    {unit.stats.map((s) => (
                        <div className="stat" key={s.label}>
                            <div className="stat-label">{s.label}</div>
                            <div className="stat-value">{s.value}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Ranged Weapons */}
            {unit.weapons && unit.weapons.some(w => w.type === "Ranged Weapons") && (
                <div className="card-section">
                    <table className="weapons-table">
                        <thead>
                            <tr>
                                <th>Ranged Weapons</th>
                                <th>Range</th>
                                <th>A</th>
                                <th>S</th>
                                <th>AP</th>
                                <th>D</th>
                            </tr>
                        </thead>
                        <tbody>
                            {unit.weapons
                                .filter(w => w.type === "Ranged Weapons")
                                .map((w, idx) => (
                                    <tr key={idx}>
                                        <td>
                                            {w.name}
                                            {w.stats.Keywords && w.stats.Keywords.length > 0 && (
                                                ` [${w.stats.Keywords}]`
                                            )}
                                        </td>
                                        <td>{w.stats.Range}</td>
                                        <td>{w.stats.A}</td>
                                        <td>{w.stats.S}</td>
                                        <td>{w.stats.AP}</td>
                                        <td>{w.stats.D}</td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Melee Weapons */}
            {unit.weapons && unit.weapons.some(w => w.type === "Melee Weapons") && (
                <div className="card-section">
                    <table className="weapons-table">
                        <thead>
                            <tr>
                                <th>Melee Weapons</th>
                                <th>Range</th>
                                <th>A</th>
                                <th>S</th>
                                <th>AP</th>
                                <th>D</th>
                            </tr>
                        </thead>
                        <tbody>
                            {unit.weapons
                                .filter(w => w.type === "Melee Weapons")
                                .map((w, idx) => (
                                    <tr key={idx}>
                                        <td>
                                            {w.name}
                                            {w.stats.Keywords && w.stats.Keywords.length > 0 && (
                                                ` [${w.stats.Keywords}]`
                                            )}
                                        </td>
                                        <td>{w.stats.Range}</td>
                                        <td>{w.stats.A}</td>
                                        <td>{w.stats.S}</td>
                                        <td>{w.stats.AP}</td>
                                        <td>{w.stats.D}</td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Abilities */}
            <div className="card-section">
                <h3>Abilities</h3>
                <ul>
                    {unit.abilities.map((a, idx) => (
                        <li key={idx}>
                            <strong>{a.name}:</strong> {a.description}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Keywords */}
            <div className="card-section">
                <h3>Keywords</h3>
                <p>{(unit.keywords || []).map(k => k.name || k).join(", ")}</p>
            </div>
        </div>
    );
};

export default Card;
