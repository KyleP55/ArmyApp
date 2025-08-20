import React, { useState } from "react";

function Sidebar({ units, onSelect }) {
    const [search, setSearch] = useState("");

    const filtered = units.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <aside className="sidebar">
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
                    </li>
                ))}
            </ul>
        </aside>
    );
}

export default Sidebar;
