import { Form, Button } from "react-bootstrap";
import PropTypes from "prop-types";

export function GeoPart({ inputValues, setInputValues, setSecond, handleChooseInMap }) {

    const handleArea = () => {
        setSecond(true);
    };

    return (
        <Form>
            <h2>Georeference</h2>
            {/* Row with checkbox and button */}
            <Form.Group controlId="formAllMunicipality" className="mb-3">
                <div className="d-flex align-items-center justify-content-between">
                    <Form.Check
                        type="checkbox"
                        label="All Municipality"
                        checked={inputValues.allMunicipality}
                        onChange={(e) => {
                            const isChecked = e.target.checked;
                            setInputValues((prev) => ({
                                ...prev,
                                allMunicipality: isChecked,
                                ...(isChecked && {
                                    longitude: null,
                                    latitude: null,
                                }),
                            }));
                        }}
                        className="me-3"
                    />
                    <Button
                        variant="dark"
                        onClick={handleChooseInMap}
                        disabled={inputValues.allMunicipality}
                    >
                        Choose on the Map
                    </Button>
                    <Button
                        variant="dark"
                        onClick={handleArea}
                        disabled={inputValues.allMunicipality}
                    >
                        {inputValues.areaName
                            ? 'Change Area : "' + inputValues.areaName + '"'
                            : "Select or draw new Area"}
                    </Button>
                </div>
            </Form.Group>

            {/* Latitude Input */}
            <Form.Group controlId="formLatitude" className="mb-3">
                <Form.Label className="fw-bold">Latitude</Form.Label>
                <Form.Control
                    type="number"
                    value={inputValues.latitude || ""}
                    onChange={(e) => setInputValues({ ...inputValues, latitude: e.target.value })}
                    placeholder="Enter latitude"
                    disabled={inputValues.allMunicipality}
                />
            </Form.Group>

            {/* Longitude Input */}
            <Form.Group controlId="formLongitude" className="mb-3">
                <Form.Label className="fw-bold">Longitude</Form.Label>
                <Form.Control
                    type="number"
                    value={inputValues.longitude || ""}
                    onChange={(e) => setInputValues({ ...inputValues, longitude: e.target.value })}
                    placeholder="Enter longitude"
                    disabled={inputValues.allMunicipality}
                />
            </Form.Group>
        </Form>
    );
}

GeoPart.propTypes = {
    inputValues: PropTypes.shape({
        allMunicipality: PropTypes.bool.isRequired,
        latitude: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        longitude: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        areaId: PropTypes.any,
        areaName: PropTypes.string,
    }).isRequired,
    setInputValues: PropTypes.func.isRequired,
    setSecond: PropTypes.func.isRequired,
    handleChooseInMap: PropTypes.func
};
