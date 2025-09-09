import strFormatter from "./StrFormatter";

export default function formatWithKeywords(text, keywords, onKeywordClick) {
    // Build patterns for each keyword
    const patterns = keywords.map(k => {
        let base = k.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // escape regex special chars

        if (base.endsWith("-")) {
            // e.g. Anti- → match "Anti-" + word
            return `${base}\\S+`;
        } else if (base === "Melta") {
            return `${base}(?:\\s+\\S+)?`;
        } else if (base === "Deadly Demise") {
            return `${base}(?:\\s+\\S+)?`;
        } else if (base === "Feel No Pain") {
            return `Feel\\s+No\\s+Pain(?:\\s*\\(?.*?\\)?)?`;
        } else {
            // Normal keyword → exact word match
            return `\\b${base}\\b`;
        }
    });

    const regex = new RegExp(`(${patterns.join("|")})`, "gi");

    const parts = text.split(regex);

    return parts.map((part, i) => {
        // Find which keyword matches this part (case-insensitive)
        const keyword = keywords.find(k =>
            part?.toLowerCase().startsWith(k.name.toLowerCase())
        );

        if (keyword) {
            return (
                <span
                    key={i}
                    style={{ color: "blue", cursor: "pointer", fontWeight: "bold" }}
                    onClick={() => onKeywordClick(keyword)}
                >
                    {part}
                </span>
            );
        }

        return <span key={i}>{part}</span>;
    });
}
