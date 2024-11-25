import React, { useState, useEffect, useContext } from "react";
import { Button, Card } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import API from "../API/API.mjs";
import { Stakeholder } from "../models.mjs";
import { GeneralPart } from "./GeneralPart.jsx";
import { TechnicalPart } from "./Technicalpart.jsx";
import { LinkPart } from "./LinkPart.jsx";
import { GeoPart } from "./GeoPart.jsx";
import { AppContext } from "../context/AppContext.jsx";
import { ProgressBar } from "react-step-progress-bar";

// Function to initialize form values
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

const StepProgressBar = ({ currentStep, steps, setCurrentStep, existingDocument }) => {
    return (
        <div className="step-progress-bar">
            {steps.map((step, index) => (
                <div
                    key={index}
                    className={`step ${existingDocument || index <= currentStep ? "active" : ""}`}
                    onClick={() => (existingDocument || index <= currentStep) && setCurrentStep(index)}
                >
                    <div className={`circle ${existingDocument || index <= currentStep ? "blue" : ""}`}>
                        {index + 1}
                    </div>
                    <div className="label">{step.label}</div>
                </div>
            ))}
        </div>
    );
};



export function DescriptionForm({ coordinates, existingDocument, className }) {
    const navigate = useNavigate();
    const [inputValues, setInputValues] = useState(() => initializeInputValues(existingDocument));
    const [stakeholderOptions, setStakeholderOptions] = useState([]);
    const [relationshipOptions, setRelationshipOptions] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [notification, setNotification] = useState({ message: "", type: "" });
    const [currentStep, setCurrentStep] = useState(0);
    const { isLoggedIn, setAllDocuments } = useContext(AppContext);

    const steps = [
        { label: "General Info", component: <GeneralPart inputValues={inputValues} setInputValues={setInputValues} stakeholderOptions={stakeholderOptions} /> },
        { label: "Technical Info", component: <TechnicalPart inputValues={inputValues} setInputValues={setInputValues} selectedFiles={selectedFiles} setSelectedFiles={setSelectedFiles} /> },
        { label: "Geographic Info", component: <GeoPart inputValues={inputValues} setInputValues={setInputValues} /> },
        { label: "Linked Documents", component: <LinkPart inputValues={inputValues} setInputValues={setInputValues} relationshipOptions={relationshipOptions} /> },
    ];

    // Redirect if not logged in
    useEffect(() => {
        if (!isLoggedIn) navigate("/login");
    }, [isLoggedIn, navigate]);

    // Validation function for form data
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
            setAllDocuments(documentsResp.documents);
        } catch (error) {
            console.error("Error fetching initial data:", error);
        }
    };

    const handleSaveForm = async () => {
        const validationMessage = handleValidation(true); // Validate all steps
        if (validationMessage) {
            showNotification(validationMessage, "error");
            return;
        }

        const documentData = prepareDocumentData();

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

    const handleValidation = (validateAllSteps = false) => {
        if (validateAllSteps || currentStep === 0) {
            if (!inputValues.title || !inputValues.stakeholders.length || !inputValues.description || !inputValues.issuanceYear) {
                return "Please complete title, stakeholders, description, and issuance date.";
            }
        }
        if (validateAllSteps || currentStep === 1) {
            if (!inputValues.type || !inputValues.scaleType) {
                return "Please complete type and scale type.";
            }
            if (inputValues.pages && !/^(\d+|\d+-\d+)$/.test(inputValues.pages)) {
                return "Pages must be a number or a range (e.g., 1-32).";
            }
        }
        if (validateAllSteps || currentStep === 2) {
            if (!inputValues.allMunicipality) {
                if (!inputValues.latitude || !inputValues.longitude) {
                    return "Please provide latitude and longitude.";
                }
                if (inputValues.latitude < 67.21 || inputValues.latitude > 69.3) {
                    return "Latitude must be between 67.21 and 69.3 for Kiruna.";
                }
                if (inputValues.longitude < 17.53 || inputValues.longitude > 23.17) {
                    return "Longitude must be between 17.53 and 23.17 for Kiruna.";
                }
            }
        }
        return null;
    };

    const handleUpdateDocument = async (data) => {
        const response = await API.updateDocument(existingDocument.document.id, data, selectedFiles);
        showNotification("Document modified successfully!", "success");
        updateDocumentList(response.document);
    };

    const handleCreateDocument = async (data) => {
        const response = await API.createDocument(data, selectedFiles);
        showNotification("Document saved successfully!", "success");
        setAllDocuments((prev) => [...prev, response.document]); // Update allDocuments
    };

    const updateDocumentList = (updatedDoc) => {
        setAllDocuments((prev) =>
            prev.map((doc) => (doc.id === updatedDoc.id ? updatedDoc : doc))
        );
    };

    const showNotification = (message, type) => {
        setNotification({ message, type });
        setTimeout(() => setNotification({ message: "", type: "" }), 3000);
    };

    const handleNextStep = () => {
        const validationMessage = handleValidation();
        if (validationMessage) {
            showNotification(validationMessage, "error");
        } else {
            setCurrentStep((prev) => Math.min(prev + 1, steps.length));
        }
    };

    const handlePreviousStep = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 0));
    };

    return (
        <div className={`form-container position-relative ${className}`}>
            {notification.message && (
                <div className={`notification ${notification.type}`}> {notification.message} </div>
            )}
            <ProgressBar
                percent={Math.min(Math.max((currentStep / (steps.length - 1)) * 100, 0), 100)}
                filledBackground="linear-gradient(to right, #4e8d1f, #3b6c14)"
            />
            {/* Progress bar */}
            <StepProgressBar currentStep={currentStep} steps={steps} setCurrentStep={setCurrentStep} existingDocument={existingDocument} />

            {/* Current step content */}
            <div className={`step-content ${steps[currentStep]?.className || ""}`}>
                {steps[currentStep]?.component}
            </div>

            <div className="d-flex justify-content-between mt-2">
                {currentStep > 0 && (
                    <Button type="button" className="danger ms-2" onClick={handlePreviousStep} variant="danger">Previous</Button>
                )}
                {currentStep < steps.length - 1 && (
                    <Button type="button" className="ms-2" onClick={handleNextStep} variant="primary"> Next </Button>
                )}
                {(existingDocument || currentStep == steps.length - 1) && (
                    <Button className="save-button ms-2" onClick={handleSaveForm} variant="success" > Save </Button>
                )}
            </div>

        </div>
    );
}

export function EditDocumentForm({
    coordinates,
    className,
}) {
    const { documentId } = useParams(); //Get the document ID
    const navigate = useNavigate();
    const [existingDocument, setExistingDocument] = useState();
    const [loading, setLoading] = useState(true); // Loading status
    const { isLoggedIn } = useContext(AppContext);


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
    }, [documentId]);

    if (!loading && existingDocument) {
        return (
            <DescriptionForm
                coordinates={coordinates}
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
