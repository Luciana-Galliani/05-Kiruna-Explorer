import React, { useEffect, useState } from "react";
import { Form, Button, InputGroup, Row, Col } from "react-bootstrap";
import PropTypes from "prop-types";

const SearchBar = ({
    handleMunicipality,
    handleAuthor,
    handleTitle,
    handleDescription,
    handleRange,
    handleType,
    handleLanguage,
    stakeholders,
}) => {
    const [searchTitle, setSearchTitle] = useState("");
    const [searchAuthor, setSearchAuthor] = useState("");
    const [searchDescription, setSearchDescription] = useState("");
    const [showDetailedSearch, setShowDetailedSearch] = useState(false);
    const [startRange, setStartRange] = useState("");
    const [endRange, setEndRange] = useState("");
    const [searchType, setSearchType] = useState("");
    const  [searchLanguage, setSearchLanguage] = useState("");

    // Type of possible documents
    const typeOptions = [
        "Design Document",
        "Informative Document",
        "Prescriptive Document",
        "Technical Document",
        "Agreement",
        "Conflict",
        "Consultation",
        "Action",
        "Other",
    ];

    //One useEffect for each search parameter, for now only works in that way
    useEffect(() => {
        handleDescription(searchDescription);
    }, [searchDescription]);

    useEffect(() => {
        handleTitle(searchTitle);
    }, [searchTitle]);

    useEffect(() => {
        handleAuthor(searchAuthor);
    }, [searchAuthor]);

    useEffect(() => {
        handleRange(startRange, endRange);
    }, [startRange, endRange]);

    useEffect(() => {
        handleType(searchType);
    }, [searchType]);

    useEffect(() => {
        handleLanguage(searchLanguage);
    }, [searchLanguage]);


    const handleDeteiledSearch = (e) => {
        setShowDetailedSearch(!showDetailedSearch);
    };

    const handleTitleChange = (e) => {
        setSearchTitle(e.target.value);
    };

    const handleSearchDescription = (e) => {
        setSearchDescription(e.target.value);
    };

    const handleSearchAuthor = (e) => {
        setSearchAuthor(e.target.value);
    };

    const handleSearchStartRange = (e) => {
        setStartRange(e.target.value);
    };

    const handleSearchEndRange = (e) => {
        setEndRange(e.target.value);
    };

    const handleSearchType = (e) => {
        setSearchType(e.target.value);
    };

    const handleSearchLanguage = (e) => {
        setSearchLanguage(e.target.value);
    };


    const handleSwitchChange = (e) => {
        handleMunicipality();
    };

    return (
        <Form>
            <InputGroup>
                <Form.Control
                    type="text"
                    placeholder="Title..."
                    value={searchTitle}
                    onChange={handleTitleChange}
                />
                <Button
                    className="custom-button-search-bar "
                    variant="outline-secondary"
                    onClick={handleDeteiledSearch}
                >
                    <i className="bi bi-sliders" />
                </Button>
            </InputGroup>
            {showDetailedSearch && (
                <div>
                <Row className="mt-2">
                    <Col>
                        <Form.Control
                            type="text"
                            placeholder="Description"
                            value={searchDescription}
                            onChange={handleSearchDescription}
                        />
                    </Col>
                    <Col>
                        <Form.Control
                            type="text"
                            placeholder="Language"
                            value={searchLanguage}
                            onChange={handleSearchLanguage}
                        />
                    </Col>
                </Row>

                <Row className="mt-2">
                    <Col>
                        <Form.Control as="select"
                            id="documentType-select" //for Cypress
                            value={searchType}
                            onChange={handleSearchType}>
                            <option value="" selected style={{color: "lightgray"}}>Document Type</option>
                            {typeOptions.map((type) => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </Form.Control>
                    </Col>
                    <Col>
                        <Form.Control as="select"
                            id="stakeholder-select" //for Cypress
                            value={searchAuthor}
                            onChange={handleSearchAuthor}>
                            <option value="" selected style={{color: "lightgray"}}>Stakeholder</option>
                            {stakeholders.map((stakeholder) => (
                                <option key={stakeholder.id}>{stakeholder.name}</option>
                            ))}
                        </Form.Control>
                    </Col>
                </Row>

                <Row className="mt-2">
                    <Col>
                        <Form.Control
                            type="date"
                            placeholder="Start Date"
                            value={startRange}
                            onChange={handleSearchStartRange}
                        />
                    </Col>
                    <Col>
                        <Form.Control
                            type="date"
                            placeholder="End Date"
                            value={endRange}
                            onChange={handleSearchEndRange}
                        />
                    </Col>
                </Row>
                </div>
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


SearchBar.propTypes = {
    handleMunicipality: PropTypes.func.isRequired,
    handleAuthor: PropTypes.func.isRequired,
    handleTitle: PropTypes.func.isRequired,
    handleIssuanceDate: PropTypes.func.isRequired,
    handleDescription: PropTypes.func.isRequired,
    handleRange: PropTypes.func.isRequired,
    handleType: PropTypes.func.isRequired,
    handleLanguage: PropTypes.func.isRequired,
    stakeholders: PropTypes.array.isRequired,
};

export default SearchBar;
