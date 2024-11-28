import React from "react";
import { Modal, Button } from "react-bootstrap";
import PropTypes from 'prop-types';


const ConfirmationModal = ({ show, onClose, onConfirm, message }) => {
    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Body>
                <p className="text-center m-2 fs-5">{message}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={onConfirm} className="ms-auto">
                    Yes
                </Button>
                <Button variant="secondary" onClick={onClose} className="me-auto">
                    No
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

ConfirmationModal.propTypes = {
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    message: PropTypes.string.isRequired,
};

export default ConfirmationModal;
