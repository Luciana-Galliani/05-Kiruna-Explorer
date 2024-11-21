import React, { useState, useEffect, useContext } from "react";
import { Button, Card } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import API from "../API/API.mjs";
import { Stakeholder } from "../models.mjs";
import { RefreshContext } from "../App.jsx";
import { GeneralPart } from "./GeneralPart.jsx";
import { TechnicalPart } from "./TechnicalPart.jsx";
import { LinkAndFilePart } from "./LinkAndFilePart.jsx";
import { GeoPart } from "./GeoPart.jsx"
import { ProgressBar } from "react-step-progress-bar";
import "react-step-progress-bar/styles.css";

const initializeInputValues = (doc) => {
    const defaultDate = ["", "", ""];
    const dateParts = doc?.document?.issuanceDate?.split("-") || defaultDate;

    return {
        title: doc?.document?.title || "",
        stakeholders: doc?.document?.stakeholders || [],
        scaleType: doc?.document?.scaleType || "",
        issuanceYear: dateParts[0] || "",
        issuanceMonth: dateParts[1] || "",
        issuanceDay: dateParts[2] || "",
        type: doc?.document?.type || "",
        language: (doc?.document?.language && doc?.document?.language !== "-") ? doc.document.language : "",
        pages: (doc?.document?.pages && doc?.document?.pages !== "-") ? doc.document.pages : "",
        description: doc?.document?.description || "",
        planScale: doc?.document?.scaleValue || "",
        allMunicipality: doc?.document?.allMunicipality || false,
        latitude: parseFloat(doc?.document?.latitude) || null,
        longitude: parseFloat(doc?.document?.longitude) || null,
        connections: doc?.document?.connections || [],
    };
};

const fetchFiles = async (existingDocument) => {
    if (!existingDocument || !existingDocument.document.originalResources) return;

    const documentId = existingDocument.document.id;
    const resources = existingDocument.document.originalResources;

    try {
        const filePromises = resources.map(async (resourceName) => {
            const url = `http://localhost:3001/${documentId}/original_resources/${resourceName}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Error while uploading file ${resourceName}`);
            }

            const blob = await response.blob();
            const file = new File([blob], resourceName, { type: blob.type });
            return file;
        });

        const files = await Promise.all(filePromises);
        setSelectedFiles(files);
    } catch (error) {
        console.error("Error while uploading files :", error);
    }
}

