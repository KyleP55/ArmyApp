import "./keywordModal.css";

import strFormatter from "../StrFormatter";

export default function KeywordModal({ keyword, onClose }) {
    if (!keyword) return null;

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div
                className="modal-content"
                onClick={e => e.stopPropagation()}
            >
                <button className="modal-close" onClick={onClose}>
                    ✕
                </button>
                <h2>{keyword.name}</h2>
                <p className="descText">{keyword.description}</p>
            </div>
        </div>
    );
}
