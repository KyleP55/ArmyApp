import React from "react";

function RuleDetails({ unit }) {
    const themeClass = 'theme-' + unit.faction;

    return (
        <div className={`unit-details ${themeClass}`}>
            {/* Header with stats inside */}
            <header className="unit-header">
                <div className="header-top">
                    <div className="header-left">
                        <h2>{unit.rules[0].name}</h2>
                    </div>
                </div>
                <div>
                    <p>{unit.rules[0].description}</p>
                </div>
            </header>

            {/* Detachments */}
            {unit.detachments?.length > 0 && (
                <section className="abilities">
                    <h3 className="unit-header">Detachments</h3>
                    <ul>
                        {unit.detachments.map((d, i) => (
                            <li key={i}>
                                <strong>{d.name}: </strong> {d.description}
                            </li>
                        ))}
                    </ul>
                </section>
            )}

        </div >
    );
}

export default RuleDetails;
