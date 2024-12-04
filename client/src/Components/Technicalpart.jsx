import React from "react";
import { Form, Row } from "react-bootstrap";
import PropTypes from 'prop-types';


export function TechnicalPart({ inputValues, setInputValues, selectedFiles, setSelectedFiles }) {
    const typeOptions = [
        "Design Document",
        "Informative Document",
        "Prescriptive Document",
        "Technical Document",
        "Agreement",
        "Conflict",
        "Consultation",
        "Action",
    ];
    const scaleOptions = ["Text", "Concept", "Blueprints/actions", "Plan"];

    const handleFileChange = (e) => {
        const newFiles = Array.from(e.target.files);
        setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles]);
    };

    const removeFile = (index) => {
        setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    return (
        <Form>
            <h2>Technical Information</h2>
            <Form.Group controlId="formType" className="mb-2">
                <Form.Label className="fw-bold" style={{ fontSize: "1.2rem", color: "black" }}>
                    Type <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                    as="select"
                    value={inputValues.type}
                    onChange={(e) => setInputValues({ ...inputValues, type: e.target.value })}
                    required
                >
                    <option value="">Select a type</option>
                    {typeOptions.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </Form.Control>
            </Form.Group>

            <Form.Group controlId="formScale" className="mb-2">
                <Form.Label className="fw-bold" style={{ fontSize: "1.2rem", color: "black" }}>
                    Scale <span className="text-danger">*</span>
                </Form.Label>
                <div className="d-flex gap-2">
                    <Form.Control
                        as="select"
                        value={inputValues.scaleType}
                        onChange={(e) =>
                            setInputValues({ ...inputValues, scaleType: e.target.value })
                        }
                        required
                    >
                        <option value="">Select a scale</option>
                        {scaleOptions.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </Form.Control>
                    {inputValues.scaleType === "Plan" && (
                        <Form.Control
                            type="text"
                            value={inputValues.planScale}
                            onChange={(e) =>
                                setInputValues({ ...inputValues, planScale: e.target.value })
                            }
                            placeholder="Plan scale (e.g. 1:1,000)"
                        />
                    )}
                </div>
            </Form.Group>
            <Row>
                <Form.Group controlId="formLanguage" className="mb-2 col-md-6">
                    <Form.Label className="fw-bold" style={{ fontSize: "1.2rem", color: "black" }}>Language</Form.Label>
                    <Form.Control
                        type="text"
                        value={inputValues.language}
                        onChange={(e) =>
                            setInputValues({ ...inputValues, language: e.target.value })
                        }
                        placeholder="Click to enter language"
                    />
                </Form.Group>

                <Form.Group controlId="formPages" className="mb-2 col-md-6">
                    <Form.Label className="fw-bold" style={{ fontSize: "1.2rem", color: "black" }}>Pages</Form.Label>
                    <Form.Control
                        type="text"
                        value={inputValues.pages}
                        onChange={(e) =>
                            setInputValues({ ...inputValues, pages: e.target.value })
                        }
                        placeholder="Enter number of pages"
                    />
                </Form.Group>
            </Row>

            <Form.Group controlId="resourceFiles" className="mb-2">
                <Form.Label className="fw-bold" style={{ fontSize: "1.2rem", color: "black" }}>
                    Add Resources
                </Form.Label>
                <Form.Control
                    type="file"
                    name="resourceFiles"
                    multiple
                    onChange={handleFileChange}
                />
                <Form.Text className="text-muted">You can add one or more files.</Form.Text>
            </Form.Group>

            {selectedFiles.length > 0 && (
                <div
                    className="file-list d-flex flex-column gap-1"
                    style={{
                        maxHeight: "4rem",
                        overflowY: "auto",
                    }}
                >
                    {selectedFiles.map((file, index) => (
                        <div
                            key={index}
                            className="d-flex justify-content-between align-items-center border-bottom pb-1"
                            style={{
                                fontSize: "0.8rem",
                                height: "1.8rem",
                            }}
                        >
                            <span className="text-truncate">{file.name}</span>
                            <button
                                type="button"
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => removeFile(index)}
                                style={{
                                    lineHeight: "1",
                                    margin: "2px",
                                }}
                            >
                                x
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </Form>
    );
}

TechnicalPart.propTypes = {
    inputValues: PropTypes.shape({
        type: PropTypes.string.isRequired,
        scaleType: PropTypes.string.isRequired,
        planScale: PropTypes.string,
        language: PropTypes.string,
        pages: PropTypes.string,
    }).isRequired,
    setInputValues: PropTypes.func.isRequired,
    selectedFiles: PropTypes.arrayOf(PropTypes.object).isRequired,
    setSelectedFiles: PropTypes.func.isRequired,
};