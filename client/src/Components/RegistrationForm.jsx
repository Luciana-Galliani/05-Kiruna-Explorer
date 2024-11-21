import React, { useState } from "react";
import { Form, Button, Row, Col, Card, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import API from "../API/API.mjs";

function RegistrationForm({ handleLogin }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            await API.registerUser({ username, password });
            await handleLogin(username, password);
            navigate("/");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <Container className="vh-100 d-flex align-items-center justify-content-center">
            <Row className="w-100">
                <Col xs={12} sm={10} md={8} lg={6} className="mx-auto">
                    <Card className="shadow-sm">
                        <Card.Body>
                            <Card.Title className="text-center mb-4">Register</Card.Title>
                            {error && <div className="alert alert-danger">{error}</div>}
                            <Form onSubmit={handleSubmit}>
                                <Form.Group controlId="username" className="mb-3">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={username}
                                        onChange={(ev) => setUsername(ev.target.value)}
                                        required
                                        placeholder="Enter your username"
                                    />
                                </Form.Group>

                                <Form.Group controlId="password" className="mb-3">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        value={password}
                                        onChange={(ev) => setPassword(ev.target.value)}
                                        required
                                        minLength={6}
                                        placeholder="Enter your password"
                                        className={password && password.length < 6 ? "is-invalid" : ""}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Password must be at least 6 characters long.
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group controlId="confirmPassword" className="mb-3">
                                    <Form.Label>Confirm Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(ev) => setConfirmPassword(ev.target.value)}
                                        required
                                        minLength={6}
                                        placeholder="Confirm your password"
                                        className={
                                            confirmPassword && confirmPassword !== password
                                                ? "is-invalid"
                                                : ""
                                        }
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Passwords do not match.
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <div className="d-grid gap-2">
                                    <Button
                                        variant="primary"
                                        type="submit"
                                        className="mb-2"
                                        disabled={!username || !password || confirmPassword !== password}
                                    >
                                        Register
                                    </Button>
                                    <Link className="btn btn-danger" to={"/"}>
                                        Cancel
                                    </Link>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default RegistrationForm;
