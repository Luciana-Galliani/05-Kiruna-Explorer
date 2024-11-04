import React, { useState } from 'react';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import API from '../API/API.mjs';

function RegistrationForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            await API.registerUser({ username, password });
            navigate('/login');
        } catch (err) {
            setError(err);
            navigate('/registration');

        }
    };

    return (
        <Row className="justify-content-center align-items-center" style={{ height: '100vh' }}>
            <Col md={4}>
                <Card className="shadow-sm">
                    <Card.Body>
                        <Card.Title className="text-center mb-4">Register</Card.Title>
                        {error && <div className="alert alert-danger">{error}</div>}
                        <Form onSubmit={handleSubmit}>
                            <Form.Group controlId='username' className='mb-3'>
                                <Form.Label>Username</Form.Label>
                                <Form.Control
                                    type='text'
                                    value={username}
                                    onChange={ev => setUsername(ev.target.value)}
                                    required
                                    placeholder="Enter your username"
                                />
                            </Form.Group>

                            <Form.Group controlId='password' className='mb-3'>
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type='password'
                                    value={password}
                                    onChange={ev => setPassword(ev.target.value)}
                                    required
                                    minLength={6}
                                    placeholder="Enter your password"
                                />
                            </Form.Group>

                            <div className="d-grid gap-2">
                                <Button variant="primary" type='submit' className="mb-2">Register</Button>
                                <Link className='btn btn-danger' to={'/'} >Cancel</Link>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
}

export default RegistrationForm;
