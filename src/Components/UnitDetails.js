import React from "react";

function getFactionTheme(faction) {
    if (!faction) return "theme-default";
    const f = faction.toLowerCase();

    if (f.includes("imperium")) return "theme-imperium";
    if (f.includes("chaos")) return "theme-chaos";
    if (f.includes("ork")) return "theme-ork";
    if (f.includes("tyranid")) return "theme-tyranid";
    if (f.includes("necron")) return "theme-necron";
    if (f.includes("eldar")) return "theme-eldar";

    return "theme-default";
}

function UnitDetails({ unit }) {
    console.log(unit)
    const themeClass = 'theme-' + unit.faction;
    console.log(themeClass)
    return (
        <div className={`unit-details ${themeClass}`}>
            {/* Header with stats inside */}
            <header className="unit-header">
                <div className="header-top">
                    <div className="header-left">
                        <h2>{unit.name}</h2>
                        {unit.count > 1 && <h4 className="count">x{unit.count}</h4>}
                        {unit.warlord && <h4 className="warlord">Warlord</h4>}
                    </div>
                    <span className="points">{unit.points} pts</span>
                </div>

                <div className="header-stats">
                    <div className="stats-grid">
                        {unit.stats.map((s, i) => (
                            <div key={i} className="stat">
                                <div className="stat-label">{s.label}</div>
                                <div className="stat-value">{s.value}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </header>

            {/* Weapons */}
            {unit.weapons && (
                <section className="weapons">
                    {/* Ranged */}
                    {unit.weapons.ranged.length > 0 && (
                        <table className="weapons-table">
                            <thead>
                                <tr>
                                    <th className="th-name">
                                        <div className="th-content">
                                            <img src="./Icons/RangedWeapons.png" alt="Ranged Icon" />
                                            <span>Ranged Weapons</span>
                                        </div>
                                    </th>
                                    <th>Range</th>
                                    <th>A</th><th>S</th><th>AP</th><th>D</th>
                                </tr>
                            </thead>
                            <tbody>
                                {unit.weapons.ranged
                                    .map((w, i) => (
                                        <tr key={i}>
                                            <td className="th-name">
                                                <strong>{w.name}</strong> {w.count && `x${w.count}`}
                                                {w.stats.Keywords?.length > 0 && w.stats.Keywords !== "-" && (
                                                    <><br />[{w.stats.Keywords}]</>
                                                )}
                                            </td>
                                            <td>{w.stats.Range}</td>
                                            <td>{w.stats.A}</td><td>{w.stats.S}</td>
                                            <td>{w.stats.AP}</td><td>{w.stats.D}</td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    )}

                    {/* Melee */}
                    {unit.weapons.melee.length > 0 && (
                        <table className="weapons-table">
                            <thead>
                                <tr>
                                    <th className="th-name">
                                        <div className="th-content">
                                            <img src="./Icons/MeleeWeapons.png" alt="Melee Icon" />
                                            <span>Melee Weapons</span>
                                        </div>
                                    </th>
                                    <th>Range</th>
                                    <th>A</th><th>S</th><th>AP</th><th>D</th>
                                </tr>
                            </thead>
                            <tbody>
                                {unit.weapons.melee
                                    .map((w, i) => (
                                        <tr key={i}>
                                            <td className="th-name">
                                                <strong>{w.name}</strong> {w.count && `x${w.count}`}
                                                {w.stats.Keywords?.length > 0 && w.stats.Keywords !== "-" && (
                                                    <> <br />[{w.stats.Keywords}]</>
                                                )}
                                            </td>
                                            <td>{w.stats.Range}</td>
                                            <td>{w.stats.A}</td><td>{w.stats.S}</td>
                                            <td>{w.stats.AP}</td><td>{w.stats.D}</td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    )}
                </section>
            )}

            {/* Abilities */}
            {unit.abilities?.length > 0 && (
                <section className="abilities">
                    <h3 className="unit-header">Abilities</h3>
                    <ul>
                        {unit.abilities.map((a, i) => (
                            <li key={i}>
                                <strong>{a.name}: </strong> {a.description}
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {/* Core */}
            {unit.core?.length > 0 && (
                <section className="keywords">
                    <h3 className="unit-header">Core</h3>
                    <p>{unit.core.join(", ")}</p>
                </section>
            )}

            {/* Keywords */}
            {unit.keywords?.length > 0 && (
                <section className="keywords">
                    <h3 className="unit-header">Keywords</h3>
                    <p>{unit.keywords.join(", ")}</p>
                </section>
            )}

            {/* Models */}
            {unit.models?.length > 0 && (
                <section className="keywords">
                    <h3 className="unit-header">Models</h3>
                    <div className="models-container">
                        {unit.models && unit.models.map((m, i) => {
                            return (
                                <div key={i} className="model-card">
                                    <div className="model-header">
                                        <span className="model-name">{m.name}</span>
                                        <span className="model-count">x{m.count}</span>
                                    </div>
                                    {m.weapons?.length > 0 && (
                                        <ul className="weapons-list">
                                            {m.weapons.map((w, i) => (
                                                <li key={i}>{w}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </section>
            )}
        </div >
    );
}

export default UnitDetails;
