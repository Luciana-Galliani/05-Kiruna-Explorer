import React from 'react';
import { Link } from 'react-router-dom';

const Footer = ({ isHomePage, isLoggedIn, location }) => {
    return (
        <> 
        {isHomePage && isLoggedIn && (
            <div className="position-fixed d-flex flex-column gap-1 bottom-0 end-0 mb-4 me-1">
                <Link
                    to="/add"
                    className="btn d-flex align-items-center justify-content-center"
                    style={{
                        width: "4rem",
                        height: "4rem",
                        backgroundColor: "#000000",
                        borderRadius: "50%",
                        color: "white",
                        transition: "font-size 0.3s, width 0.3s, border-radius 0.3s",
                        position: "relative",
                    }}
                    title="Add Document"
                    onMouseEnter={(e) => {
                        e.currentTarget.style.width = "8rem";
                        e.currentTarget.style.borderRadius = "0.5rem";
                        e.currentTarget.querySelector(".add-text").style.transition = "opacity 0.3s 0.1s";
                        e.currentTarget.querySelector(".add-text").style.opacity = "1";
                        e.currentTarget.querySelector(".add-icon").style.opacity = "0";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.width = "4rem";
                        e.currentTarget.style.borderRadius = "50%";
                        e.currentTarget.querySelector(".add-text").style.transition = "none";
                        e.currentTarget.querySelector(".add-text").style.opacity = "0";
                        e.currentTarget.querySelector(".add-icon").style.opacity = "1";
                    }}
                >
                    <span className="add-icon" style={{ fontSize: "2rem" }}>
                        <i className="bi bi-plus"></i>
                    </span>
                    <span
                        style={{
                            position: "absolute",
                            opacity: "0",
                            fontSize: "1rem",
                        }}
                        className="add-text"
                    >
                        Add Document
                    </span>
                </Link>
                {/*<Link to="/connect" className="btn btn-dark custom-link">
        Connect Documents
    </Link> */}
            </div>
        )}
        {location.pathname === "/add" && (
            <div className="position-fixed d-flex flex-column gap-1 bottom-0 end-0 mb-4 me-1">
                <Link
                    to="/"
                    className="btn d-flex align-items-center justify-content-center"
                    style={{
                        width: "4rem",
                        height: "4rem",
                        backgroundColor: "red",
                        borderRadius: "50%",
                        color: "white",
                        transition: "font-size 0.3s, width 0.3s, border-radius 0.3s",
                        position: "relative",
                    }}
                >
                    <i className="bi bi-x" style={{ transition: "opacity 0.3s", fontSize: "2rem" }}></i>
                </Link>
            </div>
        )}
        </>
    );
};

export default Footer;