import React from "react";
import { Modal, Button } from "react-bootstrap";

const ConfirmationModal = ({ show, onClose, onConfirm, message }) => {
    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Body>
                <p className="text-center m-2 fs-5">{message}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose} className="ms-auto">
                    No
                </Button>
                <Button variant="primary" onClick={onConfirm} className="me-auto">
                    Yes
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ConfirmationModal;
