import React, { useState, useEffect, useContext } from "react";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import { useLocation } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import DetailsPanel from "./DetailsPanel";
import PropTypes from "prop-types";
import Filter from "../API/Filters/Filter";
import { getIconForType } from "./utils/iconUtils";
import API from "../API/API";

const TableList = ({ filter, seeOnMap, toggleSidebar }) => {
    const see = true;

    const { isLoggedIn, allDocuments, setAllDocuments } = useContext(AppContext);

    const [documentsToShow, setDocumentsToShow] = useState([]);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [isSelected, setIsSelected] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const fetchDocuments = async () => {
            let documents;
            try {
                const response = await API.getDocuments();
                documents = response.documents;
            } catch (error) {
                console.log(error);
            }
            //filter documentsToShow based on the conditions
            const filteredDocuments = documents.filter((document) => {
                //filter the document with all the conditions required
                if (filter !== undefined) return filter.matchFilter(document);
                return true;
            });
            setDocumentsToShow(filteredDocuments);
        };

        fetchDocuments();
    }, [location.pathname, filter, allDocuments]);

    useEffect(() => {
        if (selectedDocument) {
            setIsSelected(true);
        }
    }, [selectedDocument]);

    useEffect(() => {
        // Close the deteils pannel and the sidebar when the user clicks on modify
        setIsSelected(false);
    }, [location.pathname]);

    const documentColor = (doc) => {
        if (doc.stakeholders.length == 1) {
            return doc.stakeholders[0].color;
        }
        return "purple";
    };

    return (
        <div style={{ display: "flex", maxHeight: "70%", overflowY: "auto" }}>
            <div style={{ flex: 1 }}>
                <Table striped unbordered="true" hover responsive>
                    <thead>
                        <tr>
                            <th>Type</th>
                            <th>Title</th>
                            <th>Stakeholder</th>
                            <th>Language</th>
                            <th>Icon</th>
                        </tr>
                    </thead>
                    <tbody>
                        {documentsToShow.map((document, index) => (
                            <tr
                                style={{
                                    cursor: "pointer",
                                }}
                                key={index}
                                onClick={() => setSelectedDocument(document)}
                                tabIndex={0}
                            >
                                <td>{document.type}</td>
                                <td>{document.title}</td>
                                <td>{document.stakeholders[0].name}</td>
                                <td>{document.language}</td>
                                <td>
                                    <img
                                        src={`data:image/svg+xml;utf8,${encodeURIComponent(
                                            getIconForType(document.type, documentColor(document))
                                        )}`}
                                        alt={document.type}
                                        style={{
                                            width: "30px",
                                            height: "30px",
                                            marginLeft: "5px",
                                            padding: "2px",
                                            borderRadius: "50%",
                                        }}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
            {isSelected && selectedDocument && (
                <Modal
                    size="lg"
                    show={isSelected}
                    onHide={() => {
                        setSelectedDocument(null);
                        setIsSelected(false);
                    }}
                    className="custom-modal-table-list"
                    animation={false}
                >
                    <DetailsPanel
                        initialDocId={selectedDocument.id}
                        onClose={() => setSelectedDocument(null)}
                        isLoggedIn={isLoggedIn}
                        seeOnMap={seeOnMap}
                        toggleSidebar={toggleSidebar}
                        see={see}
                    />
                </Modal>
            )}
        </div>
    );
};

TableList.propTypes = {
    filter: PropTypes.instanceOf(Filter).isRequired,
    seeOnMap: PropTypes.func,
    toggleSidebar: PropTypes.func,
};

export default TableList;
