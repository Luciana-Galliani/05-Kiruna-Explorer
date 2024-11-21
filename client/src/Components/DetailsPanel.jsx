import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faFilePdf,
    faFileImage,
    faFileWord,
    faFileExcel,
    faFile,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { RefreshContext } from "../App.jsx";
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

const DetailsPanel = ({ doc, onClose, isLoggedIn }) => {
    const [document, setDocument] = useState(null);
    const [needRefresh, setNeedRefresh] = useContext(RefreshContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDocumentById = async () => {
            try {
                const resp = await API.getDocument(doc);
                setDocument(resp.document);
                setNeedRefresh(false);
            } catch (error) {
                console.error("Error fetching document:", error);
            }
        };

        if (!document || needRefresh) {
            fetchDocumentById();
        }
    }, [doc, needRefresh]);

    if (!document) {
        return (
            <div className="details-panel-container border rounded shadow p-4 bg-light">
                <p>Loading...</p>
            </div>
        );
    }

    const stakeholdersList = document.stakeholders
        ? document.stakeholders.map((stakeholder) => stakeholder.name).join(", ")
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

    return (
        <div className="details-panel-container container-fluid p-4">
            <div className="row">
                <div className="col-12">
                    <h2 className="text-center mb-4">{document.title}</h2>
                </div>
                <div className="col-12 col-md-6 mb-3">
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
                </div>
                <div className="col-12 col-md-6">
                    <div className="d-flex flex-column align-items-center">
                        {processedResources.map((resource, index) => {
                            const icon = getIconForFileType(resource.fileType);
                            return (
                                <div key={index} className="mb-2 w-100">
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
                </div>
                <div className="col-12 mt-4 d-flex justify-content-center gap-3">
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
};

export default DetailsPanel;
