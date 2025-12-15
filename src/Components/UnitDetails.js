import React, { useState, useEffect } from "react";

import RuleDetails from "./RuleDetails"
import KeywordModal from "./KeywordModal";

import MeleeIcon from "../Icons/MeleeWeapons.png";
import RangedIcon from "../Icons/RangedWeapons.png";

import strFormatter from "../StrFormatter";
import keywordFormat from "../formatWithKeywords";

function UnitDetails({ unit, keywords }) {
    const [keywordItem, setKeywordItem] = useState(null);
    const themeClass = 'theme-' + unit.faction;

    if (unit.type === "rules") return <RuleDetails unit={unit} />

    return (
        <div className={`unit-details ${themeClass}`}>
            {keywordItem && <KeywordModal keyword={keywordItem} onClose={() => setKeywordItem(null)} />}
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
                    {unit.stats.map((model, i) => (
                        <div className="stats-row" key={i}>
                            {/* first item, separate row */}
                            {unit.stats.length > 1 && (
                                <div className="statModelName">{model[0]}</div>
                            )}

                            {/* remaining items in grid */}
                            <div className="stats-grid">
                                {model.slice(1).map((s, i) => (
                                    <div key={i} className="stat">
                                        <div className="stat-label">{s.label}</div>
                                        <div className="stat-value">{s.value}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
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
                                            <img src={RangedIcon} alt="Ranged Icon" />
                                            <span>Ranged Weapons</span>
                                        </div>
                                    </th>
                                    <th>Range</th>
                                    <th>A</th><th>BS</th><th>S</th><th>AP</th><th>D</th>
                                </tr>
                            </thead>
                            <tbody>
                                {unit.weapons.ranged
                                    .map((w, i) => (
                                        <tr key={i} className={i % 2 === 0 ? "row-even" : "row-odd"}>
                                            <td className="th-name">
                                                <strong>{w.name}</strong> {w.count && `x${w.count}`}
                                                {w.stats.Keywords?.length > 0 && w.stats.Keywords !== "-" && (
                                                    <><br />[{keywordFormat(w.stats.Keywords, keywords, (e) => setKeywordItem(e))}]</>
                                                )}
                                            </td>
                                            <td>{w.stats.Range}</td><td>{w.stats.A}</td>
                                            <td>{w.stats.BS}</td><td>{w.stats.S}</td>
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
                                            <img src={MeleeIcon} alt="Melee Icon" />
                                            <span>Melee Weapons</span>
                                        </div>
                                    </th>
                                    <th>Range</th>
                                    <th>A</th><th>WS</th><th>S</th><th>AP</th><th>D</th>
                                </tr>
                            </thead>
                            <tbody>
                                {unit.weapons.melee
                                    .map((w, i) => (
                                        <tr key={i} className={i % 2 === 0 ? "row-even" : "row-odd"}>
                                            <td className="th-name">
                                                <strong>{w.name}</strong> {w.count && `x${w.count}`}
                                                {w.stats.Keywords?.length > 0 && w.stats.Keywords !== "-" && (
                                                    <> <br />[{keywordFormat(w.stats.Keywords, keywords, (e) => setKeywordItem(e))}]</>
                                                )}
                                            </td>
                                            <td>{w.stats.Range}</td><td>{w.stats.A}</td>
                                            <td>{w.stats.WS}</td><td>{w.stats.S}</td>
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
                            <li key={i} style={{ whiteSpace: "pre-line" }}>
                                <strong>{a.name}: </strong> {strFormatter(a.description)}

                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {/* Extras */}
            {unit.extras?.length > 0 && unit.extras.map((e, i) => (
                <section className="abilities" key={i}>
                    <h3 className="unit-header">{e.name}</h3>
                    <ul>
                        {e.entries?.map((entrie, i2) => (
                            <li key={i2 + '000'} style={{ whiteSpace: "pre-line" }}>
                                {entrie}

                            </li>
                        ))}
                    </ul>
                </section>
            ))}

            {/* Enhancement */}
            {unit.enhancement && (
                <section className="abilities">
                    <h3 className="unit-header">Enhancement</h3>
                    <div className="enhancement-header">
                        <strong className="enhancement-name">{unit.enhancement.name}:</strong>
                        <span className="enhancement-cost">{unit.enhancement.cost} pts</span>
                    </div>
                    <p className="enhancement-desc">{keywordFormat(
                        unit.enhancement.description,
                        keywords,
                        (e) => setKeywordItem(e)
                    )}</p>
                </section>
            )}

            {/* Core */}
            {unit.core?.length > 0 && (
                <section className="keywords">
                    <h3 className="unit-header">Core</h3>
                    <p>{keywordFormat(unit.core.join(", "), keywords, (e) => setKeywordItem(e))}</p>
                </section>
            )}

            {/* Keywords */}
            {unit.keywords?.length > 0 && (
                <section className="keywords">
                    <h3 className="unit-header">Keywords</h3>
                    <p>
                        {unit.keywords.map((kw, i) => {
                            const isFaction = kw.toLowerCase().includes("faction");
                            return (
                                <React.Fragment key={i}>
                                    {kw.toUpperCase().includes("MODEL ONLY") && <strong>| </strong>}
                                    {isFaction || kw.toUpperCase().includes("MODEL ONLY") ? <strong>{kw}</strong> : kw}
                                    {!kw.toUpperCase().includes("MODEL ONLY") && i < unit.keywords.length - 1 && ", "}
                                </React.Fragment>
                            );
                        })}
                    </p>
                </section>
            )}

            {/* Models */}
            {unit.models?.length > 1 && (
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
                                            {m.weapons.map((w, i2) => (
                                                <li key={i2 + '000'}>{w}</li>
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
