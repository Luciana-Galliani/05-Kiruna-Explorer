import PropTypes from "prop-types";
import React, { useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import DetailsPanel from "./DetailsPanel";
import designIcon from "../Icons/design.svg";
import informativeIcon from "../Icons/informative.svg";
import prescriptiveIcon from "../Icons/prescriptive.svg";
import technicalIcon from "../Icons/technical.svg";
import agreementIcon from "../Icons/agreement.svg";
import conflictIcon from "../Icons/conflict.svg";
import consultationIcon from "../Icons/consultation.svg";
import actionIcon from "../Icons/action.svg";
import otherIcon from "../Icons/other.svg";

const ClusterDetailsPanel = ({ documents, onClose }) => {
    
    const icon = {
        "Design Document": designIcon,
        "Informative Document": informativeIcon,
        "Prescriptive Document": prescriptiveIcon,
        "Technical Document": technicalIcon,
        Agreement: agreementIcon,
        Conflict: conflictIcon,
        Consultation: consultationIcon,
        Action: actionIcon,
        Other: otherIcon,
    };

    const { isLoggedIn } = useContext(AppContext);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const img = new Image();

    if (!documents || documents.length === 0) {
        return null;
    }

    const handleOutsideClick = (e) => {
        if (e.target.id === "cluster-panel-overlay") {
            onClose();
        }
    };
    
    return (
    <>
        <div
            id="cluster-panel-overlay"
            onClick={handleOutsideClick}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.3)",
                zIndex: 999,
            }}
        >
        <div
            style={{
                position: "absolute",
                top: "60px",
                right: "40px",
                backgroundColor: "#f8f9fa",
                padding: "20px",
                borderRadius: "12px",
                boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
                maxHeight: "350px",
                width: "300px",
                overflowY: "auto",
                zIndex: 1000,
            }}
            onClick={(e) => e.stopPropagation()}
        >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ margin: 0, fontSize: "18px", color: "#333" }}>Cluster Content</h3>
                <button
                    onClick={onClose}
                    style={{
                        position: "absolute",
                        top: "-8px",
                        right: "12px",
                        backgroundColor: "transparent",
                        color: "#333",
                        border: "none",
                        borderRadius: "50%",
                        width: "30px",
                        height: "30px",
                        fontSize: "23px",
                        cursor: "pointer",
                    }}
                >
                    &times;
                </button>
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: "20px 0 0" }}>
                {documents.map((document) => (
                    (img.src = icon[document.type]),
                    <li
                        key={document.id}
                        onClick={() => setSelectedDocument(document)}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            padding: "10px 15px",
                            marginBottom: "10px",
                            backgroundColor: "#ffffff",
                            borderRadius: "8px",
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                            cursor: "pointer",
                            transition: "background-color 0.3s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#e9ecef")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ffffff")}
                    >
                        <div style={{ marginRight: "10px", color: "#007BFF" }}>
                            {icon[document.type] && (
                                <img
                                    src={img.src}
                                    alt={document.type}
                                    style={{
                                        width: "30px",
                                        height: "30px",
                                        marginLeft: "5px",
                                        padding: "2px",
                                        borderRadius: "50%",
                                    }}
                                />
                            )}
                        </div>
                        <div style={{ flexGrow: 1 }}>
                            <span style={{ fontWeight: "bold", color: "#333" }}>{document.title}</span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    </div>
        {selectedDocument && (
            <DetailsPanel
                initialDocId={selectedDocument.id}
                onClose={() => setSelectedDocument(null)}
                isLoggedIn={isLoggedIn}
            />
        )}
    </>
    );
};

ClusterDetailsPanel.propTypes = {
    documents: PropTypes.array,
    onClose: PropTypes.func.isRequired,
};

export default ClusterDetailsPanel;