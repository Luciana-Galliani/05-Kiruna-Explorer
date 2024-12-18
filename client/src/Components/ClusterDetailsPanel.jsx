import PropTypes from "prop-types";
import React, { useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import DetailsPanel from "./DetailsPanel";
import { getIconForType } from "./utils/iconUtils";

const ClusterDetailsPanel = ({ documents, onClose }) => {

    const { isLoggedIn } = useContext(AppContext);
    const [selectedDocument, setSelectedDocument] = useState(null);

    if (!documents || documents.length === 0) {
        return null;
    }

    const handleOutsideClick = (e) => {
        if (e.target.id === "cluster-panel-overlay") {
            onClose();
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" || e.key === " " /* Space key */) {
            onClose();
        }
    };

    return (
        <>
            <div
                id="cluster-panel-overlay"
                onClick={handleOutsideClick}
                onKeyDown={handleKeyDown}
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
                    onKeyDown={handleKeyDown} //in dubbio
                    role="presentation"
                >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <h3 style={{ margin: 0, fontSize: "18px", color: "#333" }}>Cluster Content</h3>
                        <button
                            onClick={onClose}
                            onKeyDown={handleKeyDown}
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
                            aria-label="Close panel"
                        >
                            &times;
                        </button>
                    </div>
                    <ul style={{ listStyle: "none", padding: 0, margin: "20px 0 0" }}>
                        {documents.map((document) => {
                            //const imgSrc = icon[document.type];
                            const docColor = document.stakeholders.length === 1 ? document.stakeholders[0].color : "purple";
                            const imgSrc = `data:image/svg+xml;utf8,
                                            ${encodeURIComponent(
                                                getIconForType(document.type, docColor)
                                            )}`;
                            return (
                                <div
                                    key={document.id}
                                    onClick={() => setSelectedDocument(document)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" || e.key === " ") {
                                            setSelectedDocument(document);
                                        }
                                    }}
                                    role="button"
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
                                >
                                    <div style={{ marginRight: "10px", color: "#007BFF" }}>
                                        {imgSrc && (
                                            <img
                                                src={imgSrc}
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
                                </div>
                            );
                        })}
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