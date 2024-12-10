import React, { useState, useEffect, useContext } from "react";
import { Button, Card, Form, Dropdown } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import API from "../API/API.mjs";
import { Stakeholder } from "../models.mjs";
import { GeneralPart } from "./GeneralPart.jsx";
import { TechnicalPart } from "./Technicalpart.jsx";
import { LinkPart } from "./LinkPart.jsx";
import { GeoPart } from "./GeoPart.jsx";
import { AppContext } from "../context/AppContext.jsx";
import { ProgressBar } from "react-step-progress-bar";
import PropTypes from "prop-types";
import { point, booleanPointInPolygon } from "@turf/turf";
import StepProgressBar from "./StepProgressBar.jsx";
import { booleanWithin } from "@turf/turf";


// Function to initialize form values
const initializeInputValues = (doc) => {
    const defaultDate = ["", "", ""];
    const dateParts = doc?.document?.issuanceDate?.split("-") || defaultDate;

    return {
        title: doc?.document?.title || "",
        stakeholders: doc?.document?.stakeholders || [],
        otherStakeholderName: doc?.document?.otherStakeholderName || "",
        scaleType: doc?.document?.scaleType || "",
        issuanceYear: dateParts[0] || "",
        issuanceMonth: dateParts[1] || "",
        issuanceDay: dateParts[2] || "",
        type: doc?.document?.type || "",
        otherDocumentType: doc?.document?.otherDocumentType || "",
        language:
            doc?.document?.language && doc?.document?.language !== "-" ? doc.document.language : "",
        pages: doc?.document?.pages && doc?.document?.pages !== "-" ? doc.document.pages : "",
        description: doc?.document?.description || "",
        scaleValue: doc?.document?.scaleValue || "",
        allMunicipality: doc?.document?.allMunicipality || false,
        latitude: parseFloat(doc?.document?.latitude) || "",
        longitude: parseFloat(doc?.document?.longitude) || "",
        connections: doc?.document?.connections || [],
        areaId: doc?.document?.areaId || "",
        areaName: "",
    };
};

