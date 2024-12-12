import React, { forwardRef, useImperativeHandle } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import designIcon from "../Icons/design.svg";
import informativeIcon from "../Icons/informative.svg";
import prescriptiveIcon from "../Icons/prescriptive.svg";
import technicalIcon from "../Icons/technical.svg";
import agreementIcon from "../Icons/agreement.svg";
import conflictIcon from "../Icons/conflict.svg";
import consultationIcon from "../Icons/consultation.svg";
import actionIcon from "../Icons/action.svg";
import otherIcon from "../Icons/other.svg";
import { Button } from "react-bootstrap";

const documentIcons = {
    Design: designIcon,
    Informative: informativeIcon,
    Prescriptive: prescriptiveIcon,
    Technical: technicalIcon,
    Agreement: agreementIcon,
    Conflict: conflictIcon,
    Consultation: consultationIcon,
    Action: actionIcon,
    Other: otherIcon,
};

import {
    faFilePdf,
    faFileImage,
    faFileWord,
    faFileExcel,
    faFile,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../API/API.mjs";

const getFileType = (fileName) => {
    const ext = fileName.split(".").pop().toLowerCase();
    if (["pdf"].includes(ext)) {
        return "pdf";
    } else if (["jpg", "jpeg", "png", "gif"].includes(ext)) {
        return "image";
    } else if (["docx", "doc"].includes(ext)) {
        return "word";
    } else if (["xlsx"].includes(ext)) {
        return "excel";
    }
    return "generic";
};

const DetailsPanel = forwardRef(({ initialDocId, onClose, isLoggedIn, seeOnMap, toggleSidebar, see }, ref) => {
    const [document, setDocument] = useState(null);
    const navigate = useNavigate();
    const [doc, setDoc] = useState(initialDocId);

    const getDocumentIcon = (type) => {
        return documentIcons[type] || otherIcon;
    };

    useImperativeHandle(ref, () => ({
        resetDocument: () => setDocument(null),
        fetchNewDocument: (newDocId) => setDoc(newDocId),
    }));

    useEffect(() => {
        if (initialDocId) setDoc(initialDocId);
    }, [initialDocId]);

    useEffect(() => {
        const fetchDocumentById = async () => {
            try {
                const resp = await API.getDocument(doc);
                setDocument(resp.document);
            } catch (error) {
                console.error("Error fetching document:", error);
            }
        };

        setDocument(null);
        fetchDocumentById();
    }, [doc]);

    const handleSeeOnMap = () => {
        if (!document) return;

        if (document.allMunicipality === false) {
            if (document.area) {
                seeOnMap({ area: document.area });
            } else if (document.latitude && document.longitude) {
                seeOnMap([document.longitude, document.latitude]);
            }
            toggleSidebar();
            onClose();
        }
    };

    if (!document) {
        return (
            <div className="details-panel-container border rounded shadow p-4 bg-light">
                <p>Loading...</p>
            </div>
        );
    }

    const stakeholdersList = document.stakeholders
        ? document.stakeholders
            .map((stakeholder) => {
                return stakeholder.name === "Others" && document.otherStakeholderName
                    ? document.otherStakeholderName
                    : stakeholder.name;
            })
            .join(", ")
        : "N/A";

    const processedResources = document.originalResources.map((fileName) => {
        const fileType = getFileType(fileName);
        return {
            name: fileName,
            fileType,
            baseName: fileName.split(".").slice(0, -1).join("."),
            extension: fileName.split(".").pop(),
        };
    });

    const getIconForFileType = (fileType) => {
        switch (fileType) {
            case "pdf":
                return faFilePdf;
            case "image":
                return faFileImage;
            case "word":
                return faFileWord;
            case "excel":
                return faFileExcel;
            default:
                return faFile;
        }
    };

    const handleConnectionClick = (connection) => {
        setDocument(null);
        setDoc(connection.targetDocument.id);
    };

    return (
        <div className="details-panel-container">
            <div>
                <div className="d-flex align-items-center justify-content-center mb-4">
                    {/* Render document icon */}
                    <img
                        src={getDocumentIcon(document.type)}
                        alt={`${document.type} icon`}
                        style={{ width: "40px", height: "40px", marginRight: "10px" }}
                    />
                    {/* Document title */}
                    <h2 className="text-center m-0">{document.title}</h2>
                </div>

                {/* Pulsante "See on Map" subito dopo il titolo */}
                {see == true && document.allMunicipality === false && (
                    <div className="d-flex justify-content-center mb-4">
                        <Button variant="dark" onClick={handleSeeOnMap}>
                            See on Map <i className="bi bi-geo-alt"></i>
                        </Button>
                    </div>
                )}


                <ul className="list-unstyled">
                    <li>
                        <strong>Type:</strong>{" "}
                        {document.type === "Other"
                            ? document.otherDocumentType || "Other"
                            : document.type || "N/A"}
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
                        <strong>Stakeholders:</strong> {stakeholdersList}
                    </li>
                    <li>
                        <strong>Description:</strong> {document.description || "N/A"}
                    </li>
                </ul>
                <strong>Connections:</strong>
                <div
                    className="connections overflow-y-auto d-flex flex-column"
                    style={{ maxHeight: "150px", overflowY: "auto" }}
                >
                    {document.connections.length > 0 ? (
                        document.connections.map((connection, index) => (
                            <button
                                key={connection.targetDocument.id}
                                className="connection-item border rounded p-2 mb-2 custom-button"
                                style={{ cursor: "pointer", color: "black" }}
                                onClick={() => handleConnectionClick(connection)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        handleConnectionClick(connection);
                                    }
                                }}
                            >
                                <p style={{ margin: 0 }}>
                                    <strong>Document:</strong> {connection.targetDocument.title}
                                </p>
                                <p style={{ margin: 0 }}>
                                    <strong>Type:</strong> {connection.relationship}
                                </p>
                            </button>
                        ))
                    ) : (
                        <p>No connections available.</p>
                    )}
                </div>

                <div
                    style={{
                        margin: "auto",
                        display: "flex",
                        flexDirection: "column",
                        width: "max-content",
                        maxWidth: "100%",
                        justifyContent: "center",
                        alignItems: "stretch",
                    }}
                >
                    {processedResources.map((resource) => {
                        const icon = getIconForFileType(resource.fileType);
                        return (
                            <div key={resource.name} className="mb-2">
                                <button
                                    className="btn btn-outline-primary w-100"
                                    onClick={() =>
                                        window.open(
                                            `http://localhost:3001/${document.id}/original_resources/${resource.name}`,
                                            "_blank"
                                        )
                                    }
                                >
                                    <FontAwesomeIcon icon={icon} className="me-2" />
                                    See {resource.baseName}.{resource.extension}
                                </button>
                            </div>
                        );
                    })}
                </div>

                <div className="d-flex justify-content-center gap-3 mt-4">
                    {isLoggedIn && (
                        <button
                            className="btn btn-primary px-4"
                            onClick={() => navigate(`/edit/${document.id}`)}
                        >
                            Modify
                        </button>
                    )}
                    <button className="btn btn-danger px-4" onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
});

DetailsPanel.propTypes = {
    initialDocId: PropTypes.number,
    onClose: PropTypes.func.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    seeOnMap: PropTypes.any,
    toggleSidebar: PropTypes.func,
    see: PropTypes.bool.isRequired
};

export default DetailsPanel;
