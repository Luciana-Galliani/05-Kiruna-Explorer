import React from "react";
import { Form, Button } from "react-bootstrap";

export function GeoPart({ inputValues, setInputValues, handleChooseInMap }) {
    return (
        <Form>
            <h2>Georeference</h2>
            <Form.Group controlId="formAllMunicipality" className="mb-3">
                <Form.Check
                    type="checkbox"
                    label="All Municipality"
                    checked={inputValues.allMunicipality}
                    onChange={(e) => {
                        const isChecked = e.target.checked;
                        setInputValues((prev) => ({
                            ...prev,
                            allMunicipality: isChecked,
                            ...(isChecked && { longitude: null, latitude: null }),
                        }));
                    }}
                />
            </Form.Group>

            <Form.Group controlId="formLatitude" className="mb-3">
                <Form.Label>Latitude</Form.Label>
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
                <Form.Label>Longitude</Form.Label>
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
        </Form>
    );
}
