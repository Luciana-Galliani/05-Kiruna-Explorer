import React, { useState, useEffect, useContext } from "react";
import API from "../API/API.mjs";
import Table from 'react-bootstrap/Table';
import { useLocation } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const TableList = ({ allMunicipality }) => {

    const { isLoggedIn } = useContext(AppContext);

    const [documentsToShow, setDocumentsToShow] = useState([]);
    const [hoveredItem, setHoveredItem] = useState(null);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const fetchDocuments = async () => {
            const response = await API.getDocuments();
            const documents = response.documents;
            //filter documentsToShow based on the condition
            const filteredDocuments = documents.filter((document) => {
                //filter the document with all the conditions required
                return document.allMunicipality == allMunicipality;
            });
            setDocumentsToShow(filteredDocuments);
        };

        fetchDocuments();
    }, [location.pathname]);

    return (
        <Table striped unbordered hover>
            <thead>
                <tr>
                    <th>Type</th>
                    <th>Title</th>
                    <th>Stakeholders</th>
                    <th>Language</th>
                    <th>#Connections</th>
                </tr>
            </thead>
            <tbody>
                {
                    documentsToShow.map((document, index) => (
                        <tr key={index} onClick={() => setSelectedDocument(document)} tabIndex={0}>
                            <td>{document.type}</td>
                            <td>{document.title}</td>
                            <td>{document.stakeholder}</td>
                            <td>{document.language}</td>
                            <td>{document.connections.length}</td>
                        </tr>
                    ))
                }
            </tbody>
        </Table>
    );
}

export default TableList;