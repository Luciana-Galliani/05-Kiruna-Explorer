import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

const DetailsPanel = ({ doc, onClose, isLoggedIn }) => {
    const [document, setDocument] = useState(doc);

    useEffect(() => {
        setDocument(doc);
    }, [doc]);

    if (!document) {
        return (
            <div className="details-panel-container border rounded shadow p-4 bg-light">
                <p>Loading...</p>
            </div>
        );
    }
    console.log(document);
    const stakeholdersList = document.stakeholders
        ? document.stakeholders.map((stakeholder) => stakeholder.name).join(", ")
        : "N/A";

    return (
        <div className="details-panel-container">
            <div>
                <h2 className="text-center mb-4">{document.title}</h2>

                <ul className="list-unstyled">
                    <li>
                        <strong>Type:</strong> {document.type || "N/A"}
                    </li>
                    <li>
                        <strong>Scale:</strong>{" "}
                        {document.scaleType === "Plan"
                            ? document.scaleValue || "N/A"
                            : document.scaleType || "N/A"}
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
                        <strong>Number of Connections:</strong> {document.connections.length || "0"}
                    </li>
                    <li>
                        <strong>Stakeholders:</strong> {stakeholdersList}
                    </li>
                    <li>
                        <strong>Description:</strong> {document.description || "N/A"}
                    </li>
                </ul>

                <div className="d-flex justify-content-center gap-3 mt-4">
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
        </div>
    );
};

DetailsPanel.propTypes = {
    doc: PropTypes.object,
    onClose: PropTypes.func.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
};

export default DetailsPanel;
