import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import React, { useState, useContext } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { DescriptionForm, EditDocumentForm } from "./Components/Form";
import HomePage from "./Components/HomePage";
import LoginForm from "./Components/LoginForm";
import RegistrationForm from "./Components/RegistrationForm";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import ListDocuments from "./Components/List";
import API from "./API/API.mjs";
import "bootstrap-icons/font/bootstrap-icons.css";
import ConfirmationModal from "./Components/ConfirmationModal";
import { AppContext } from "./context/AppContext";

function App() {
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [confirmationMessage, setConfirmationMessage] = useState("Do you really want to logout?");
    const location = useLocation();
    const navigate = useNavigate();

    const [coordinates, setCoordinates] = useState(null);
    const [isSatelliteView, setIsSatelliteView] = useState(true);

    const { setIsLoggedIn, isSelectingCoordinates, setIsSelectingCoordinates } = useContext(AppContext);

    const handleSatelliteView = () => {
        setIsSatelliteView(!isSatelliteView);
    };

    const handleCoordinatesSelected = (lon, lat) => {
        setCoordinates({ longitude: lon, latitude: lat });
        setIsSelectingCoordinates(false);
    };

    const handleLogin = async (username, password) => {
        try {
            const response = await API.loginUser({ username, password });
            localStorage.setItem("authToken", response.token);
            setIsLoggedIn(true);
            navigate("/");
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

    const isHomePage = location.pathname === "/";
    const headerClass = isHomePage ? "position-fixed" : "position-relative";
    const contentPadding = isHomePage ? "60px" : "0";

    return (
        <div style={{ position: "relative", height: "100vh", paddingTop: contentPadding }}>
            <Header
                handleLogout={() => setShowLogoutModal(true)}
                headerClass={headerClass}
                isHomePage={isHomePage}
                isSatelliteView={isSatelliteView}
            />

            <HomePage
                handleCoordinatesSelected={handleCoordinatesSelected}
                isSatelliteView={isSatelliteView}
                handleSatelliteView={handleSatelliteView}
            />

            <Routes>
                <Route
                    path="/add"
                    element={
                        <DescriptionForm
                            setCoordinates={setCoordinates}
                            coordinates={coordinates}
                            className={isSelectingCoordinates ? "d-none" : "d-block"}
                        />
                    }
                />
                <Route
                    path="edit/:documentId"
                    element={
                        <EditDocumentForm
                            setCoordinates={setCoordinates}
                            coordinates={coordinates}
                            className={isSelectingCoordinates ? "d-none" : "d-block"}
                        />
                    }
                />
                <Route path="/login" element={<LoginForm handleLogin={handleLogin} />} />
                <Route
                    path="/registration"
                    element={<RegistrationForm handleLogin={handleLogin} />}
                />
                <Route
                    path="/allDocuments"
                    element={<ListDocuments condition="false" />}
                />
                <Route
                    path="/municipality"
                    element={<ListDocuments condition="true" />}
                />
            </Routes>

            <Footer
                isHomePage={isHomePage}
                location={location}
                isSatelliteView={isSatelliteView}
                handleSatelliteView={handleSatelliteView}
            />

            <ConfirmationModal
                show={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                onConfirm={confirmLogout}
                message={confirmationMessage}
            />
        </div>
    );
}

export default App;
