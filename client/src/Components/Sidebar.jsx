import React from 'react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

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

    const handleMenuClick = (e) => {
        // Check if the clicked item is not a link
        if (e.target.tagName !== 'A') {
            toggleSidebar();
        }
    };

    return (
        <>
            {/* Sidebar */}
            <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}
            onClick={handleMenuClick}
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
                    <li className={`list-group-item ${hoveredItem === "municipalDocuments" ? "active" : ""}`}
                        onMouseEnter={() => setHoveredItem("municipalDocuments")}
                        onAbort={() => setHoveredItem(null)}>
                        <Link to="/municipality" style={{ textDecoration: 'none', color: 'black' }} onClick={closeSidebar}>Municipal Documents</Link>
                    </li>
                    <li className={`list-group-item ${hoveredItem === "allDocuments" ? "active" : ""}`}
                        onMouseEnter={() => setHoveredItem("allDocuments")}
                        onAbort={() => setHoveredItem(null)}>
                        <Link to="/allDocuments" style={{ textDecoration: 'none', color: 'black' }} onClick={closeSidebar}>All documents</Link>
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

export default Sidebar;