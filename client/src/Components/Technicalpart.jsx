
import React from "react";
import { Form } from "react-bootstrap";

export function TechnicalPart({ inputValues, setInputValues }) {

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

    return (
        <Form>
            <h2>Technical information</h2>
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
                        value={inputValues.scaleType}
                        onChange={(e) =>
                            setInputValues({ ...inputValues, scaleType: e.target.value })
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
                    {inputValues.scaleType === "Plan" && (
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
    );
}
