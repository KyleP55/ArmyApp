import React from "react";
import "./Card.css";

export default function Card({ unit }) {
    return (
        <div className="card">
            {/* Header */}
            <div className="card-header">
                <h2>{unit.name}</h2>
                <p className="keywords">{(unit.factionKeywords || []).join(", ")}</p>
            </div>

            {/* Core Stats */}
            <table className="stats-table">
                <thead>
                    <tr>
                        <th>M</th>
                        <th>T</th>
                        <th>Sv</th>
                        <th>W</th>
                        <th>Ld</th>
                        <th>OC</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{unit.move}</td>
                        <td>{unit.toughness}</td>
                        <td>{unit.save}</td>
                        <td>{unit.wounds}</td>
                        <td>{unit.leadership}</td>
                        <td>{unit.oc}</td>
                    </tr>
                </tbody>
            </table>

            {/* Weapons */}
            {unit.weapons?.length > 0 && (
                <div className="weapons">
                    <h3>Weapons</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Range</th>
                                <th>Type</th>
                                <th>A</th>
                                <th>WS/BS</th>
                                <th>S</th>
                                <th>AP</th>
                                <th>D</th>
                            </tr>
                        </thead>
                        <tbody>
                            {unit.weapons.map((w, idx) => (
                                <tr key={idx}>
                                    <td>{w.name}</td>
                                    <td>{w.range}</td>
                                    <td>{w.type}</td>
                                    <td>{w.attacks}</td>
                                    <td>{w.skill}</td>
                                    <td>{w.strength}</td>
                                    <td>{w.ap}</td>
                                    <td>{w.damage}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Abilities */}
            {unit.abilities?.length > 0 && (
                <div className="abilities">
                    <h3>Abilities</h3>
                    <ul>
                        {unit.abilities.map((a, idx) => (
                            <li key={idx}>
                                <strong>{a.name}:</strong> {a.description}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Keywords */}
            {unit.keywords?.length > 0 && (
                <div className="keywords-bottom">
                    <p><strong>Keywords:</strong> {unit.keywords.join(", ")}</p>
                </div>
            )}
        </div>
    );
}
