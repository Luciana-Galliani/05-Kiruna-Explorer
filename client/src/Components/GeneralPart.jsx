import React, { useRef, useState } from "react";
import { Form, Modal, Button } from "react-bootstrap";

export function GeneralPart({ inputValues, setInputValues, stakeholderOptions }) {
    const [showModal, setShowModal] = useState(false);
    const [activeField, setActiveField] = useState(null);
    const tempRef = useRef(null);

    const handleInputFocus = (field) => {
        setActiveField(field);
        setShowModal(true);
        tempRef.current?.focus();
    };

    const handleModalClose = () => {
        setShowModal(false);
        setTimeout(() => setActiveField(""), 300); // wait for animation end
    };

    const handleInputChange = (e) => {
        const { value } = e.target;

        if (activeField === "stakeholders") {
            const selectedStakeholder = stakeholderOptions.find((option) => option.name === value);
            setInputValues((prev) => {
                const isSelected = prev.stakeholders.some(
                    (item) => item.id === selectedStakeholder.id
                );
                const stakeholders = isSelected
                    ? prev.stakeholders.filter((item) => item.id !== selectedStakeholder.id)
                    : [...prev.stakeholders, selectedStakeholder];
                return { ...prev, stakeholders };
            });
        } else {
            setInputValues((prev) => ({ ...prev, [activeField]: value }));
        }
    };

    return (
        <>
            <Form>
                <h2>General information</h2>
                <Form.Group controlId="formTitle">
                    <Form.Label className="fw-bold" style={{ fontSize: "1.2rem", color: "black" }}>
                        Title<span className="text-danger ms-2 fw-bold">*</span>
                    </Form.Label>
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
                </Form.Group>

                <Form.Group controlId="formStakeholders">
                    <Form.Label className="fw-bold" style={{ fontSize: "1.2rem", color: "black" }}>
                        Stakeholders<span className="text-danger ms-2 fw-bold">*</span>
                    </Form.Label>
                    <Form.Control
                        type="text"
                        value={inputValues.stakeholders.map((s) => s.name).join(", ")}
                        onFocus={() => handleInputFocus("stakeholders")}
                        readOnly
                        placeholder="Click to select stakeholders"
                        required
                    />
                </Form.Group>

                <Form.Group >
                    <Form.Label className="fw-bold" style={{ fontSize: "1.2rem", color: "black" }}>
                        Issuance Date <span className="text-danger">*</span>
                    </Form.Label>
                    <div className="d-flex align-items-center gap-2 mt-2">
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
                            step="1"
                        />
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
                            step="1"
                        />
                    </div>
                </Form.Group>

                <Form.Group controlId="formDescription" >
                    <Form.Label className="fw-bold" style={{ fontSize: "1.2rem", color: "black" }}>
                        Description<span className="text-danger ms-2 fw-bold">*</span>
                    </Form.Label>
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
                </Form.Group>
            </Form>
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
                                        checked={inputValues.stakeholders.some(
                                            (stakeholder) => stakeholder.id === option.id
                                        )}
                                        onChange={handleInputChange}
                                        style={{ width: "35%" }}
                                    />
                                ))
                            )}
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleModalClose} className="mx-auto">
                        OK
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
