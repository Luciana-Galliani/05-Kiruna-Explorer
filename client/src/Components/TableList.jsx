import React, { useState, useEffect, useContext } from "react";
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import { useLocation } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import DetailsPanel from "./DetailsPanel";

const TableList = ({ filter }) => {

    const { isLoggedIn, allDocuments } = useContext(AppContext);

    const [documentsToShow, setDocumentsToShow] = useState([]);
    const [hoveredItem, setHoveredItem] = useState(null);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [isSelected, setIsSelected] = useState(false);
    const location = useLocation();

    

    useEffect(() => {
        const fetchDocuments = async () => {
            const documents = allDocuments;
            //filter documentsToShow based on the condition
            if(filter !== undefined){
                console.log("Applying filter: ");
                console.log(filter);
            }
            else
                console.log("No filter applied");
            const filteredDocuments = documents.filter((document) => {
                //filter the document with all the conditions required
                if(filter !== undefined)
                    return filter.matchFilter(document);
                return true;
            });
            setDocumentsToShow(filteredDocuments);
        };

        fetchDocuments();
    }, [location.pathname, filter, allDocuments]);

    useEffect(() => {
        if (selectedDocument) {
            console.log("Selected document: ");
            console.log(selectedDocument);
            setIsSelected(true);
        }
    }, [selectedDocument]);

    useEffect(() => {
        // Close the deteils pannel and the sidebar when the user clicks on modify
        setIsSelected(false);
    }, [location.pathname]);

    return (
        <div style={{ display:"flex", maxHeight: "70%", overflowY: "auto"}}>
            <div style={{ flex: 1 }}>
            <Table striped unbordered hover responsive>
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
            </div>
            {isSelected && selectedDocument && (
                <Modal
                    size="lg"
                    show= {isSelected}
                    onHide={() => {
                        setSelectedDocument(null);
                        setIsSelected(false);
                    }}
                    className="custom-modal-table-list"
                >
                    <DetailsPanel
                        doc={selectedDocument.id}
                        onClose={() => setSelectedDocument(null)} // Close the details panel
                        isLoggedIn={isLoggedIn}
                    />
                </Modal>
            )}
        </div>
    );
}

export default TableList;