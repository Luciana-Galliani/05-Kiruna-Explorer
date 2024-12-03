import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import { AppContext } from "../context/AppContext.jsx";
import PropTypes from "prop-types";

const Header = ({ handleLogout, headerClass, isSatelliteView }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { isLoggedIn } = useContext(AppContext);

    const toggleSidebar = () => {
        setIsSidebarOpen((prevState) => !prevState);
    };

    return (
        <header
            className={`d-flex justify-content-between align-items-center p-3 w-100 ${headerClass}`}
            style={{ position: "fixed", top: 0, zIndex: 2, height: "60px" }}
        >
            <div className="d-flex align-items-center">
                {/* Toggle Sidebar Button */}
                <button
                    onClick={toggleSidebar}
                    style={{
                        backgroundColor: "transparent",
                        color: `${isSatelliteView ? "white" : "black"}`,
                        border: "none",
                        fontSize: "1.5rem",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        marginTop: "0",
                    }}
                >
                    <i className="bi bi-view-list"></i>
                </button>

                {/* Title */}
                <h1
                    className="m-0"
                    style={{
                        transition: "transform 0.3s ease",
                        transform: isSidebarOpen ? "translateX(200px)" : "translateX(0)",
                    }}
                >
                    <Link
                        to="/"
                        className={`${
                            isSatelliteView ? "text-light" : "text-dark"
                        } text-decoration-none`}
                        style={{ fontFamily: "fantasy" }}
                    >
                        Kiruna eXplorer
                    </Link>
                </h1>
            </div>

            <div>
                {isLoggedIn ? (
                    <button
                        className={`btn ${isSatelliteView ? "btn-light" : "btn-dark"}`}
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                ) : (
                    location.pathname !== "/login" && (
                        <Link
                            to="/login"
                            className={`btn ${isSatelliteView ? "btn-light" : "btn-dark"}`}
                        >
                            Login
                        </Link>
                    )
                )}
            </div>

            {/* Sidebar Component */}
            <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={setIsSidebarOpen} />
        </header>
    );
};

Header.propTypes = {
    handleLogout: PropTypes.func.isRequired,
    headerClass: PropTypes.string,
    isSatelliteView: PropTypes.bool.isRequired,
};

export default Header;
