import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import API from "../API/API.mjs";

const DetailsPanel = ({ id, onClose, isLoggedIn }) => {
    const [document, setDocument] = useState(null);

    useEffect(() => {
        const fetchDocument = async () => {
            try {
                const response = await API.getDocument(id);
                setDocument(response.document);
            } catch (err) {
                console.error("Failed to fetch document:", err.message);
            }
        };

        fetchDocument();
    }, [id]);

    if (!document) {
        return (
            <div className="details-panel-container border rounded shadow p-4 bg-light">
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="details-panel-container border rounded shadow p-4 bg-light">
            {/* Titolo */}
            <h2 className="text-center mb-4">{document.title}</h2>

            {/* Lista di dettagli */}
            <ul className="list-unstyled">
                <li>
                    <strong>Type:</strong> {document.type || "N/A"}
                </li>
                <li>
                    <strong>Scale Type:</strong> {document.scaleType || "N/A"}
                </li>
                <li>
                    <strong>Issuance Date:</strong> {document.issuanceDate || "N/A"}
                </li>
                <li>
                    <strong>Language:</strong> {document.language || "N/A"}
                </li>
                <li>
                    <strong>Pages:</strong> {document.pages || "N/A"}
                </li>
                <li>
                    <strong>Description:</strong> {document.description || "N/A"}
                </li>
            </ul>

            {/* Pulsanti */}
            <div className="d-flex justify-content-center gap-3 mt-4">
                {/* Mostra "Modify" solo se isLoggedIn è true */}
                {isLoggedIn && (
                    <button
                        className="btn btn-primary px-4"
                        onClick={() => alert("Modify clicked")}
                    >
                        Modify
                    </button>
                )}
                <button
                    className="btn btn-danger px-4"
                    onClick={onClose}
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default DetailsPanel;