export function DescriptionForm({
    coordinates,
    existingDocument,
    className,
    setCoordinates,
    newarea,
    setnewArea,
}) {
    const navigate = useNavigate();
    const [inputValues, setInputValues] = useState(() => initializeInputValues(existingDocument));
    const [stakeholderOptions, setStakeholderOptions] = useState([]);
    const [relationshipOptions, setRelationshipOptions] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [notification, setNotification] = useState({ message: "", type: "" });
    const [currentStep, setCurrentStep] = useState(0);
    const [validSteps, setValidSteps] = useState([]);
    const {
        isLoggedIn,
        setAllDocuments,
        isSelectingArea,
        setIsSelectingArea,
        setAreaGeoJSON,
        setIsSelectingCoordinates,
    } = useContext(AppContext);
    const [kirunaGeoJSON, setKirunaGeoJSON] = useState(null);
    const [selectedArea, setSelectedArea] = useState("");
    const [second, setSecond] = useState(false);
    const [areas, setAreas] = useState([]);
    const [newAreaName, setNewAreaName] = useState("");
    const [area, setArea] = useState("");
    const handleChooseInMap = () => {
        setIsSelectingCoordinates(true);
        setAreaGeoJSON(null);
        setnewArea(null);
        setArea(null);
        setNewAreaName(null);
        setInputValues((prev) => ({
            ...prev,
            areaId: null,
            areaName: "",
        }));
        setAreas((prevAreas) => prevAreas.filter((area) => area.id !== null));
    };

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
            component: (
                <GeoPart
                    inputValues={inputValues}
                    setInputValues={setInputValues}
                    setSecond={setSecond}
                    handleChooseInMap={handleChooseInMap}
                />
            ),
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

    useEffect(() => {
        if (newarea) {
            setArea(newarea);
            setSelectedArea(newarea.name);
        }
    }, [newarea]);

    // Validation function for form data
    useEffect(() => {
        fetchInitialData();
        if (existingDocument) fetchFiles();
    }, []);

    useEffect(() => {
        if (!inputValues.areaName && inputValues.areaId) {
            const matchingArea = areas.find((area) => area.id === inputValues.areaId);
            if (matchingArea) {
                setInputValues((prev) => ({ ...prev, areaName: matchingArea.name }));
                setSelectedArea(matchingArea.name);
            }
        }
    }, [inputValues.areaId, inputValues.areaName, areas, setInputValues]);

    useEffect(() => {
        if (coordinates?.latitude && coordinates?.longitude) {
            setInputValues((prev) => ({
                ...prev,
                latitude: coordinates.latitude,
                longitude: coordinates.longitude,
            }));
        }
    }, [coordinates]);

    useEffect(() => {
        const loadAreas = async () => {
            try {
                const fetchedAreas = await API.fetchAreas();
                setAreas(fetchedAreas);
            } catch (error) {
                console.error("Failed to load areas:", error);
            }
        };
        loadAreas();
    }, [newarea, area]);

    const handleSaveArea = () => {
        if (area && !newAreaName && !selectedArea) {
            showNotification("Please provide the name of the area", "error");
            return;
        }

        const areaToSave = selectedArea || newAreaName;

        if (areaToSave) {
            const geojson = {
                type: "Polygon",
                coordinates: [area],
            };

            if (!kirunaGeoJSON || kirunaGeoJSON.type !== "FeatureCollection") {
                showNotification("GeoJSON data for Kiruna is not loaded or invalid.", "error");
                return;
            }

            const isAreaInsideKiruna = kirunaGeoJSON.features.some((feature) => {
                if (feature.geometry.type === "MultiPolygon") {
                    return feature.geometry.coordinates.some((polygonCoordinates) => {
                        const polygon = { type: "Polygon", coordinates: polygonCoordinates };
                        return booleanWithin(geojson, polygon);
                    });
                }
                return false;
            });

            if (!isAreaInsideKiruna) {
                showNotification("The selected area must be inside the Kiruna region.", "error");
                return;
            }

            setSelectedArea(areaToSave);
            setInputValues((prev) => ({
                ...prev,
                areaName: areaToSave,
            }));

            if (newAreaName) {
                const areaData = {
                    idArea: null,
                    name: newAreaName,
                    geojson: geojson,
                };
                setAreas((prevAreas) => [...prevAreas, areaData]);
            }
        }

        setSecond(false);
        setIsSelectingArea(false);
        setAreaGeoJSON(null);

        setInputValues((prev) => ({
            ...prev,
            longitude: null,
            latitude: null,
            allMunicipality: false,
        }));
    };


    const handleSelectExistingArea = (areaselected) => {
        const geojson = areaselected?.geojson || null;

        if (!geojson) {
            const matchingArea = areas.find((area) => area.name === areaselected.name);
            if (matchingArea) {
                areaselected.geojson = matchingArea.geojson; // Aggiungi geojson all'area selezionata
            }
        }

        // Imposta l'area se l'area selezionata non è la stessa del newAreaName
        if (areaselected.name !== newAreaName) {
            setAreas((prevAreas) => prevAreas.filter((area) => area.id !== null));
            setArea(areas.find((area) => area.name === areaselected.name) || null);
            setNewAreaName("");
        }

        // Aggiorna i valori del form
        setSelectedArea(areaselected.name);
        setAreaGeoJSON(areaselected.geojson || area);

        setInputValues((prev) => ({
            ...prev,
            selectedArea: areaselected.name,
            allMunicipality: false,
        }));
    };

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
            const [stakeholderResp, relationshipResp, documentsResp, geoJSONData] =
                await Promise.all([
                    API.getStakeholders(),
                    API.getConnections(),
                    API.getDocuments(),
                    API.getBoundaries(),
                ]);

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
    const handleCreateArea = () => {
        setIsSelectingArea((prev) => !prev);
        if (!isSelectingArea) {
            setSelectedArea("");
            setNewAreaName("");
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
            areaId: inputValues.allMunicipality ? null : inputValues.areaId,
            areaName: inputValues.allMunicipality ? null : inputValues.areaName,
        };
    };

    const handleValidation = (validateAllSteps = false) => {
        let validationMessage = null;

        if (validateAllSteps || currentStep === 0) {
            validationMessage = validateStep0();
        }

        if (!validationMessage && (validateAllSteps || currentStep === 1)) {
            validationMessage = validateStep1();
        }

        if (!validationMessage && (validateAllSteps || currentStep === 2)) {
            validationMessage = validateStep2();
        }

        return validationMessage;
    };

    const validateStep0 = () => {
        if (
            !inputValues.title ||
            !inputValues.stakeholders.length ||
            !inputValues.description ||
            !inputValues.issuanceYear
        ) {
            return "Please complete title, stakeholders, description, and issuance date.";
        }
        setValidSteps((prev) => [...prev, 0]);
        return null;
    };

    const validateStep1 = () => {
        if (!inputValues.type || !inputValues.scaleType) {
            return "Please complete type and scale.";
        }
        if (inputValues.pages && !/^(\d+|\d+-\d+)$/.test(inputValues.pages)) {
            return "Pages must be a number or a range (e.g., 1-32).";
        }
        setValidSteps((prev) => [...prev, 1]);
        return null;
    };

    const validateStep2 = () => {
        if (inputValues.allMunicipality || inputValues.areaName) {
            setValidSteps((prev) => [...prev, 2]);
            return null;
        }
        if (inputValues.latitude && inputValues.longitude) {
            return validateCoordinates();
        }
        return "Please provide either all municipality, an area, or valid coordinates.";
    };

    const validateCoordinates = () => {
        if (
            kirunaGeoJSON &&
            kirunaGeoJSON.type === "FeatureCollection" &&
            kirunaGeoJSON.features
        ) {
            const multipolygon = kirunaGeoJSON.features[0].geometry;
            if (multipolygon.type === "MultiPolygon") {
                return checkPointInKiruna(multipolygon);
            }
            return "GeoJSON is not a MultiPolygon.";
        }
        return "GeoJSON data for Kiruna is not loaded or has an invalid structure.";
    };

    const checkPointInKiruna = (multipolygon) => {
        const userPoint = point([inputValues.longitude, inputValues.latitude]);
        const isInsideKiruna = multipolygon.coordinates.some((polygonCoordinates) => {
            const polygon = { type: "Polygon", coordinates: polygonCoordinates };
            return booleanPointInPolygon(userPoint, polygon);
        });

        if (isInsideKiruna) {
            setValidSteps((prev) => [...prev, 2]);
            return null;
        }
        return "The coordinates must be inside the Kiruna region.";
    };


    const handleUpdateDocument = async (data) => {
        try {
            let areaId = null;

            if (newAreaName) {
                const geojson = {
                    type: "Polygon",
                    coordinates: [area],
                };

                const areaData = {
                    name: inputValues.areaName,
                    geojson: geojson,
                };


                const createdArea = await API.createArea(areaData);
                areaId = createdArea.area.id;
            } else if (selectedArea && (!inputValues.latitude && !inputValues.longitude)) {
                const selected = areas.find((area) => area.name === selectedArea);
                areaId = selected ? selected.id : null;
            }

            setArea(null);
            setnewArea(null);

            const documentData = {
                ...data,
                areaId,
            };

            const response = await API.updateDocument(
                existingDocument.document.id,
                documentData,
                selectedFiles
            );

            showNotification("Document updated successfully!", "success");

            setCoordinates((prev) => ({
                ...prev,
                latitude: null,
                longitude: null,
            }));

            updateDocumentList(response.document);
        } catch (error) {
            console.error("Error updating document:", error);
            showNotification("Error updating document. Please try again.", "error");
        }
    };

    const handleCreateDocument = async (data) => {
        try {
            let areaId = null;
            if (newAreaName) {
                const geojson = {
                    type: "Polygon",
                    coordinates: [area],
                };

                const areaData = {
                    name: inputValues.areaName,
                    geojson: geojson,
                };
                const createdArea = await API.createArea(areaData);
                areaId = createdArea.area.id;
            } else if (selectedArea) {
                const selected = areas.find((area) => area.name === selectedArea);
                areaId = selected ? selected.id : null;
            }
            setArea(null);
            setnewArea(null);
            const documentData = {
                ...data,
                areaId,
            };
            const response = await API.createDocument(documentData, selectedFiles);
            showNotification("Document saved successfully!", "success");

            setCoordinates((prev) => ({
                ...prev,
                latitude: null,
                longitude: null,
            }));

            setAllDocuments((prev) => [...prev, response.document]);
        } catch (error) {
            console.error("Error creating document:", error);
            showNotification("Error saving document. Please try again.", "error");
        }
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
        <>
            {!second ? (
                <div className={`form-container position-absolute ${className}`}>
                    {notification.message && (
                        <div className={`notification ${notification.type}`}>
                            {" "}
                            {notification.message}{" "}
                        </div>
                    )}
                    <ProgressBar
                        percent={Math.min(
                            Math.max((currentStep / (steps.length - 1)) * 100, 0),
                            100
                        )}
                        filledBackground="linear-gradient(to right, #4e8d1f, #3b6c14)"
                    />{" "}
                    <StepProgressBar
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
            ) : (
                <div
                    style={{
                        position: "absolute",
                        top: "10%",
                        left: "5%",
                        minWidth: "350px",
                        zIndex: 1000,
                    }}
                >
                    {notification.message && (
                        <div className={`notification ${notification.type}`}>
                            {" "}
                            {notification.message}{" "}
                        </div>
                    )}
                    <Card>
                        <Card.Body>
                            <Form>
                                <Form.Group controlId="formSelectArea" className="mb-2">
                                    <h5 className="display-6 mb-3">Manage Area</h5>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <Dropdown className="me-2 flex-grow-1">
                                            <Dropdown.Toggle
                                                style={{
                                                    backgroundColor: "white",
                                                    color: "black",
                                                    border: "1px solid #ccc",
                                                    width: "100%",
                                                }}
                                                id="dropdown-basic"
                                            >
                                                {selectedArea ? selectedArea : "No Area Selected"}
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu>
                                                {areas.map((area, index) => (
                                                    <Dropdown.Item
                                                        key={area.name}
                                                        onClick={() =>
                                                            handleSelectExistingArea(area)
                                                        }
                                                    >
                                                        {area.name}
                                                    </Dropdown.Item>
                                                ))}
                                            </Dropdown.Menu>
                                        </Dropdown>
                                        <Button variant="dark" onClick={handleCreateArea}>
                                            {area?.length > 0 ? `Change Area` : `Draw Area`}
                                        </Button>
                                    </div>
                                    <div className="m-2 text-center">
                                        <strong>Selected Area:</strong> {selectedArea || "-"}
                                    </div>
                                </Form.Group>

                                <Form.Group controlId="formAreaName" className="mb-3">
                                    <Form.Label>New area name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter area name"
                                        value={newAreaName}
                                        onChange={(e) => setNewAreaName(e.target.value)}
                                        disabled={selectedArea}
                                    />
                                </Form.Group>
                                <div className="d-flex justify-content-between">
                                    <Button
                                        className="w-50"
                                        variant="primary"
                                        onClick={handleSaveArea}
                                    >
                                        OK
                                    </Button>
                                    <Button
                                        variant="danger"
                                        className="ms-2 w-50"
                                        onClick={() => {
                                            setIsSelectingArea(false);
                                            setSecond(false);
                                            setAreaGeoJSON("");
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </div>
            )}
        </>
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
    newarea: PropTypes.array,
    setnewArea: PropTypes.func,
};

