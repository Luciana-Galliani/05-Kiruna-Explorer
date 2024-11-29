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
import PropTypes from 'prop-types';
import { point, booleanPointInPolygon } from "@turf/turf";
import { GeoJSON } from 'ol/format';



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
        language:
            doc?.document?.language && doc?.document?.language !== "-" ? doc.document.language : "",
        pages: doc?.document?.pages && doc?.document?.pages !== "-" ? doc.document.pages : "",
        description: doc?.document?.description || "",
        planScale: doc?.document?.scaleValue || "",
        allMunicipality: doc?.document?.allMunicipality || false,
        latitude: parseFloat(doc?.document?.latitude) || null,
        longitude: parseFloat(doc?.document?.longitude) || null,
        connections: doc?.document?.connections || [],
    };
};

const StepProgressBar = ({ currentStep, steps, setCurrentStep, validSteps, existingDocument }) => {
    return (
        <div className="step-progress-bar">
            {steps.map((step, index) => {
                const isActive = existingDocument || validSteps.includes(index) || index <= currentStep;
                return (
                    <button
                        key={index}
                        className={`step ${isActive ? "active" : ""} custom-button`}
                        onClick={() => isActive && setCurrentStep(index)}
                        onKeyDown={(e) => {
                            if (isActive && (e.key === "Enter" || e.key === " ")) {
                                setCurrentStep(index);
                            }
                        }}
                        aria-disabled={!isActive}
                    >
                        <div className={`circle ${isActive ? "blue" : ""}`}>{index + 1}</div>
                        <div className="label">{step.label}</div>
                    </button>
                );
            })}
        </div>
    );
};




