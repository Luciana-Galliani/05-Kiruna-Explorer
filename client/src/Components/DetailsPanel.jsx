import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf, faFileImage, faFileWord, faFileExcel, faFile } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const getFileType = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    if (['pdf'].includes(ext)) {
        return 'pdf';
    } else if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) {
        return 'image';
    } else if (['docx', 'doc'].includes(ext)) {
        return 'word';
    } else if (['xlsx'].includes(ext)) {
        return 'excel';
    }
    return 'generic';
};

const DetailsPanel = ({ doc, onClose, isLoggedIn }) => {
    const [document, setDocument] = useState(doc);
    const navigate = useNavigate();

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

    console.log(document.originalResources);
    const stakeholdersList = document.stakeholders
        ? document.stakeholders.map((stakeholder) => stakeholder.name).join(", ")
        : "N/A";

    const processedResources = document.originalResources.map(fileName => {
        const fileType = getFileType(fileName);
        return {
            name: fileName,
            fileType,
            baseName: fileName.split('.').slice(0, -1).join('.'),
            extension: fileName.split('.').pop()
        };
    });


    const getIconForFileType = (fileType) => {
        switch (fileType) {
            case 'pdf':
                return faFilePdf;
            case 'image':
                return faFileImage;
            case 'word':
                return faFileWord;
            case 'excel':
                return faFileExcel;
            default:
                return faFile;
        }
    };

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
                    {processedResources.map((resource, index) => {
                        const icon = getIconForFileType(resource.fileType);
                        return (
                            <li key={index} className="mb-2">
                                <button
                                    className="btn btn-outline-primary"
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
                            </li>
                        );
                    })}
                </ul>

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
};

export default DetailsPanel;
