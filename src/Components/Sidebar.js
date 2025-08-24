import React, { useState, useEffect } from "react";

let totalPoints = 0;

function Sidebar({ units, onSelect, handleClear }) {
    const [search, setSearch] = useState("");

    const filtered = units.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase())
    );

    useEffect(() => {
        units.forEach(u => {
            totalPoints += u.points;
        })
    }, []);

    return (
        <aside className="sidebar">
            <button className="new-army-btn" onClick={() => handleClear()}>
                + New Army
            </button>
            <h4 className="pointsText">Total Points: {totalPoints}</h4>
            <input
                type="text"
                className="search"
                placeholder="Search units..."
                value={search}
                onChange={e => setSearch(e.target.value)}
            />
            <ul className="unit-list">
                {filtered.map((u, idx) => (
                    <li
                        key={idx}
                        className="unit-item"
                        onClick={() => onSelect(u)}
                    >
                        {u.name}
                        {u.unitCount > 1 && " (" + u.unitCount + ")"}
                    </li>
                ))}
            </ul>
        </aside>
    );
}

export default Sidebar;
