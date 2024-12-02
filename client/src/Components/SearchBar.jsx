import React, { useEffect, useState } from 'react';
import { Form, Button, InputGroup, Row, Col } from 'react-bootstrap';

const SearchBar = ({ onSearch, handleMunicipality, handleAuthor, handleTitle, handleIssuanceDate, handleDescription }) => {
    
    const [searchTitle, setSearchTitle] = useState('');
    const [searchAuthor, setSearchAuthor] = useState('');
    const [searchDescription, setSearchDescription] = useState('');
    const [showDetailedSearch, setShowDetailedSearch] = useState(false);

    useEffect(() => {
        handleTitle(searchTitle);
        handleDescription(searchDescription);
    }, [searchTitle, searchDescription]);

    const handleDeteiledSearch = (e) => {
        setShowDetailedSearch(!showDetailedSearch);
    }

    const handleSearchChange = (e) => {
        setSearchTitle(e.target.value);
    };

    const handleSearchDescription = (e) => {
        setSearchDescription(e.target.value);
    }

    const handleSearchAuthor = (e) => {
        setSearchAuthor(e.target.value);
    }

    const handleSearch = () => {
        onSearch(searchTerm);
    };

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
                    onChange={handleSearchChange}
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