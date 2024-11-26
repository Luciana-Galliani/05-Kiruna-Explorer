import React, { useState, useContext, useEffect } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { Connection } from "../models.mjs";
import { AppContext } from "../context/AppContext";

export function LinkPart({
    inputValues,
    setInputValues,
    relationshipOptions
}) {
    const [isTypeOfEnabled, setIsTypeOfEnabled] = useState(false);
    const [document, setDocument] = useState("");
    const [relationship, setRelationship] = useState("");
    const { allDocuments } = useContext(AppContext); // UseContext per allDocuments
    const [searchTerm, setSearchTerm] = useState(""); // Initialize as an empty string
    const [filteredDocuments, setFilteredDocuments] = useState(allDocuments);

    useEffect(() => {
        setFilteredDocuments(
            allDocuments.filter((doc) =>
                doc.title.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [searchTerm, allDocuments]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleDocumentChange = (e) => {
        const selectedDocId = e.target.value;
        setDocument(Number(selectedDocId));
        setIsTypeOfEnabled(selectedDocId !== "");
    };

    const removeConnection = (index) => {
        setInputValues((prev) => ({
            ...prev,
            connections: prev.connections.filter((_, i) => i !== index),
        }));
    };

    const addConnection = () => {
        if (document && relationship) {
            const selectedDocument = allDocuments.find((doc) => doc.id === Number(document));

            if (selectedDocument) {
                const newConnection = new Connection(selectedDocument, relationship);
                setInputValues((prev) => ({
                    ...prev,
                    connections: [...prev.connections, newConnection],
                }));
                setDocument("");
                setRelationship("");
                setIsTypeOfEnabled(false);
            }
        }
    };

    return (
        <Form>
            <fieldset>
                <h2>Add a connection</h2>
                <Form.Group controlId="formDocument" className="mb-3">
                    <Form.Label>Document</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Search documents..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="mb-2"
                    />
                    <Form.Control
                        as="select"
                        value={document}
                        onChange={handleDocumentChange}
                    >
                        <option key="0" value="">
                            Select a document
                        </option>
                        {filteredDocuments.map((doc) => (
                            <option key={doc.id} value={doc.id}>
                                {doc.title}
                            </option>
                        ))}
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId="formRelationship" className="mb-3">
                    <Form.Label>Type Of Connection</Form.Label>
                    <Form.Control
                        as="select"
                        value={relationship}
                        onChange={(e) => setRelationship(e.target.value)}
                        disabled={!isTypeOfEnabled}
                    >
                        <option value="">Select type</option>
                        {relationshipOptions.map((option, index) => (
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
            <p>Connections:</p>
            <div className="connections overflow-y-auto" style={{ maxHeight: "150px", overflowY: "auto" }}>
                {inputValues.connections.map((connection, index) => (
                    <Card
                        key={index}
                        className="mb-2 me-1 position-relative"
                    >
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
                        <Card.Body style={{ padding: "5px" }}>
                            <Card.Text style={{ fontSize: "1rem", marginBottom: "2px" }}>
                                <strong>Document:</strong> {connection.targetDocument.title}
                            </Card.Text>
                            <Card.Text style={{ fontSize: "1rem", marginBottom: "2px" }}>
                                <strong>Type:</strong> {connection.relationship}
                            </Card.Text>
                        </Card.Body>
                    </Card>

                ))}
            </div>
        </Form>
    );
}
