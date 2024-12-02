import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import TableList from "./TableList";
import SearchBar from "./SearchBar";
import Filter from "../API/Filters/Filter";

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
    //const [allMunicipality, setAllMunicipality] = useState(false);
    const [filter, setFilter] = useState(new Filter());
    //const [isFilterUpdated, setIsFilterUpdated] = useState(false);

    const handleMunicipality = () => {
        const updatedFilter = new Filter({ ...filter, allMunicipality: !filter.allMunicipality });
        setFilter(updatedFilter);
        //setIsFilterUpdated(!isFilterUpdated);
    };

    const handleAuthor = (author) => {
        const updatedFilter = new Filter({ ...filter, author: author });
        setFilter(updatedFilter);
    };

    const handleTitle = (title) => {
        const updatedFilter = new Filter({ ...filter, title: title });
        setFilter(updatedFilter);
    };

    const handleIssuanceDate = (issuanceDate) => {
        const updatedFilter = new Filter({ ...filter, issuanceDate: issuanceDate });
        setFilter(updatedFilter);
    };

    const handleDescription = (description) => {
        const updatedFilter = new Filter({ ...filter, description: description });
        setFilter(updatedFilter);
    };

    const closeSidebar = () => {
        toggleSidebar();
    };

    const [hoveredItem, setHoveredItem] = useState(null);

    const handleOverlayClick = (e) => {
        // If the overlay was clicked, close the sidebar
        if (e.target.classList.contains("overlay")) {
            toggleSidebar();
        }
    };

    const handleKeyDown = (e, target) => {
        // Allows closing the sidebar when pressing "Enter" or "Space"
        if (e.key === "Enter" || e.key === " ") {
            target.click(); // Trigger the click event
        }
    };

    useEffect(() => {
        // Close the deteils pannel and the sidebar when the user clicks on modify
        closeSidebar();
    }, [location.pathname]);

    return (
        <>
            {/* Sidebar */}
            <div
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        toggleSidebar(); // Chiude la sidebar con tastiera
                    }
                }}
                className={`sidebar ${isSidebarOpen ? "open" : ""}`}
                onClick={handleKeyDown}
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    maxWidth: "95%",
                    height: "100%",
                    backgroundColor: "white",
                    color: "black",
                    padding: "20px",
                    transform: isSidebarOpen ? "translateX(0)" : "translateX(-100%)",
                    transition: "transform 0.3s ease",
                    zIndex: 1001,
                }}
            >
                <div>
                    <h2>Documents</h2>
                </div>
                <div>
                    <SearchBar
                        handleMunicipality={handleMunicipality}
                        handleAuthor={handleAuthor}
                        handleTitle={handleTitle}
                        handleIssuanceDate={handleIssuanceDate}
                        handleDescription={handleDescription}
                    />
                </div>
                <TableList filter={filter} />
            </div>

            {/* Overlay */}
            {isSidebarOpen && (
                <div
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                            toggleSidebar();
                        }
                    }}
                    className="overlay"
                    onClick={handleOverlayClick}
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        zIndex: 1000,
                    }}
                ></div>
            )}
        </>
    );
};

Sidebar.propTypes = {
    isSidebarOpen: PropTypes.bool,
    toggleSidebar: PropTypes.func.isRequired,
};

export default Sidebar;
