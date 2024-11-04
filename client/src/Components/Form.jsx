import React, { useState, useRef, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import API from '../API/API.mjs';
import { Stakeholder } from '../models.mjs';

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
        planScale: ''
    });
    const [showModal, setShowModal] = useState(false);
    const [activeField, setActiveField] = useState('');
    const [stakeholderOptions, setStakeholderOptions] = useState([]);
    const tempRef = useRef(null);
    const [notification, setNotification] = useState({ message: '', type: '' });


    const typeOptions = ['Design Document', 'Informative document', 'Prescriptive document', 'Technical Document', 'Agreement', 'Conflict', 'Consultation', 'Action'];
    const scaleOptions = ['Text', 'Concept', 'Blueprints/effect', 'Plan'];


    const showNotification = (message, type) => {
        setNotification({ message, type });
        setTimeout(() => setNotification({ message: '', type: '' }), 3000); // Notifica sparisce dopo 3 secondi
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
            stakeholders: inputValues.stakeholders
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
        }

        try {
            const savedDocument = await API.createDocument(documentData);
            showNotification("Document saved successfully!", 'success');
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
