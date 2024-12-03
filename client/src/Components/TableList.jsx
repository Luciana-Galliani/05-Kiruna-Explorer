import React, { useState, useEffect, useContext } from "react";
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import { useLocation } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import DetailsPanel from "./DetailsPanel";
import designIcon from "../Icons/design.svg";
import informativeIcon from "../Icons/informative.svg";
import prescriptiveIcon from "../Icons/prescriptive.svg";
import technicalIcon from "../Icons/technical.svg";
import agreementIcon from "../Icons/agreement.svg";
import conflictIcon from "../Icons/conflict.svg";
import consultationIcon from "../Icons/consultation.svg";
import actionIcon from "../Icons/action.svg";
import PropTypes from "prop-types";
import Filter from "../API/Filters/Filter";


const TableList = ({ filter }) => {

    const icon = {
        "Design Document": designIcon,
        "Informative Document": informativeIcon,
        "Prescriptive Document": prescriptiveIcon,
        "Technical Document": technicalIcon,
        Agreement: agreementIcon,
        Conflict: conflictIcon,
        Consultation: consultationIcon,
        Action: actionIcon,
    }

    const { isLoggedIn, allDocuments } = useContext(AppContext);

    const [documentsToShow, setDocumentsToShow] = useState([]);
    const [hoveredItem, setHoveredItem] = useState(null);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [isSelected, setIsSelected] = useState(false);
    const location = useLocation();

    const img = new Image();



    useEffect(() => {
        const fetchDocuments = async () => {
            const documents = allDocuments;
            //filter documentsToShow based on the conditions
            const filteredDocuments = documents.filter((document) => {
                //filter the document with all the conditions required
                if (filter !== undefined)
                    return filter.matchFilter(document);
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

    return (
        <div style={{ display: "flex", maxHeight: "70%", overflowY: "auto" }}>
            <div style={{ flex: 1 }}>
                <Table striped unbordered='true' hover responsive>
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
                        {
                            documentsToShow.map((document, index) => (
                                img.src = icon[document.type],
                                <tr key={index} onClick={() => setSelectedDocument(document)} tabIndex={0}>
                                    <td>{document.type}</td>
                                    <td>{document.title}</td>
                                    <td>{document.stakeholders[0].name}</td>
                                    <td>{document.language}</td>
                                    <td>{icon[document.type] &&
                                        <img src={img.src}
                                            alt={document.type}
                                            style={{
                                                width: "30px", height: "30px", marginLeft: "5px",
                                                padding: "2px", borderRadius: "50%"
                                            }} />}
                                    </td>
                                </tr>
                            ))
                        }
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
                    unmountOnExit={false}
                    animation={false} // Disabilita l'animazione del Modale
                >
                    <DetailsPanel
                        initialDocId={selectedDocument.id}
                        onClose={() => setSelectedDocument(null)}
                        isLoggedIn={isLoggedIn}
                    />
                </Modal>


            )}
        </div>
    );
}

TableList.propTypes = {
    filter: PropTypes.instanceOf(Filter).isRequired,
};

export default TableList;