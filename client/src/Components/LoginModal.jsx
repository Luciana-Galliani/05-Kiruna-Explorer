import React from 'react';
import { Modal, Form, Button, Card, Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';

const LoginModal = ({ show, handleClose, handleSubmit, username, setUsername, password, setPassword, error }) => {
    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Body>
                <Card className="shadow-sm">
                    <Card.Body>
                        <Card.Title className="text-center mb-4">Login</Card.Title>
                        {error && <div className="alert alert-danger text-center">{error}</div>}
                        <Form onSubmit={handleSubmit}>
                            <Form.Group controlId="username" className="mb-3">
                                <Form.Label>Username</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={username}
                                    onChange={(ev) => setUsername(ev.target.value)}
                                    required
                                    autoFocus
                                    placeholder="Enter your Username"
                                    autoComplete="on"
                                />
                            </Form.Group>
                            <Form.Group controlId="password" className="mb-3">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    value={password}
                                    onChange={(ev) => setPassword(ev.target.value)}
                                    required
                                    placeholder="Enter your Password"
                                    autoComplete="on"
                                />
                            </Form.Group>
                            <Button variant="primary" type="submit" className="w-100">
                                Login
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
            </Modal.Body>
        </Modal>
    );
};

LoginModal.propTypes = {
    show: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    username: PropTypes.string.isRequired,
    setUsername: PropTypes.func.isRequired,
    password: PropTypes.string.isRequired,
    setPassword: PropTypes.func.isRequired,
    error: PropTypes.string,
};

export default LoginModal;