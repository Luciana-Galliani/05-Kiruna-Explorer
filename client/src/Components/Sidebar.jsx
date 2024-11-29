import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import TableList from './TableList';
import SearchBar from './SearchBar';

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
                    width: '50%',
                    backgroundColor: 'white',
                    color: 'black',
                    padding: '20px',
                    transform: isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
                    transition: 'transform 0.3s ease',
                    zIndex: 1001
                }}>
                <div>
                    <SearchBar />
                </div>
                <TableList allMunicipality={false}/>
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