export function DescriptionForm({
    isLoggedIn,
    coordinates,
    handleChooseInMap,
    documentOptions,
    setDocumentOptions,
    existingDocument,
    className,
}) {
    const navigate = useNavigate();
    const [needRefresh, setNeedRefresh] = useContext(RefreshContext);
    const [inputValues, setInputValues] = useState(() => initializeInputValues(existingDocument));
    const [stakeholderOptions, setStakeholderOptions] = useState([]);
    const [relationshipOptions, setRelationshipOptions] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [notification, setNotification] = useState({ message: "", type: "" });
    const [currentStep, setCurrentStep] = useState(1);

    useEffect(() => {
        if (!isLoggedIn) navigate("/login");
    }, [isLoggedIn, navigate]);

    useEffect(() => {
        fetchInitialData();
        if (existingDocument) fetchFiles();
    }, []);

    useEffect(() => {
        if (coordinates) {
            setInputValues((prev) => ({
                ...prev,
                latitude: coordinates.latitude,
                longitude: coordinates.longitude,
            }));
        }
    }, [coordinates]);

    const fetchFiles = async () => {
        if (!existingDocument || !existingDocument.document.originalResources) return;

        const documentId = existingDocument.document.id;
        const resources = existingDocument.document.originalResources;

        try {
            const filePromises = resources.map(async (resourceName) => {
                const url = `http://localhost:3001/${documentId}/original_resources/${resourceName}`;
                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error(`Error while uploading file ${resourceName}`);
                }

                const blob = await response.blob();
                const file = new File([blob], resourceName, { type: blob.type });
                return file;
            });

            const files = await Promise.all(filePromises);
            setSelectedFiles(files);
        } catch (error) {
            console.error("Error while uploading files :", error);
        }
    };

    const fetchInitialData = async () => {
        try {
            const [stakeholderResp, relationshipResp, documentsResp] = await Promise.all([
                API.getStakeholders(),
                API.getConnections(),
                API.getDocuments(),
            ]);
            setStakeholderOptions(
                stakeholderResp.stakeholders.map(
                    (item) => new Stakeholder(item.id, item.name, item.color)
                )
            );
            setRelationshipOptions(relationshipResp.connections);
            setDocumentOptions(documentsResp.documents);
        } catch (error) {
            console.error("Error fetching initial data:", error);
        }
    };

    const handleSaveForm = async () => {
        const documentData = prepareDocumentData();
        const validationMessage = validateForm(documentData);

        if (validationMessage) {
            showNotification(validationMessage, "error");
            return;
        }

        try {
            if (existingDocument) {
                await handleUpdateDocument(documentData);
            } else {
                await handleCreateDocument(documentData);
            }
            navigate("/");
        } catch (error) {
            console.error("Error saving document:", error);
            showNotification("Error saving document. Please try again.", "error");
        }
    };

    const prepareDocumentData = () => {
        let issuanceDate = inputValues.issuanceYear;
        if (inputValues.issuanceMonth) issuanceDate += `-${inputValues.issuanceMonth.padStart(2, "0")}`;
        if (inputValues.issuanceDay) issuanceDate += `-${inputValues.issuanceDay.padStart(2, "0")}`;

        return {
            ...inputValues,
            issuanceDate,
            latitude: inputValues.allMunicipality ? null : inputValues.latitude,
            longitude: inputValues.allMunicipality ? null : inputValues.longitude,
        };
    };

    const validateForm = (data) => {
        if (!data.title || !data.issuanceDate || !data.type || !data.description) {
            return "Please fill all mandatory fields.";
        }
        if (data.latitude && (data.latitude < 67.21 || data.latitude > 69.3)) {
            return "Latitude must be between 67.21 and 69.3 for Kiruna.";
        }
        if (data.longitude && (data.longitude < 17.53 || data.longitude > 23.17)) {
            return "Longitude must be between 17.53 and 23.17 for Kiruna.";
        }
        return null;
    };

    const handleUpdateDocument = async (data) => {
        const response = await API.updateDocument(existingDocument.document.id, data, selectedFiles);
        showNotification("Document modified successfully!", "success");
        updateDocumentList(response.document);
        setNeedRefresh(true);
    };

    const handleCreateDocument = async (data) => {
        const response = await API.createDocument(data, selectedFiles);
        showNotification("Document saved successfully!", "success");
        setDocumentOptions((prev) => [...prev, response.document]);
    };

    const updateDocumentList = (updatedDoc) => {
        setDocumentOptions((prev) =>
            prev.map((doc) => (doc.id === updatedDoc.id ? updatedDoc : doc))
        );
    };

    const showNotification = (message, type) => {
        setNotification({ message, type });
        setTimeout(() => setNotification({ message: "", type: "" }), 3000);
    };

    const handleNextStep = () => {
        setCurrentStep((prev) => Math.min(prev + 1, 4));
    };

    const handlePreviousStep = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1));
    };

    return (
        <div className={`form-container position-relative ${className}`}>
            {notification.message && (
                <div className={`notification ${notification.type}`}>
                    {notification.message}
                </div>
            )}
            <ProgressBar
                percent={Math.min(Math.max((currentStep / 4) * 100, 0), 100)}
                filledBackground="linear-gradient(to right, #4e8d1f, #3b6c14)"
            />
            {currentStep === 1 && (
                <div className={`step-content ${currentStep === 1 ? "visible" : "hidden"}`}>
                    <GeneralPart
                        inputValues={inputValues}
                        setInputValues={setInputValues}
                        stakeholderOptions={stakeholderOptions}
                    />
                    <Button onClick={handleNextStep} className="ms-2">
                        Next
                    </Button>
                </div>
            )}
            {currentStep === 2 && (
                <div className={`step-content ${currentStep === 2 ? "visible" : "hidden"}`}>
                    <TechnicalPart inputValues={inputValues} setInputValues={setInputValues} />
                    <Button className="danger ms-2" onClick={handlePreviousStep}>
                        Previous
                    </Button>
                    <Button onClick={handleNextStep} className="ms-2">
                        Next
                    </Button>
                </div>
            )}
            {currentStep === 3 && (
                <div className={`step-content ${currentStep === 3 ? "visible" : "hidden"}`}>
                    <GeoPart
                        inputValues={inputValues}
                        setInputValues={setInputValues}
                        handleChooseInMap={handleChooseInMap}
                    />
                    <Button className="danger ms-2" onClick={handlePreviousStep}>
                        Previous
                    </Button>
                    <Button onClick={handleNextStep} className="ms-2">
                        Next
                    </Button>
                </div>
            )}
            {currentStep === 4 && (
                <div className={`step-content ${currentStep === 4 ? "visible" : "hidden"}`}>
                    <LinkAndFilePart
                        inputValues={inputValues}
                        setInputValues={setInputValues}
                        selectedFiles={selectedFiles}
                        setSelectedFiles={setSelectedFiles}
                        relationshipOptions={relationshipOptions}
                        documentOptions={documentOptions}
                    />
                    <Button className="danger ms-2" onClick={handlePreviousStep}>
                        Previous
                    </Button>
                    <Button
                        className="save-button ms-2"
                        variant="primary"
                        onClick={handleSaveForm}
                    >
                        Save Document
                    </Button>
                </div>
            )}
        </div>
    );
}


export function EditDocumentForm({
    isLoggedIn,
    coordinates,
    handleChooseInMap,
    documentOptions,
    setDocumentOptions,
    className,
}) {
    const { documentId } = useParams(); //Get the document ID
    const navigate = useNavigate();
    const [existingDocument, setExistingDocument] = useState();
    const [loading, setLoading] = useState(true); // Loading status

    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/login");
        }
    }, [isLoggedIn, navigate]);

    useEffect(() => {
        const fetchDocumentById = async () => {
            try {
                const resp = await API.getDocument(documentId);
                setExistingDocument(resp);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching document:", error);
            }
        };

        fetchDocumentById();
    }, []);

    if (!loading && existingDocument) {
        return (
            <DescriptionForm
                isLoggedIn={isLoggedIn}
                coordinates={coordinates}
                handleChooseInMap={handleChooseInMap}
                documentOptions={documentOptions}
                setDocumentOptions={setDocumentOptions}
                existingDocument={existingDocument}
                className={className}
            />
        );
    } else {
        return (
            <div className="position-absolute top-50 start-50 translate-middle w-25">
                <Card className="shadow-sm">
                    <Card.Body>
                        <p className="text-center mb-4">Document not found!</p>
                    </Card.Body>
                </Card>
            </div>
        );
    }
}