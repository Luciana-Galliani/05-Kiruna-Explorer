import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import React, { useState, useContext } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { DescriptionForm } from "./Components/Form";
import { EditDocumentForm } from "./Components/EditDocumentForm";
import HomePage from "./Components/HomePage";
import LoginForm from "./Components/LoginForm";
import RegistrationForm from "./Components/RegistrationForm";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import ListDocuments from "./Components/List";
import CityMap from "./Components/Map";
import API from "./API/API.mjs";
import "bootstrap-icons/font/bootstrap-icons.css";
import ConfirmationModal from "./Components/ConfirmationModal";
import { AppContext } from "./context/AppContext";
function App() {
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [confirmationMessage] = useState("Do you really want to logout?");
    const [centerIn, setCenterIn] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    const [coordinates, setCoordinates] = useState(null);
    const [isSatelliteView, setIsSatelliteView] = useState(true);
    const [newArea, setNewArea] = useState(null);

    const { setIsLoggedIn, isSelectingCoordinates, setIsSelectingCoordinates, setIsSelectingArea } = useContext(AppContext);

    const handleSatelliteView = () => {
        setIsSatelliteView(!isSatelliteView);
    };

    const handleCoordinatesSelected = (lon, lat) => {
        setCoordinates({ longitude: lon, latitude: lat });
        setIsSelectingCoordinates(false);
    };
    const handleAreaSelected = (newA) => {
        setNewArea(newA);
        setIsSelectingArea(false);
    }

    const handleLogin = async (username, password) => {
        try {
            const response = await API.loginUser({ username, password });
            localStorage.setItem("authToken", response.token);
            setIsLoggedIn(true);
            navigate("/map");
        } catch (error) {
            throw new Error("Login failed, check your credentials");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        setIsLoggedIn(false);
        navigate("/login");
    };

    const confirmLogout = () => {
        handleLogout();
        setShowLogoutModal(false);
    };

    const seeOnMap = (info) => {
        setCenterIn(info);
    }

    const isHomePage = location.pathname === "/";
    const headerClass = isHomePage ? "position-fixed" : "position-relative";
    const contentPadding = isHomePage ? "0px" : "0px";

    return (
        <div style={{ position: "relative", height: "100vh", paddingTop: contentPadding }}>

            { !isHomePage &&
                <Header
                    handleLogout={() => setShowLogoutModal(true)}
                    headerClass={headerClass}
                    isHomePage={isHomePage}
                    isSatelliteView={isSatelliteView}
                    seeOnMap={seeOnMap}
                />

            }

            <Routes>
                <Route
                    path="/"
                    element={
                        // z-index: number is used to place the element on top of the other elements
                        <HomePage 
                            handleLogout={handleLogout}
                            handleLogin={handleLogin}/>}
                        />
                <Route
                    path="/add"
                    element={
                        <div> 
                            <CityMap
                                handleCoordinatesSelected={handleCoordinatesSelected}
                                isSatelliteView={isSatelliteView}
                                handleSatelliteView={handleSatelliteView}
                                handleAreaSelected={handleAreaSelected}
                                centerIn={centerIn}
                            />
                            <DescriptionForm
                                setCoordinates={setCoordinates}
                                coordinates={coordinates}
                                className={isSelectingCoordinates ? "d-none" : "d-block"}
                                newarea={newArea}
                                setNewArea={setNewArea}
                            />
                        </div>
                    }
                />
                <Route
                    path="edit/:documentId"
                    element={
                        <div>
                            <CityMap
                                handleCoordinatesSelected={handleCoordinatesSelected}
                                isSatelliteView={isSatelliteView}
                                handleSatelliteView={handleSatelliteView}
                                handleAreaSelected={handleAreaSelected}
                                centerIn={centerIn}
                            />
                            <EditDocumentForm
                                setCoordinates={setCoordinates}
                                coordinates={coordinates}
                                className={isSelectingCoordinates ? "d-none" : "d-block"}
                                newarea={newArea}
                                setNewArea={setNewArea}
                            />
                        </div>
                    }
                />
                <Route path="/login" element={
                    <div>
                        { isHomePage ? (
                            <CityMap
                                handleCoordinatesSelected={handleCoordinatesSelected}
                                isSatelliteView={isSatelliteView}
                                handleSatelliteView={handleSatelliteView}
                                handleAreaSelected={handleAreaSelected}
                                centerIn={centerIn}
                            />
                            ) : (
                                <HomePage
                                    handleLogout={handleLogout}
                                    handleLogin={handleLogin}
                                />
                            )
                        }
                        <LoginForm handleLogin={handleLogin}/>
                    </div>} />
                <Route
                    path="/registration"
                    element={
                    <div>
                        <CityMap
                            handleCoordinatesSelected={handleCoordinatesSelected}
                            isSatelliteView={isSatelliteView}
                            handleSatelliteView={handleSatelliteView}
                            handleAreaSelected={handleAreaSelected}
                            centerIn={centerIn}
                        />
                        <RegistrationForm handleLogin={handleLogin} />
                    </div>
                }
                />
                <Route
                    path="/allDocuments"
                    element={<ListDocuments condition="false" />}
                />
                <Route
                    path="/municipality"
                    element={<ListDocuments condition="true" />}
                />
                <Route
                    path="/map"
                    element={
                        <CityMap
                            handleCoordinatesSelected={handleCoordinatesSelected}
                            isSatelliteView={isSatelliteView}
                            handleSatelliteView={handleSatelliteView}
                            handleAreaSelected={handleAreaSelected}
                            centerIn={centerIn}
                        />
                    }
                />
                <Route
                    path="/diagram"
                    element={
                        <CityMap
                            handleCoordinatesSelected={handleCoordinatesSelected}
                            isSatelliteView={isSatelliteView}
                            handleSatelliteView={handleSatelliteView}
                            handleAreaSelected={handleAreaSelected}
                            centerIn={centerIn}
                        />
                    }
                />
            </Routes>
            
            { !isHomePage &&
                <div>
                    <Footer
                        isHomePage={!isHomePage}
                        location={location}
                        isSatelliteView={isSatelliteView}
                        handleSatelliteView={handleSatelliteView}
                        setNewArea={setNewArea}
                        setCoordinates={setCoordinates}
                    />
    
                    <ConfirmationModal
                        show={showLogoutModal}
                        onClose={() => setShowLogoutModal(false)}
                        onConfirm={confirmLogout}
                        message={confirmationMessage}
                    />
                </div>
        }  
        </div>
    );
}

export default App;
