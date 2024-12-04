import React, { useState, useEffect, useContext } from "react";
import API from "../API/API.mjs";
import DetailsPanel from "./DetailsPanel";
import { useLocation } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import PropTypes from 'prop-types';

const List = ({ condition }) => {
    const { isLoggedIn } = useContext(AppContext);
    const [documentsToShow, setDocumentsToShow] = useState([]);
    const [hoveredItem, setHoveredItem] = useState(null);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const fetchDocuments = async () => {
            const response = await API.getDocuments();
            if (condition === "true") {
                setDocumentsToShow(
                    response.documents.filter((document) => document.allMunicipality === true)
                );
            } else {
                setDocumentsToShow(response.documents);
            }
        };

        fetchDocuments();
    }, [location.pathname]);

    const handleKeyDown = (e, document) => {
        if (e.key === 'Enter' || e.key === ' ') {
            setSelectedDocument(document);
        }
    };

    return (
        <div
            className="d-flex position-absolute"
            style={{
                top: "70px",
                margin: "0 20px",
                maxWidth: "calc(100% - 40px)",
                minHeight: "80%",
                maxHeight: "calc(100% - 75px)",
            }}
        >
            <div
                className="container position-relative"
                style={{
                    padding: "20px",
                    width: "max-content",
                    maxWidth: "100%",
                    borderRadius: "0.375rem",
                    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                    background: "rgba(255, 255, 255, 0.9)",
                    color: "#333",
                    zIndex: 1,
                    overflowY: "auto",
                }}
            >
                <h1>{condition === "true" ? "All Municipality Documents" : "Documents"}</h1>
                <ul className="list-group">
                    {documentsToShow.map((document) => (
                        <li
                            key={document.id}
                            className={`list-group-item ${hoveredItem === document.id ? "active" : ""}`}
                        >
                            <button
                                onMouseEnter={() => setHoveredItem(document.id)}
                                onMouseLeave={() => setHoveredItem(null)}
                                onClick={() => setSelectedDocument(document)}
                                onKeyDown={(e) => handleKeyDown(e, document)}
                                style={{ background: 'none', border: 'none', padding: '0', width: '100%', color: "black" }}
                                aria-label={`Select ${document.title}`}
                                tabIndex={0}
                            >
                                {document.title}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {selectedDocument && (
                <div className="details-panel-container">
                    <DetailsPanel
                        initialDocId={selectedDocument.id}
                        onClose={() => setSelectedDocument(null)}
                        isLoggedIn={isLoggedIn}
                    />
                </div>
            )}
        </div>
    );
};

List.propTypes = {
    condition: PropTypes.string.isRequired
};

export default List;
