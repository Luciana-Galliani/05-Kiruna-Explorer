import React, { useState, useRef, useEffect } from "react";
import { Modal, Button, Form, Row, Col, Card } from "react-bootstrap";
import API from "../API/API.mjs";
import { useNavigate } from "react-router-dom";
import { Stakeholder, Connection } from "../models.mjs";

export default function DescriptionForm({ isLoggedIn, coordinates, handleChooseInMap, className }) {
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/login");
        }
    }, [isLoggedIn, navigate]);

    const [inputValues, setInputValues] = useState({
        title: "",
        stakeholders: [],
        issuanceYear: "",
        issuanceMonth: "",
        issuanceDay: "",
        type: "",
        language: "",
        pages: "",
        description: "",
        scale: "",
        planScale: "",
        allMunicipality: false,
        latitude: null,
        longitude: null,
        connections: [],
    });
    const [showModal, setShowModal] = useState(false);
    const [activeField, setActiveField] = useState("");
    const [isTypeOfEnabled, setIsTypeOfEnabled] = useState(false);
    const [stakeholderOptions, setStakeholderOptions] = useState([]);
    const [documentOptions, setDocumentOptions] = useState([]);
    const [relationshipOptions, setRelationshipOptions] = useState([]);

    const tempRef = useRef(null);
    const [notification, setNotification] = useState({ message: "", type: "" });

    const typeOptions = [
        "Design Document",
        "Informative document",
        "Prescriptive document",
        "Technical Document",
        "Agreement",
        "Conflict",
        "Consultation",
        "Action",
    ];
    const scaleOptions = ["Text", "Concept", "Blueprints/actions", "Plan"];

    const [document, setDocument] = useState("");
    const [relationship, setRelationship] = useState("");

    const showNotification = (message, type) => {
        setNotification({ message, type });
        setTimeout(() => setNotification({ message: "", type: "" }), 3000);
    };

    useEffect(() => {
        const fetchStakeholders = async () => {
            try {
                const resp = await API.getStakeholders();
                const stakeholderInstances = resp.stakeholders.map(
                    (item) => new Stakeholder(item.id, item.name, item.color)
                );
                setStakeholderOptions(stakeholderInstances);
            } catch (error) {
                console.error("Error fetching stakeholders:", error);
            }
        };

        const fetchRelationshipOptions = async () => {
            try {
                const resp = await API.getConnections();
                setRelationshipOptions(resp.connections);
            } catch (error) {
                console.error("Error fetching typeOf options:", error);
            }
        };
        const fetchDocuments = async () => {
            try {
                const resp = await API.getDocuments();
                setDocumentOptions(resp.documents);
            } catch (error) {
                console.error("Error fetching documents:", error);
            }
        };

        fetchDocuments();
        fetchRelationshipOptions();
        fetchStakeholders();
    }, []);

    useEffect(() => {
        if (coordinates) {
            setInputValues((prevValues) => ({
                ...prevValues,
                latitude: coordinates.latitude,
                longitude: coordinates.longitude,
            }));
        }
    }, [coordinates]);

    const handleInputFocus = (field) => {
        setActiveField(field);
        setShowModal(true);
        tempRef.current.focus(); // remove focus
    };

    const handleInputChange = (e) => {
        const { value } = e.target;

        if (activeField === "stakeholders") {
            const selectedStakeholder = stakeholderOptions.find((option) => option.name === value);
            setInputValues((prev) => {
                const stakeholders = prev.stakeholders.includes(selectedStakeholder)
                    ? prev.stakeholders.filter((item) => item !== selectedStakeholder)
                    : [...prev.stakeholders, selectedStakeholder];
                return { ...prev, stakeholders };
            });
        } else {
            setInputValues({ ...inputValues, [activeField]: value });
        }
    };

    const handleModalClose = () => {
        setShowModal(false);
        setTimeout(() => setActiveField(""), 300); // wait for animation end
    };

    const handleDocumentChange = (e) => {
        const selectedDocId = e.target.value;
        setDocument(Number(selectedDocId));
        setIsTypeOfEnabled(selectedDocId !== "");
    };

    const removeConnection = (index) => {
        console.log(inputValues.connections);
        setInputValues((prev) => ({
            ...prev,
            connections: prev.connections.filter((_, i) => i !== index),
        }));
        console.log(inputValues.connections);
    };

    const addConnection = () => {
        if (document && relationship) {
            const selectedDocument = documentOptions.find((doc) => doc.id === Number(document));

            if (selectedDocument) {
                const newConnection = new Connection(selectedDocument, relationship);
                setInputValues((prev) => ({
                    ...prev,
                    connections: [...prev.connections, newConnection],
                }));
                setDocument("");
                setRelationship("");
                setIsTypeOfEnabled(false);
            } else {
                showNotification("Document not found.", "error");
            }
        } else {
            showNotification("Please fill in both document and type.", "error");
        }
    };

    const handleSaveForm = async () => {
        let issuanceDate = inputValues.issuanceDate;

        if (inputValues.issuanceYear) {
            const year = inputValues.issuanceYear;
            const month = inputValues.issuanceMonth
                ? inputValues.issuanceMonth.padStart(2, "0")
                : "";
            const day = inputValues.issuanceDay ? inputValues.issuanceDay.padStart(2, "0") : "";

            if (month && day) {
                issuanceDate = `${year}-${month}-${day}`;
            } else if (month) {
                issuanceDate = `${year}-${month}`;
            } else {
                issuanceDate = `${year}`;
            }
        }

        const documentData = {
            title: inputValues.title,
            scaleType: inputValues.scale,
            scaleValue: inputValues.planScale || null,
            issuanceDate: issuanceDate,
            type: inputValues.type,
            language: inputValues.language,
            pages: inputValues.pages,
            description: inputValues.description,
            stakeholders: inputValues.stakeholders,
            allMunicipality: inputValues.allMunicipality,
            latitude: inputValues.latitude,
            longitude: inputValues.longitude,
            connections: inputValues.connections,
        };

        if (
            documentData.latitude &&
            (documentData.latitude < 67.5 || documentData.latitude > 68.5)
        ) {
            showNotification("Latitude must be between 67.5 and 68.5 for Kiruna.", "error");
            return;
        } else if (
            documentData.longitude &&
            (documentData.longitude < 20 || documentData.longitude > 21.5)
        ) {
            showNotification("Longitude must be between 20 and 21.5 for Kiruna.", "error");
            return;
        }

        if (inputValues.scaleValue && !/^1:\d{1,3}([.,]\d{3})*$/.test(inputValues.scaleValue)) {
            showNotification("Plan scale must follow the format 1:1,000", "error");
            return;
        }

        if (documentData.pages && !/^\d+(-\d+)?$/.test(documentData.pages)) {
            showNotification(
                "Please enter a single number or a range in the format '1-32' where the starting number is less than the ending number.",
                "error"
            );
            return;
        }

        if (
            !documentData.title ||
            !documentData.issuanceDate ||
            !documentData.type ||
            !documentData.description
        ) {
            showNotification("Please fill all mandatory fields.", "error");
            return;
        }

        if (!documentData.allMunicipality && (!documentData.latitude || !documentData.longitude)) {
            showNotification("Please enter latitude and longitude", "error");
            return;
        } else if (
            documentData.allMunicipality &&
            (documentData.latitude || documentData.longitude)
        ) {
            showNotification(
                'Please uncheck "All Municipality" if you want to enter latitude and longitude',
                "error"
            );
            return;
        } else if (
            documentData.allMunicipality &&
            !documentData.latitude &&
            !documentData.longitude
        ) {
            documentData.latitude = null;
            documentData.longitude = null;
        }

        if (coordinates) {
            coordinates.longitude = "";
            coordinates.latitude = "";
        }

        try {
            await API.createDocument(documentData);
            showNotification("Document saved successfully!", "success");
            navigate("/"); // Redirect to home page
        } catch (error) {
            console.error("Error saving document:", error);
            showNotification("Error saving document. Please try again.", "error");
        }
    };

    return (
        <div
            className={"container position-relative " + className}
            style={{
                padding: "20px",
                height: "90%",
                borderRadius: "0.375rem",
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                background: "rgba(255, 255, 255, 0.9)",
                color: "#333",
                zIndex: 1,
            }}
        >
            {notification.message && (
                <div
                    style={{
                        position: "absolute",
                        zIndex: 1,
                        top: "1rem",
                        left: "50%",
                        transform: "translateX(-50%)",
                        padding: "10px",
                        borderRadius: "5px",
                        color: notification.type === "success" ? "#155724" : "#721c24",
                        backgroundColor:
                            notification.type === "success" ? "#d4edda88" : "#f8d7daff",
                        borderColor: notification.type === "success" ? "#155724" : "#721c24",
                        border: "2px solid",
                        textAlign: "center",
                        fontWeight: "bold",
                        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                    }}
                >
                    {notification.message}
                </div>
            )}
            <Row style={{ height: "100%" }}>
                <Col
                    className="overflow-y-scroll h-100"
                    md={4}
                    style={{ msOverflowStyle: "none", scrollbarWidth: "none" }}
                >
                    <Form>
                        <Form.Group controlId="formTitle" className="mb-3">
                            <Form.Label
                                style={{ fontWeight: "bold", fontSize: "1.2rem", color: "black" }}
                            >
                                Title
                                <span className="text-danger ms-2 fw-bold">*</span>
                            </Form.Label>
                            <div className="d-flex align-items-center">
                                <Form.Control
                                    type="text"
                                    autoFocus
                                    required
                                    value={inputValues.title}
                                    onChange={(e) =>
                                        setInputValues({ ...inputValues, title: e.target.value })
                                    }
                                    placeholder="Click to enter the title"
                                />
                            </div>
                        </Form.Group>
                        <Form.Group controlId="formStakeholders" className="mb-3">
                            <Form.Label
                                style={{ fontWeight: "bold", fontSize: "1.2rem", color: "black" }}
                            >
                                Stakeholders
                                <span className="text-danger ms-2 fw-bold">*</span>
                            </Form.Label>
                            <div className="d-flex align-items-center">
                                <Form.Control
                                    type="text"
                                    value={inputValues.stakeholders.map((s) => s.name).join(", ")} // Display stakeholder names
                                    onFocus={() => handleInputFocus("stakeholders")}
                                    readOnly
                                    placeholder="Click to select stakeholders"
                                    required
                                />
                            </div>
                        </Form.Group>
                        <Form.Group className="mb-3 position-relative">
                            <Form.Label
                                style={{
                                    fontWeight: "bold",
                                    fontSize: "1.2rem",
                                    color: "black",
                                    marginBottom: "0",
                                }}
                            >
                                Issuance Date <span className="text-danger">*</span>
                                <div
                                    className="d-flex align-items-center gap-2"
                                    style={{ marginTop: ".5rem" }}
                                >
                                    <Form.Group controlId="issuanceYear" className="mb-0">
                                        <Form.Control
                                            type="number"
                                            name="issuanceYear"
                                            placeholder="YYYY"
                                            value={inputValues.issuanceYear}
                                            onChange={(e) =>
                                                setInputValues({
                                                    ...inputValues,
                                                    issuanceYear: e.target.value,
                                                })
                                            }
                                            min="1900"
                                            max="2100"
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="issuanceMonth" className="mb-0">
                                        <Form.Control
                                            type="number"
                                            name="issuanceMonth"
                                            placeholder="MM"
                                            value={inputValues.issuanceMonth}
                                            onChange={(e) =>
                                                setInputValues({
                                                    ...inputValues,
                                                    issuanceMonth: e.target.value,
                                                })
                                            }
                                            min="1"
                                            max="12"
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="issuanceDay" className="mb-0">
                                        <Form.Control
                                            type="number"
                                            name="issuanceDay"
                                            placeholder="DD"
                                            value={inputValues.issuanceDay}
                                            onChange={(e) =>
                                                setInputValues({
                                                    ...inputValues,
                                                    issuanceDay: e.target.value,
                                                })
                                            }
                                            min="1"
                                            max="31"
                                        />
                                    </Form.Group>
                                </div>
                            </Form.Label>
                        </Form.Group>
                        <Form.Group controlId="formType" className="mb-3">
                            <Form.Label
                                style={{ fontWeight: "bold", fontSize: "1.2rem", color: "black" }}
                            >
                                Type
                                <span className="text-danger ms-2 fw-bold">*</span>
                            </Form.Label>
                            <div className="d-flex align-items-center">
                                <Form.Control
                                    as="select"
                                    value={inputValues.type}
                                    onChange={(e) =>
                                        setInputValues({ ...inputValues, type: e.target.value })
                                    }
                                    required
                                >
                                    <option value="">Select a type</option>
                                    {typeOptions.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </Form.Control>
                            </div>
                        </Form.Group>
                        <Form.Group controlId="formScale" className="mb-3">
                            <Form.Label
                                style={{ fontWeight: "bold", fontSize: "1.2rem", color: "black" }}
                            >
                                Scale
                                <span className="text-danger ms-2 fw-bold">*</span>
                            </Form.Label>
                            <div style={{ display: "flex", gap: "1rem" }}>
                                <Form.Control
                                    as="select"
                                    value={inputValues.scale}
                                    onChange={(e) =>
                                        setInputValues({ ...inputValues, scale: e.target.value })
                                    }
                                    style={{ flex: "1" }}
                                    required
                                >
                                    <option value="">Select a scale</option>
                                    {scaleOptions.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </Form.Control>
                                {inputValues.scale === "Plan" && (
                                    <Form.Control
                                        type="text"
                                        value={inputValues.planScale}
                                        onChange={(e) =>
                                            setInputValues({
                                                ...inputValues,
                                                planScale: e.target.value,
                                            })
                                        }
                                        placeholder="Plan scale (e.g. 1:1,000)"
                                        style={{ flex: "3" }}
                                    />
                                )}
                            </div>
                        </Form.Group>

                        <Form.Group controlId="formLanguage" className="mb-3">
                            <Form.Label
                                style={{ fontWeight: "bold", fontSize: "1.2rem", color: "black" }}
                            >
                                Language
                            </Form.Label>
                            <Form.Control
                                type="text"
                                value={inputValues.language}
                                onChange={(e) =>
                                    setInputValues({ ...inputValues, language: e.target.value })
                                }
                                placeholder="Click to enter language"
                            />
                        </Form.Group>
                        <Form.Group controlId="formPages" className="mb-3">
                            <Form.Label
                                style={{ fontWeight: "bold", fontSize: "1.2rem", color: "black" }}
                            >
                                Pages
                            </Form.Label>
                            <Form.Control
                                type="text"
                                value={inputValues.pages}
                                onChange={(e) =>
                                    setInputValues({ ...inputValues, pages: e.target.value })
                                }
                                placeholder="Enter number of pages"
                            />
                        </Form.Group>
                    </Form>
                </Col>
                <Col md={4}>
                    <fieldset className="blurred-fieldset">
                        <legend className="legend">
                            Georeference
                            <span className="text-danger ms-2 fw-bold">*</span>
                        </legend>
                        <Form.Group controlId="formAllMunicipality" className="mb-3">
                            <Form.Check
                                type="checkbox"
                                label="All Municipality"
                                checked={inputValues.allMunicipality}
                                onChange={(e) =>
                                    setInputValues({
                                        ...inputValues,
                                        longitude: null,
                                        latitude: null,
                                        allMunicipality: e.target.checked,
                                    })
                                }
                            />
                        </Form.Group>
                        <Form.Group controlId="formLatitude" className="mb-3">
                            <Form.Label
                                style={{
                                    fontWeight: "bold",
                                    fontSize: "1.2rem",
                                    color: "black",
                                }}
                            >
                                Latitude
                            </Form.Label>
                            <Form.Control
                                type="number"
                                value={inputValues.latitude || ""}
                                onChange={(e) =>
                                    setInputValues({ ...inputValues, latitude: e.target.value })
                                }
                                placeholder="Enter latitude"
                                disabled={inputValues.allMunicipality}
                            />
                        </Form.Group>
                        <Form.Group controlId="formLongitude" className="mb-3">
                            <Form.Label
                                style={{
                                    fontWeight: "bold",
                                    fontSize: "1.2rem",
                                    color: "black",
                                }}
                            >
                                Longitude
                            </Form.Label>
                            <Form.Control
                                type="number"
                                value={inputValues.longitude || ""}
                                onChange={(e) =>
                                    setInputValues({ ...inputValues, longitude: e.target.value })
                                }
                                placeholder="Enter longitude"
                                disabled={inputValues.allMunicipality}
                            />
                        </Form.Group>
                        <Button
                            variant="primary"
                            onClick={handleChooseInMap}
                            disabled={inputValues.allMunicipality}
                            className="d-block mx-auto"
                        >
                            Choose on the Map
                        </Button>
                    </fieldset>
                    <Form>
                        <fieldset className="blurred-fieldset">
                            <legend className="legend">Add a connection</legend>
                            <Form.Group controlId="formDocument" className="mb-3">
                                <Form.Label
                                    style={{
                                        fontWeight: "bold",
                                        fontSize: "1.2rem",
                                        color: "black",
                                    }}
                                >
                                    Document
                                </Form.Label>
                                <Form.Control
                                    as="select"
                                    value={document}
                                    onChange={handleDocumentChange}
                                >
                                    <option value="">Select a document</option>
                                    {documentOptions.map((doc) => (
                                        <option key={doc.id} value={doc.id}>
                                            {doc.title}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId="formRelationship" className="mb-3">
                                <Form.Label
                                    style={{
                                        fontWeight: "bold",
                                        fontSize: "1.2rem",
                                        color: "black",
                                    }}
                                >
                                    Type Of Connection
                                </Form.Label>
                                <Form.Control
                                    as="select"
                                    value={relationship}
                                    onChange={(e) => setRelationship(e.target.value)}
                                    disabled={!isTypeOfEnabled}
                                >
                                    <option value="">Select type</option>
                                    {relationshipOptions
                                        .filter((option) => {
                                            // Verifica se la connessione con quel tipo di relazione è già presente
                                            const isOptionAlreadyConnected =
                                                inputValues.connections.some(
                                                    (connection) =>
                                                        connection.document.id === document &&
                                                        connection.relationship === option
                                                );
                                            return !isOptionAlreadyConnected; // Escludi le opzioni già connesse
                                        })
                                        .map((option, index) => (
                                            <option key={index} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                </Form.Control>
                            </Form.Group>

                            <Button
                                variant="primary"
                                onClick={addConnection}
                                className="my-2 d-block mx-auto"
                                disabled={!document || !relationship}
                            >
                                Add Connection
                            </Button>
                        </fieldset>
                    </Form>
                </Col>
                <Col md={4} className="d-flex flex-column h-100">
                    <Form.Group controlId="formDescription" className="mb-3">
                        <Form.Label
                            style={{ fontWeight: "bold", fontSize: "1.2rem", color: "black" }}
                        >
                            Description
                            <span className="text-danger ms-2 fw-bold">*</span>
                        </Form.Label>
                        <div className="d-flex align-items-center">
                            <Form.Control
                                as="textarea"
                                rows={5}
                                value={inputValues.description}
                                onChange={(e) =>
                                    setInputValues({ ...inputValues, description: e.target.value })
                                }
                                required
                                placeholder="Click to enter description"
                            />
                        </div>
                    </Form.Group>
                    <p style={{ fontWeight: "bold", fontSize: "1.2rem", color: "black" }}>
                        Connections :
                    </p>
                    <div className="connections overflow-y-auto">
                        {inputValues.connections.map((connection, index) => (
                            <Card key={index} className="mb-2 me-1 position-relative">
                                <button
                                    onClick={() => removeConnection(index)}
                                    style={{
                                        border: "none",
                                        background: "none",
                                        padding: "0",
                                        cursor: "pointer",
                                        position: "absolute",
                                        top: "2px",
                                        right: "2px",
                                        fontSize: "1rem",
                                        color: "red",
                                    }}
                                >
                                    ✖
                                </button>
                                <Card.Body>
                                    <Card.Text>
                                        <strong>Document:</strong> {connection.document.title}
                                    </Card.Text>
                                    <Card.Text>
                                        <strong>Type:</strong> {connection.relationship}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        ))}
                    </div>
                </Col>
            </Row>

            <input
                ref={tempRef}
                id="tempInputToRemoveFocus"
                style={{ position: "absolute", left: "-9999px" }}
            />

            <Modal show={showModal} onHide={handleModalClose} centered>
                <Modal.Body>
                    {activeField === "stakeholders" && (
                        <div className="d-flex flex-wrap justify-content-evenly">
                            {stakeholderOptions.length === 0 ? (
                                <p>Loading stakeholders...</p>
                            ) : (
                                stakeholderOptions.map((option) => (
                                    <Form.Check
                                        key={option.id}
                                        type="checkbox"
                                        id={option.id}
                                        label={option.name}
                                        value={option.name}
                                        checked={inputValues.stakeholders.includes(option)} // Check if object is in array
                                        onChange={handleInputChange}
                                        style={{ width: "35%" }}
                                    />
                                ))
                            )}
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="primary"
                        onClick={handleModalClose}
                        className="d-block mx-auto"
                    >
                        OK
                    </Button>
                </Modal.Footer>
            </Modal>
            <Button
                variant="primary"
                onClick={handleSaveForm}
                className="mx-auto d-block position-absolute bottom-0 start-50 translate-middle"
                style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)" }}
            >
                Save Document
            </Button>
        </div>
    );
}
