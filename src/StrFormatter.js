export default function strFormatter(text) {
    if (!text) return null;

    const parts = [];
    let remaining = text;

    // Regex that matches ^^...^^ or **...** or [...] 
    const regex = /(\^\^.*?\^\^)|(\*\*.*?\*\*)|(\[.*?\])/g;
    let match, lastIndex = 0;

    while ((match = regex.exec(text)) !== null) {
        // Add plain text before the match
        if (match.index > lastIndex) {
            parts.push(text.slice(lastIndex, match.index));
        }

        const matchedText = match[0];

        if (matchedText.startsWith("^^") && matchedText.endsWith("^^")) {
            parts.push(<b key={parts.length}>{matchedText.slice(2, -2)}</b>);
        }
        else if (matchedText.startsWith("**") && matchedText.endsWith("**")) {
            parts.push(<em key={parts.length}>{matchedText.slice(2, -2)}</em>);
        }
        else if (matchedText.startsWith("[") && matchedText.endsWith("]")) {
            parts.push(<b key={parts.length}>{matchedText}</b>);
        }

        lastIndex = regex.lastIndex;
    }

    // Add any text left after the last match
    if (lastIndex < text.length) {
        parts.push(text.slice(lastIndex));
    }

    return parts;
}