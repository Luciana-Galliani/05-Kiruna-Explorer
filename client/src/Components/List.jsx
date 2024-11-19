import React, { useState, useEffect } from 'react';
import API from '../API/API.mjs';
import DetailsPanel from './DetailsPanel';

const List = ({ condition, isLoggedIn }) => {
    console.log(isLoggedIn);
    const [documents, setDocuments] = useState([]);
    const [documentsToShow, setDocumentsToShow] = useState([]);
    const [hoveredItem, setHoveredItem] = useState(null);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const fetchDocuments = async () => {
            const response = await API.getDocuments();
            setDocuments(response.documents);
            if (condition === "true") {
                setDocumentsToShow(response.documents.filter(document => document.allMunicipality === condition));
            } else {
                setDocumentsToShow(response.documents);
            }
        };

        fetchDocuments();
    }, [condition]);

    return (
        <div
            className="d-flex"
            style={{
                height: "100vh",
                backgroundColor: "#f8f9fa",
                alignItems: "flex-start",
            }}
        >
            <div
                className={"container position-relative "}
                style={{
                    padding: "20px",
                    width: "90%",
                    height: "90%",
                    borderRadius: "0.375rem",
                    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                    background: "rgba(255, 255, 255, 0.9)",
                    color: "#333",
                    zIndex: 1,
                }}
            >
                <h1>Documents</h1>
                <ul className="list-group">
                    {documentsToShow.map((document) => (
                        <li
                            key={document.id}
                            className={`list-group-item ${hoveredItem === document.id ? "active" : ""}`}
                            onMouseEnter={() => setHoveredItem(document.id)}
                            onMouseLeave={() => setHoveredItem(null)}
                            onClick={() => setSelectedDocument(document)}
                        >
                            {document.title}
                        </li>
                    ))}
                </ul>
            </div>

            {selectedDocument && (
                <div className="details-panel-container">
                    <DetailsPanel
                        doc={selectedDocument}
                        onClose={() => setSelectedDocument(null)}
                        isLoggedIn={isLoggedIn}
                    />
                </div>
            )}

        </div>
    );

};

export default List;
