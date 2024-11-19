import React from "react";
import { useState } from "react";
import { useNavigate, matchPath } from "react-router-dom";
import ConfirmationModal from "./ConfirmationModal";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import LinkButton from "./LinkButton";

const Footer = ({ isHomePage, isLoggedIn, location, isSatelliteView, handleSatelliteView }) => {
    const navigate = useNavigate();
    const [showCloseConfirmation, setShowCloseConfirmation] = useState(false);
    const isEditPage = matchPath("/edit/:documentId", location.pathname);
    return (
        <>
            {isHomePage && isLoggedIn && (
                <div className="container">
                    <div className="position-fixed d-flex flex-column gap-1 bottom-0 end-0 mb-4 me-1">
                        <LinkButton msg="Add Document" link="/add" color={isSatelliteView} />
                    </div>
                    <div className="position-fixed d-flex flex-column gap-1 bottom-0 start-0 mb-2 ms-5">
                        <Button className={`btn ${isSatelliteView ? "btn-light" : "btn-dark"}`}
                            onClick={handleSatelliteView}>
                            <i className="bi bi-globe"></i>
                        </Button>
                    </div>
                </div>
            )}
            {(location.pathname === "/add" || location.pathname === "/edit/:documentId") && (
                <div className="position-fixed d-flex flex-column gap-1 bottom-0 end-0 mb-4 me-1">
                    <Button
                        onClick={() => setShowCloseConfirmation(true)}
                        className="btn btn-danger d-flex align-items-center justify-content-center"
                        style={{
                            width: "3rem",
                            height: "3rem",
                            borderRadius: "50%",
                            color: "white",
                            transition: "font-size 0.3s, width 0.3s, border-radius 0.3s",
                            position: "relative",
                        }}
                    >
                        <i
                            className="bi bi-x"
                            style={{ transition: "opacity 0.3s", fontSize: "2rem" }}
                        ></i>
                    </Button>
                </div>
            )}

            {(location.pathname === "/allDocuments" || isEditPage) ? (
                <div className="position-fixed d-flex flex-column gap-1 bottom-0 end-0 mb-4 me-1">
                    <Button
                        onClick={() => navigate("/")}
                        className="btn btn-danger d-flex align-items-center justify-content-center"
                        style={{
                            width: "3rem",
                            height: "3rem",
                            borderRadius: "50%",
                            color: "white",
                            transition: "font-size 0.3s, width 0.3s, border-radius 0.3s",
                            position: "relative",
                        }}
                    >
                        <i
                            className="bi bi-x"
                            style={{ transition: "opacity 0.3s", fontSize: "2rem" }}
                        ></i>
                    </Button>
                </div>
            ) : null}

            {/* Not logged */
                !isLoggedIn && (
                    <div className="container">
                        <div className="position-fixed d-flex flex-column gap-1 bottom-0 start-0 mb-2 ms-5">
                            <Button className={`btn ${isSatelliteView ? "btn-light" : "btn-dark"}`}
                                onClick={handleSatelliteView}>
                                <i className="bi bi-globe"></i>
                            </Button>
                        </div>
                    </div>
                )}

            <ConfirmationModal
                show={showCloseConfirmation}
                onClose={() => setShowCloseConfirmation(false)}
                onConfirm={() => {
                    setShowCloseConfirmation(false);
                    navigate("/");
                }}
                message="Are you sure you want to close the form? Your changes will be lost."
            />
        </>
    );
};

export default Footer;
