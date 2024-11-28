import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {

    const closeSidebar = () => {
        toggleSidebar();
    };

    const [hoveredItem, setHoveredItem] = useState(null);

    const handleOverlayClick = (e) => {
        // If the overlay was clicked, close the sidebar
        if (e.target.classList.contains('overlay')) {
            toggleSidebar();
        }
    };

    const handleKeyDown = (e, target) => {
        // Allows closing the sidebar when pressing "Enter" or "Space"
        if (e.key === 'Enter' || e.key === ' ') {
            target.click();  // Trigger the click event
        }
    };

    return (
        <>
            {/* Sidebar */}
            <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}
                onClick={handleKeyDown}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    height: '100%',
                    width: '250px',
                    backgroundColor: 'white',
                    color: 'black',
                    padding: '20px',
                    transform: isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
                    transition: 'transform 0.3s ease',
                    zIndex: 1001
                }}>
                <h2>Menu</h2>
                <ul className="list-group" style={{ listStyleType: 'none', padding: 0 }}>
                    <li
                        className={`list-group-item ${hoveredItem === "municipalDocuments" ? "active" : ""}`}
                        onMouseEnter={() => setHoveredItem("municipalDocuments")}
                        onMouseLeave={() => setHoveredItem(null)}
                    >
                        <button
                            onClick={closeSidebar}
                            onKeyDown={(e) => handleKeyDown(e, e.target)}
                            style={{ background: 'none', border: 'none', padding: '0', width: '100%' }}
                            aria-label="Municipal Documents"
                        >
                            <Link
                                to="/municipality"
                                style={{
                                    textDecoration: 'none',
                                    color: 'black',
                                    display: 'block'
                                }}
                                onMouseEnter={() => setHoveredItem("municipalDocuments")}
                                onMouseLeave={() => setHoveredItem(null)}
                            >
                                Municipal Documents
                            </Link>
                        </button>
                    </li>
                    <li
                        className={`list-group-item ${hoveredItem === "allDocuments" ? "active" : ""}`}
                        onMouseEnter={() => setHoveredItem("allDocuments")}
                        onMouseLeave={() => setHoveredItem(null)}
                    >
                        <button
                            onClick={closeSidebar}
                            onKeyDown={(e) => handleKeyDown(e, e.target)}  // Aggiungi il supporto per la tastiera
                            style={{ background: 'none', border: 'none', padding: '0', width: '100%' }}
                            aria-label="All documents"
                        >
                            <Link
                                to="/allDocuments"
                                style={{
                                    textDecoration: 'none',
                                    color: 'black',  // Colore per il testo di default
                                    display: 'block'
                                }}
                                onMouseEnter={() => setHoveredItem("allDocuments")}
                                onMouseLeave={() => setHoveredItem(null)}
                            >
                                All documents
                            </Link>
                        </button>
                    </li>
                </ul>
            </div>

            {/* Overlay */}
            {isSidebarOpen && (
                <div className="overlay" onClick={handleOverlayClick} style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    zIndex: 1000
                }}></div>
            )}
        </>
    );
};

Sidebar.propTypes = {
    isSidebarOpen: PropTypes.bool.isRequired,
    toggleSidebar: PropTypes.func.isRequired,
};

export default Sidebar;