export function DescriptionForm({ coordinates, existingDocument, className, setCoordinates }) {
    const navigate = useNavigate();
    const [inputValues, setInputValues] = useState(() => initializeInputValues(existingDocument));
    const [stakeholderOptions, setStakeholderOptions] = useState([]);
    const [relationshipOptions, setRelationshipOptions] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [notification, setNotification] = useState({ message: "", type: "" });
    const [currentStep, setCurrentStep] = useState(0);
    const [validSteps, setValidSteps] = useState([]);  // Stato per tracciare gli step validati
    const { isLoggedIn, setAllDocuments } = useContext(AppContext);
    const [kirunaGeoJSON, setKirunaGeoJSON] = useState(null);


    const steps = [
        {
            label: "General Info",
            component: (
                <GeneralPart
                    inputValues={inputValues}
                    setInputValues={setInputValues}
                    stakeholderOptions={stakeholderOptions}
                />
            ),
        },
        {
            label: "Technical Info",
            component: (
                <TechnicalPart
                    inputValues={inputValues}
                    setInputValues={setInputValues}
                    selectedFiles={selectedFiles}
                    setSelectedFiles={setSelectedFiles}
                />
            ),
        },
        {
            label: "Geographic Info",
            component: <GeoPart inputValues={inputValues} setInputValues={setInputValues} />,
        },
        {
            label: "Linked Documents",
            component: (
                <LinkPart
                    inputValues={inputValues}
                    setInputValues={setInputValues}
                    relationshipOptions={relationshipOptions}
                />
            ),
        },
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
        if (coordinates && coordinates.latitude && coordinates.longitude) {
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
            const [stakeholderResp, relationshipResp, documentsResp, geoJSONResp] = await Promise.all([
                API.getStakeholders(),
                API.getConnections(),
                API.getDocuments(),
                fetch("/kiruna.geojson"),
            ]);

            const geoJSONData = await geoJSONResp.json();

            setStakeholderOptions(
                stakeholderResp.stakeholders.map(
                    (item) => new Stakeholder(item.id, item.name, item.color)
                )
            );
            setRelationshipOptions(relationshipResp.connections);
            setAllDocuments(documentsResp.documents);
            setKirunaGeoJSON(geoJSONData);
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
        if (inputValues.issuanceMonth)
            issuanceDate += `-${inputValues.issuanceMonth.padStart(2, "0")}`;
        if (inputValues.issuanceDay) issuanceDate += `-${inputValues.issuanceDay.padStart(2, "0")}`;

        return {
            ...inputValues,
            issuanceDate,
            latitude: inputValues.allMunicipality ? null : inputValues.latitude,
            longitude: inputValues.allMunicipality ? null : inputValues.longitude,
        };
    };

    const handleValidation = (validateAllSteps = false) => {
        let validationMessage = null;

        // Step 0: Verifica dei campi principali
        if (validateAllSteps || currentStep === 0) {
            if (
                !inputValues.title ||
                !inputValues.stakeholders.length ||
                !inputValues.description ||
                !inputValues.issuanceYear
            ) {
                validationMessage = "Please complete title, stakeholders, description, and issuance date.";
            } else {
                setValidSteps((prev) => [...prev, 0]);
            }
        }

        // Step 1: Verifica tipo e pagine
        if (validateAllSteps || currentStep === 1) {
            if (!inputValues.type || !inputValues.scaleType) {
                validationMessage = "Please complete type and scale type.";
            }
            if (inputValues.pages && !/^(\d+|\d+-\d+)$/.test(inputValues.pages)) {
                validationMessage = "Pages must be a number or a range (e.g., 1-32).";
            } else {
                setValidSteps((prev) => [...prev, 1]);
            }
        }

        // Step 2: Verifica latitudine/longitudine e GeoJSON
        if (validateAllSteps || currentStep === 2) {
            if (!inputValues.allMunicipality) {
                if (!inputValues.latitude || !inputValues.longitude) {
                    validationMessage = "Please provide latitude and longitude.";
                } else {
                    // Verifica la presenza di GeoJSON e la sua struttura
                    if (kirunaGeoJSON && kirunaGeoJSON.type === 'FeatureCollection' && kirunaGeoJSON.features) {
                        const multipolygon = kirunaGeoJSON.features[0].geometry;

                        // Verifica che la geometria sia un MultiPolygon
                        if (multipolygon.type === 'MultiPolygon') {
                            const userPoint = point([inputValues.longitude, inputValues.latitude]);

                            // Verifica se il punto è all'interno di uno dei poligoni del MultiPolygon
                            const isInsideKiruna = multipolygon.coordinates.some(polygonCoordinates => {
                                const polygon = { type: 'Polygon', coordinates: polygonCoordinates };
                                return booleanPointInPolygon(userPoint, polygon);
                            });

                            // Se il punto non è all'interno, imposta il messaggio di errore
                            if (!isInsideKiruna) {
                                validationMessage = "The coordinates must be inside the Kiruna region.";
                            } else {
                                setValidSteps((prev) => [...prev, 2]);
                            }
                        } else {
                            validationMessage = "GeoJSON is not a MultiPolygon.";
                        }
                    } else {
                        validationMessage = "GeoJSON data for Kiruna is not loaded or has an invalid structure.";
                    }
                }
            } else {
                setValidSteps((prev) => [...prev, 2]);
            }
        }

        return validationMessage;
    };


    const handleUpdateDocument = async (data) => {
        const response = await API.updateDocument(
            existingDocument.document.id,
            data,
            selectedFiles
        );
        showNotification("Document modified successfully!", "success");
        setCoordinates((prev) => ({
            ...prev,
            latitude: null,
            longitude: null
        }));
        updateDocumentList(response.document);
    };

    const handleCreateDocument = async (data) => {
        const response = await API.createDocument(data, selectedFiles);
        showNotification("Document saved successfully!", "success");
        setCoordinates((prev) => ({
            ...prev,
            latitude: null,
            longitude: null
        }));
        setAllDocuments((prev) => [...prev, response.document]); // Update allDocuments
    };

    const updateDocumentList = (updatedDoc) => {
        setAllDocuments((prev) => prev.map((doc) => (doc.id === updatedDoc.id ? updatedDoc : doc)));
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
        <div className={`form-container position-absolute ${className}`}>
            {notification.message && (
                <div className={`notification ${notification.type}`}> {notification.message} </div>
            )}
            <ProgressBar
                percent={Math.min(Math.max((currentStep / (steps.length - 1)) * 100, 0), 100)}
                filledBackground="linear-gradient(to right, #4e8d1f, #3b6c14)"
            />            <StepProgressBar
                currentStep={currentStep}
                steps={steps}
                setCurrentStep={setCurrentStep}
                validSteps={validSteps}
                setValidSteps={setValidSteps}
                existingDocument={existingDocument}
            />

            {/* Current step content */}
            <div className={`step-content ${steps[currentStep]?.className || ""}`}>
                {steps[currentStep]?.component}
            </div>

            <div className="d-flex gap-5 mt-2">
                {currentStep === 0 ? (
                    <div style={{ flex: 1 }}></div>
                ) : (
                    <Button
                        type="button"
                        className="danger"
                        style={{ flex: 1 }}
                        onClick={handlePreviousStep}
                        variant="danger"
                    >
                        Previous
                    </Button>
                )}
                {!existingDocument && currentStep != steps.length - 1 ? (
                    <div style={{ flex: 1 }}></div>
                ) : (
                    <Button
                        className="save-button"
                        onClick={handleSaveForm}
                        variant="success"
                        style={{ flex: 1 }}
                    >
                        Save
                    </Button>
                )}
                {currentStep === steps.length - 1 ? (
                    <div style={{ flex: 1 }}></div>
                ) : (
                    <Button
                        type="button"
                        className="danger"
                        onClick={handleNextStep}
                        variant="primary"
                        style={{ flex: 1 }}
                    >
                        Next
                    </Button>
                )}
            </div>
        </div>
    );
}

DescriptionForm.propTypes = {
    coordinates: PropTypes.shape({
        latitude: PropTypes.number,
        longitude: PropTypes.number,
    }),
    existingDocument: PropTypes.object,
    className: PropTypes.string,
    setCoordinates: PropTypes.func.isRequired,
};

export function EditDocumentForm({ coordinates, className, setCoordinates }) {
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
                setCoordinates={setCoordinates}
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

EditDocumentForm.propTypes = {
    coordinates: PropTypes.shape({
        latitude: PropTypes.number,
        longitude: PropTypes.number,
    }),
    className: PropTypes.string,
    setCoordinates: PropTypes.func.isRequired,
};

StepProgressBar.propTypes = {
    currentStep: PropTypes.number.isRequired,
    steps: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            component: PropTypes.node.isRequired,
        })
    ).isRequired,
    setCurrentStep: PropTypes.func.isRequired,
    validSteps: PropTypes.arrayOf(PropTypes.number).isRequired,
    existingDocument: PropTypes.object,
};
