import React, { useState } from 'react';
import { Form, Button, InputGroup, Row, Col } from 'react-bootstrap';

const SearchBar = ({ onSearch, onDetailedSearch, onToggleAllMunicipality }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSearch = () => {
        onSearch(searchTerm);
    };

    return (
        <Form>
            <InputGroup >
                <Form.Control
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    aria-label="Search"
                />
                <Button className="custom-button-search-bar " variant="outline-secondary" onClick={handleSearch}>
                    Search
                </Button>
            </InputGroup>
            <Form.Check 
                type="switch" 
                label="All Municipality" 
                onClick={onToggleAllMunicipality} 
                className="mt-2"
            />
        </Form>
    );
};

export default SearchBar;