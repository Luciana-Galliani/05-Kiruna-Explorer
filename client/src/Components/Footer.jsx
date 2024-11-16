import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "./ConfirmationModal";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import  LinkButton  from "./LinkButton";

const Footer = ({ isHomePage, isLoggedIn, location }) => {
    const navigate = useNavigate();
    const [showCloseConfirmation, setShowCloseConfirmation] = useState(false);
    return (
        <>
            {isHomePage && isLoggedIn && (
                <div className="position-fixed d-flex flex-column gap-1 bottom-0 end-0 mb-4 me-1">
                    <LinkButton msg="Add Document" link="/add" />
                    <LinkButton msg="Edit Document" link="/edit" /> {/* da togliere poi */}
                    <LinkButton msg="List documents" link="/" />
                </div>
            )}
            {location.pathname === "/add" && (
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

            {/* da aggiornare il path poi */}
            {location.pathname === "/edit" && (
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
