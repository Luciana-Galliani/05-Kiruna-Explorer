import React, { useEffect, useState } from 'react';
import { Form, Button, InputGroup, Row, Col } from 'react-bootstrap';

const SearchBar = ({ handleMunicipality, handleAuthor, handleTitle, handleIssuanceDate, handleDescription }) => {
    
    const [searchTitle, setSearchTitle] = useState('');
    const [searchAuthor, setSearchAuthor] = useState('');
    const [searchDescription, setSearchDescription] = useState('');
    const [showDetailedSearch, setShowDetailedSearch] = useState(false);

    useEffect(() => {
        handleDescription(searchDescription);
    }, [searchDescription]);

    useEffect(() => {
        handleTitle(searchTitle);
    }, [searchTitle]);

    const handleDeteiledSearch = (e) => {
        setShowDetailedSearch(!showDetailedSearch);
    }

    const handleTitleChange = (e) => {
        console.log(e.target.value);
        setSearchTitle(e.target.value);
    };

    const handleSearchDescription = (e) => {
        setSearchDescription(e.target.value);
    }

    const handleSearchAuthor = (e) => {
        setSearchAuthor(e.target.value);
    }

    const handleSwitchChange = (e) => {
        handleMunicipality();
    };

    return (
        <Form>
            <InputGroup >
                <Form.Control
                    type="text"
                    placeholder="Title..."
                    value={searchTitle}
                    onChange={handleTitleChange}
                />
                <Button className="custom-button-search-bar " variant="outline-secondary" onClick={handleDeteiledSearch}>
                    <i class="bi bi-sliders" />
                </Button>
            </InputGroup>
            {showDetailedSearch && (
                <Row className="mt-2">
                    <Col>
                        <Form.Control
                            type = "text" 
                            placeholder="Description" 
                            value={searchDescription}
                            onChange={handleSearchDescription}
                        />
                    </Col>
                    <Col>
                        <Form.Control
                            type="text"
                            placeholder="Author"
                        />
                    </Col>
                    <Col>
                        <Form.Control placeholder="Year" />
                    </Col>
                </Row>
            )}
            <Form.Check 
                type="switch" 
                label="All Municipality" 
                onChange={handleSwitchChange} 
                className="mt-2"
            />
        </Form>
    );
};

export default SearchBar;