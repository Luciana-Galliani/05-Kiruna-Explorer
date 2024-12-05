import React, { useState, useEffect, useContext } from "react";
import { Card } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import API from "../API/API.mjs";
import { AppContext } from "../context/AppContext.jsx";
import PropTypes from "prop-types";
import { DescriptionForm } from "./Form.jsx";

export function EditDocumentForm({ coordinates, className, setCoordinates, newarea, setnewArea }) {
    const { documentId } = useParams(); //Get the document ID
    const navigate = useNavigate();
    const [existingDocument, setExistingDocument] = useState();
    const [loading, setLoading] = useState(true); // Loading status
    const { isLoggedIn } = useContext(AppContext);

    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/login");
        }
    }, [isLoggedIn, navigate]);

    useEffect(() => {
        const fetchDocumentById = async () => {
            try {
                const resp = await API.getDocument(documentId);
                setExistingDocument(resp);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching document:", error);
            }
        };

        fetchDocumentById();
    }, [documentId]);

    if (!loading && existingDocument) {
        return (
            <DescriptionForm
                coordinates={coordinates}
                existingDocument={existingDocument}
                className={className}
                setCoordinates={setCoordinates}
                newarea={newarea}
                setnewArea={setnewArea}
            />
        );
    } else {
        return (
            <div className="position-absolute top-50 start-50 translate-middle w-25">
                <Card className="shadow-sm">
                    <Card.Body>
                        <p className="text-center mb-4">Document not found!</p>
                    </Card.Body>
                </Card>
            </div>
        );
    }
}

EditDocumentForm.propTypes = {
    coordinates: PropTypes.shape({
        latitude: PropTypes.number,
        longitude: PropTypes.number,
    }),
    className: PropTypes.string,
    setCoordinates: PropTypes.func.isRequired,
    newarea: PropTypes.any,
    setnewArea: PropTypes.func,
};
