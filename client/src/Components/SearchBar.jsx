import React, { useEffect, useState } from "react";
import { Form, Button, InputGroup, Row, Col } from "react-bootstrap";
import PropTypes from "prop-types";

const SearchBar = ({
    handleMunicipality,
    handleAuthor,
    handleTitle,
    handleIssuanceDate,
    handleDescription,
    stakeholders,
}) => {
    const [searchTitle, setSearchTitle] = useState("");
    const [searchAuthor, setSearchAuthor] = useState("");
    const [searchDescription, setSearchDescription] = useState("");
    const [searchIssuanceDate, setSearchIssuanceDate] = useState("");
    const [showDetailedSearch, setShowDetailedSearch] = useState(false);

    //One useEffect for each search parameter, for now only works in that way
    useEffect(() => {
        handleDescription(searchDescription);
    }, [searchDescription]);

    useEffect(() => {
        handleTitle(searchTitle);
    }, [searchTitle]);

    useEffect(() => {
        handleIssuanceDate(searchIssuanceDate);
    }, [searchIssuanceDate]);

    useEffect(() => {
        handleAuthor(searchAuthor);
    }, [searchAuthor]);

    const handleDeteiledSearch = (e) => {
        setShowDetailedSearch(!showDetailedSearch);
    };

    const handleTitleChange = (e) => {
        setSearchTitle(e.target.value);
    };

    const handleSearchDescription = (e) => {
        setSearchDescription(e.target.value);
    };

    const handleIssuanceDateChange = (e) => {
        setSearchIssuanceDate(e.target.value);
    };

    const handleSearchAuthor = (e) => {
        setSearchAuthor(e.target.value);
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
                        <Form.Control as="select"
                            value={searchAuthor}
                            onChange={handleSearchAuthor}>
                            <option value="" selected style={{color: "lightgray"}}>Stakeholder</option>
                            {stakeholders.map((stakeholder) => (
                                <option key={stakeholder.id}>{stakeholder.name}</option>
                            ))}
                        </Form.Control>
                    </Col>
                    <Col>
                        <Form.Control
                            type="text"
                            placeholder="Year"
                            value={searchIssuanceDate}
                            onChange={handleIssuanceDateChange}
                        />
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


SearchBar.propTypes = {
    handleMunicipality: PropTypes.func.isRequired,
    handleAuthor: PropTypes.func.isRequired,
    handleTitle: PropTypes.func.isRequired,
    handleIssuanceDate: PropTypes.func.isRequired,
    handleDescription: PropTypes.func.isRequired,
};

export default SearchBar;
