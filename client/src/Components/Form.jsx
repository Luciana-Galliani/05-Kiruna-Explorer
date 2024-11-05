import React, { useState, useRef, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Card } from 'react-bootstrap';
import API from '../API/API.mjs';
import { useNavigate } from 'react-router-dom';
import { Stakeholder, Connection } from '../models.mjs';

export default function DescriptionForm() {
    const [inputValues, setInputValues] = useState({
        title: '',
        stakeholders: [],
        issuanceDate: '',
        type: '',
        language: '',
        pages: '',
        description: '',
        scale: '',
        planScale: '',
        allMunicipality: false,
        latitude: null,
        longitude: null,
        planScale: '',
        connections: []
    });
    const [showModal, setShowModal] = useState(false);
    const [activeField, setActiveField] = useState('');
    const [isTypeOfEnabled, setIsTypeOfEnabled] = useState(false);
    const [stakeholderOptions, setStakeholderOptions] = useState([]);
    const [documentOptions, setDocumentOptions] = useState([]);
    const [relationshipOptions, setRelationshipOptions] = useState([]);

    const tempRef = useRef(null);
    const [notification, setNotification] = useState({ message: '', type: '' });

    const navigate = useNavigate();


    const typeOptions = ['Design Document', 'Informative document', 'Prescriptive document', 'Technical Document', 'Agreement', 'Conflict', 'Consultation', 'Action'];
    const scaleOptions = ['Text', 'Concept', 'Blueprints/actions', 'Plan'];

    const [document, setDocument] = useState(''); // For first dropdown
    const [relationship, setRelationship] = useState(''); // For second dropdown


    const showNotification = (message, type) => {
        setNotification({ message, type });
        setTimeout(() => setNotification({ message: '', type: '' }), 3000);
    };



    useEffect(() => {
        const fetchStakeholders = async () => {
            try {
                const resp = await API.getStakeholders();
                const stakeholderInstances = resp.stakeholders.map((item) => new Stakeholder(item.id, item.name, item.color));
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

    const handleInputFocus = (field) => {
        setActiveField(field);
        setShowModal(true);
        tempRef.current.focus(); // remove focus
    };

    const handleInputChange = (e) => {
        const { value } = e.target;

        if (activeField === 'stakeholders') {
            const selectedStakeholder = stakeholderOptions.find(option => option.name === value);
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
        setTimeout(() => setActiveField(''), 300); // wait for animation end
    };

    const handleSave = () => {
        setShowModal(false);
        setTimeout(() => setActiveField(''), 300); // wait for animation end
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSave();
        }
    };
    const handleDocumentChange = (e) => {
        const selectedDocumentId = e.target.value;
        setDocument(selectedDocumentId);
        setIsTypeOfEnabled(selectedDocumentId !== "");
    };


    const addConnection = () => {
        if (document && relationship) {
            const selectedDocument = documentOptions.find(doc => doc.id === Number(document));

            if (selectedDocument) {
                const newConnection = new Connection(selectedDocument, relationship);
                setInputValues((prev) => ({
                    ...prev,
                    connections: [...prev.connections, newConnection]
                }));
                setDocument(''); // Resetta l'input
                setRelationship('');
            } else {
                showNotification('Document not found.', 'error');
            }
        } else {
            showNotification('Please fill in both document and type.', 'error');
        }
    };



    const handleSaveForm = async () => {
        const documentData = {
            title: inputValues.title,
            scaleType: inputValues.scale,
            scaleValue: inputValues.planScale || null,
            issuanceDate: inputValues.issuanceDate,
            type: inputValues.type,
            language: inputValues.language,
            pages: inputValues.pages,
            description: inputValues.description,
            stakeholders: inputValues.stakeholders,
            allMunicipality: inputValues.allMunicipality,
            latitude: inputValues.latitude,
            longitude: inputValues.longitude,
            connections: inputValues.connections
        };

        if (!documentData.title || !documentData.issuanceDate || !documentData.type || !documentData.description) {
            showNotification("Please fill all mandatory fields.", 'error');
            return;
        } else if (inputValues.scaleValue && !/^1:\d{1,3}([.,]\d{3})*$/.test(inputValues.scaleValue)) {
            showNotification('Plan scale must follow the format 1:1000', 'error');
            return;

        } else if (documentData.pages && !/^\d+(-\d+)?$/.test(documentData.pages)) {
            showNotification('Pages must be a single number or a range in the format 1-32', 'error');
            return;
        } else if(!documentData.allMunicipality && (!documentData.latitude || !documentData.longitude)) {
            showNotification('Please enter latitude and longitude', 'error');
            return;
        } else if(documentData.allMunicipality && (documentData.latitude || documentData.longitude)) {
            showNotification('Please uncheck "All Municipality" if you want to enter latitude and longitude', 'error');
            return;
        } else if(documentData.allMunicipality && (!documentData.latitude && !documentData.longitude)) {
            documentData.latitude = null;
            documentData.longitude = null;
        }

        try {
            await API.createDocument(documentData);
            showNotification("Document saved successfully!", 'success');
            navigate('/'); // Redirect to home page
        } catch (error) {
            console.error("Error saving document:", error);
            showNotification("Error saving document. Please try again.", 'error');
        }
    };

    return (
        <div className="container mt-5 position-relative" style={{
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            background: 'rgba(255, 255, 255, 0.8)',
            zIndex: 1,
        }}>
            {notification.message && (
                <div style={{
                    padding: '10px',
                    marginBottom: '15px',
                    borderRadius: '5px',
                    color: notification.type === 'success' ? '#155724' : '#721c24',
                    backgroundColor: notification.type === 'success' ? '#d4edda' : '#f8d7da',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)'
                }}>
                    {notification.message}
                </div>
            )}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: `url(../../../This_is_Kiruna.jpg)`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                zIndex: -1,
            }} />
            <Row>
                <Col md={7}>
                    <Form>
                        <Form.Group controlId="formTitle" className="mb-3">
                            <Form.Label style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'white', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.7)' }}>Title</Form.Label>
                            <Form.Control
                                type="text"
                                value={inputValues.title}
                                onFocus={() => handleInputFocus('title')}
                                readOnly
                                placeholder="Click to enter the title"
                                className="w-75"
                            />
                        </Form.Group>
                        <Form.Group controlId="formStakeholders" className="mb-3">
                            <Form.Label style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'white', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.7)' }}>Stakeholders</Form.Label>
                            <Form.Control
                                type="text"
                                value={inputValues.stakeholders.map(s => s.name).join(', ')} // Display stakeholder names
                                onFocus={() => handleInputFocus('stakeholders')}
                                readOnly
                                placeholder="Click to select stakeholders"
                                className="w-75"
                            />
                        </Form.Group>
                        <Form.Group controlId="formIssuanceDate" className="mb-3">
                            <Form.Label style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'white', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.7)' }}>Issuance Date</Form.Label>
                            <Form.Control
                                type="date"
                                value={inputValues.issuanceDate}
                                onChange={(e) => setInputValues({ ...inputValues, issuanceDate: e.target.value })}
                                placeholder="Select issuance date"
                                className="w-75"
                            />
                        </Form.Group>
                        <Form.Group controlId="formType" className="mb-3">
                            <Form.Label style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'white', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.7)' }}>Type</Form.Label>
                            <Form.Control
                                as="select"
                                value={inputValues.type}
                                onChange={(e) => setInputValues({ ...inputValues, type: e.target.value })}
                                className="w-75"
                            >
                                <option value="">Select a type</option>
                                {typeOptions.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="formScale" className="mb-3">
                            <Form.Label style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'white', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.7)' }}>Scale</Form.Label>
                            <Form.Control
                                as="select"
                                value={inputValues.scale}
                                onChange={(e) => setInputValues({ ...inputValues, scale: e.target.value })}
                                className="w-75"
                            >
                                <option value="">Select a scale</option>
                                {scaleOptions.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </Form.Control>
                            {inputValues.scale === 'Plan' && (
                                <Form.Control
                                    type="text"
                                    value={inputValues.planScale}
                                    onChange={(e) => setInputValues({ ...inputValues, planScale: e.target.value })}
                                    placeholder="Enter scale for Plan (e.g., 1:1000)"
                                    className="mt-2 w-75"
                                />
                            )}
                        </Form.Group>
                        <Form.Group controlId="formLanguage" className="mb-3">
                            <Form.Label style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'white', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.7)' }}>Language</Form.Label>
                            <Form.Control
                                type="text"
                                value={inputValues.language}
                                onFocus={() => handleInputFocus('language')}
                                readOnly
                                placeholder="Click to enter language"
                                className="w-75"
                            />
                        </Form.Group>
                        <Form.Group controlId="formPages" className="mb-3">
                            <Form.Label style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'white', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.7)' }}>Pages</Form.Label>
                            <Form.Control
                                type="text"
                                value={inputValues.pages}
                                onChange={(e) => setInputValues({ ...inputValues, pages: e.target.value })}
                                placeholder="Enter number of pages"
                                className="w-75"
                            />
                        </Form.Group>
                    </Form>
                </Col>
                <Col md={5}>
                    <Form.Group controlId="formDescription" className="mb-3">
                        <Form.Label style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'white', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.7)' }}>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={5}
                            value={inputValues.description}
                            onFocus={() => handleInputFocus('description')}
                            readOnly
                            placeholder="Click to enter description"
                        />
                    </Form.Group>
                    <Form.Group controlId="formAllMunicipality" className="mb-3">
                        <Form.Check
                            type="checkbox"
                            label="All Municipality"
                            checked={inputValues.allMunicipality}
                            onChange={(e) => setInputValues({ ...inputValues, allMunicipality: e.target.checked })}
                        />
                    </Form.Group>
                    { !inputValues.allMunicipality && (
                    <> 
                    <Form.Group controlId="formLatitude" className="mb-3">
                        <Form.Label style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'white', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.7)' }}>Latitude</Form.Label>
                        <Form.Control
                            type="number"
                            value={inputValues.latitude || ''}
                            onChange={(e) => setInputValues({ ...inputValues, latitude: e.target.value })}
                            placeholder="Enter latitude"
                        />
                    </Form.Group>
                    <Form.Group controlId="formLongitude" className="mb-3">
                        <Form.Label style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'white', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.7)' }}>Longitude</Form.Label>
                        <Form.Control
                            type="number"
                            value={inputValues.longitude || ''}
                            onChange={(e) => setInputValues({ ...inputValues, longitude: e.target.value })}
                            placeholder="Enter longitude"
                        />
                    </Form.Group>
                    </>
                    )}
                    <Form>
                        <Form.Group controlId="formDescription" className="mb-3">
                            <Form.Label style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'white', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.7)' }}>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={5}
                                value={inputValues.description}
                                onFocus={() => handleInputFocus('description')}
                                readOnly
                                placeholder="Click to enter description"
                            />
                        </Form.Group>

                        {/* Connections Input */}
                        <Form.Group controlId="formDocument" className="mb-3">
                            <Form.Label style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'white', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.7)' }}>Document</Form.Label>
                            <Form.Control
                                as="select"
                                value={document.id}
                                onChange={handleDocumentChange}
                                className="w-75"
                            >
                                <option value="">Select a document</option>
                                {documentOptions.map((document) => (
                                    <option key={document.id} value={document.id}>
                                        {document.title}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="formRelationship" className="mb-3">
                            <Form.Label style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'white', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.7)' }}>Type Of Connection</Form.Label>
                            <Form.Control
                                as="select"
                                value={relationship}
                                onChange={(e) => setRelationship(e.target.value)}
                                className="w-75"
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
                    </Form>
                    <Button variant="success" onClick={addConnection} className="my-2">
                        Add Connection
                    </Button>

                    {inputValues.connections.map((connection, index) => (
                        <Card key={index} className="mb-2">
                            <Card.Body>
                                <Card.Text><strong>Document:</strong> {connection.document.title}</Card.Text>
                                <Card.Text><strong>Type:</strong> {connection.relationship}</Card.Text>
                            </Card.Body>
                        </Card>
                    ))}

                </Col>
            </Row>

            <input ref={tempRef} style={{ position: 'absolute', left: '-9999px' }} />

            <Modal show={showModal} onHide={handleModalClose} centered>
                <Modal.Body>
                    {activeField === 'stakeholders' ? (
                        <div>
                            {stakeholderOptions.length === 0 ? (
                                <p>Loading stakeholders...</p>
                            ) : (
                                stakeholderOptions.map((option) => (
                                    <Form.Check
                                        key={option.id}
                                        type="checkbox"
                                        label={option.name}
                                        value={option.name}
                                        checked={inputValues.stakeholders.includes(option)} // Check if object is in array
                                        onChange={handleInputChange}
                                    />
                                ))
                            )}
                        </div>
                    ) : activeField === 'description' ? (
                        <Form.Control
                            as="textarea"
                            rows={5}
                            value={inputValues[activeField] || ''}
                            onChange={handleInputChange}
                            placeholder={`Enter your ${activeField} here`}
                            autoFocus
                            onKeyDown={handleKeyDown}
                        />
                    ) : (
                        <Form.Control
                            type="text"
                            value={inputValues[activeField] || ''}
                            onChange={handleInputChange}
                            placeholder={`Enter your ${activeField} here`}
                            autoFocus
                            onKeyDown={handleKeyDown}
                        />
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleModalClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSave}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
            <Button variant='success'
                onClick={handleSaveForm}
                className="mt-3 mx-auto d-block"
                style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}>
                Save Document
            </Button>

        </div>
    );
}
