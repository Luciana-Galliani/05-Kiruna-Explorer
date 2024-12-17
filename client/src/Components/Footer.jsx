import { useState, useContext } from "react";
import { useNavigate, matchPath } from "react-router-dom";
import ConfirmationModal from "./ConfirmationModal";
import { Button, ButtonGroup } from "react-bootstrap";
import { AppContext } from "../context/AppContext";
import LinkButton from "./LinkButton";
import PropTypes from "prop-types";
import { lineOverlap } from "@turf/turf";

const Footer = ({
    isHomePage,
    location,
    isSatelliteView,
    handleSatelliteView,
    setNewArea,
    setCoordinates,
}) => {
    const navigate = useNavigate();
    const { isLoggedIn, setIsSelectingCoordinates, setIsSelectingArea } = useContext(AppContext);
    const [showCloseConfirmation, setShowCloseConfirmation] = useState(false);
    const isEditPage = matchPath("/edit/:documentId", location.pathname);
    return (
        <>
            {isHomePage && isLoggedIn && location.pathname !== "/diagram" && (
                <div className="container">
                    <div className="position-fixed d-flex flex-column gap-1 bottom-0 end-0 mb-4 me-1">
                        <LinkButton msg="Add Document" link="/add" color={isSatelliteView} />
                    </div>
                    <div className="position-fixed d-flex flex-column gap-1 bottom-0 start-0 mb-2 ms-5">
                        <ButtonGroup>
                            <Button
                                className={`btn ${isSatelliteView ? "btn-light" : "btn-dark"}`}
                                onClick={handleSatelliteView}
                            >
                                <i className="bi bi-globe"></i>
                            </Button>
                            <Button
                                className={`btn ${isSatelliteView ? "btn-light" : "btn-dark"}`}
                                onClick={() => navigate("/diagram")}
                            >
                                <i className="bi bi-diagram-3"></i>
                            </Button>
                        </ButtonGroup>
                    </div>
                </div>
            )}
            {(location.pathname === "/add" || location.pathname === "/edit/:documentId") && location.pathname !== "/diagram" && (
                <div className="position-fixed d-flex flex-column gap-1 bottom-0 end-0 mb-4 me-1">
                    <Button
                        onClick={() => {
                            setShowCloseConfirmation(true);
                            setNewArea(null);
                            setCoordinates((prev) => ({
                                ...prev,
                                latitude: null,
                                longitude: null,
                            }));
                        }}
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

            {location.pathname === "/allDocuments" ||
            isEditPage ||
            location.pathname === "/municipality" ? (
                <div className="position-fixed d-flex flex-column gap-1 bottom-0 end-0 mb-4 me-1">
                    <Button
                        onClick={() => {
                            setIsSelectingCoordinates(false);
                            navigate("/map");
                            setNewArea(null);
                            setIsSelectingArea(false);
                        }}
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

            {
                /* Not logged */
                !isLoggedIn && location.pathname !== "/diagram" && (
                    <div className="container">
                        <div className="position-fixed d-flex flex-column gap-1 bottom-0 start-0 mb-2 ms-5">
                            <ButtonGroup> 
                                <Button
                                    className={`btn ${isSatelliteView ? "btn-light" : "btn-dark"}`}
                                    onClick={handleSatelliteView}
                                >
                                    <i className="bi bi-globe"></i>
                                </Button>
                                <Button
                                    className={`btn ${isSatelliteView ? "btn-light" : "btn-dark"}`}
                                    onClick={() => navigate("/diagram")}
                                >
                                    <i className="bi bi-diagram-3"></i>
                                </Button>
                            </ButtonGroup>
                        </div>
                    </div>
                )
            }

            {
                location.pathname === "/diagram" && (
                    <div className="container" zIndex="0">
                        <div className="position-fixed d-flex flex-column gap-1 bottom-0 start-0 mb-2 ms-3">
                            <ButtonGroup> 
                                <Button
                                    className={`btn ${isSatelliteView ? "btn-light" : "btn-dark"}`}
                                    onClick={() => navigate("/map")}
                                >
                                    <i className="bi bi-map"></i>
                                </Button>
                            </ButtonGroup>
                        </div>
                    </div>
                )
            }

            <ConfirmationModal
                show={showCloseConfirmation}
                onClose={() => setShowCloseConfirmation(false)}
                onConfirm={() => {
                    setShowCloseConfirmation(false);
                    setIsSelectingCoordinates(false);
                    setIsSelectingArea(false);
                    navigate("/map");
                }}
                message="Are you sure you want to close the form? Your changes will be lost."
            />
        </>
    );
};

Footer.propTypes = {
    isHomePage: PropTypes.bool.isRequired,
    location: PropTypes.object.isRequired,
    isSatelliteView: PropTypes.bool.isRequired,
    handleSatelliteView: PropTypes.func.isRequired,
    setNewArea: PropTypes.func.isRequired,
    setCoordinates: PropTypes.func.isRequired,
};

export default Footer;
