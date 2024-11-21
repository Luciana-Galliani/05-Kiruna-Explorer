import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import React, { useState } from "react";
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

export const RefreshContext = React.createContext();

function App() {
    const [needRefresh, setNeedRefresh] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [confirmationMessage, setConfirmationMessage] = useState("Do you really want to logout?");
    const location = useLocation();
    const navigate = useNavigate();

    const [coordinates, setCoordinates] = useState(null);
    const [isSelectingCoordinates, setIsSelectingCoordinates] = useState(false);

    const [allDocuments, setAllDocuments] = useState([]);

    const [isSatelliteView, setIsSatelliteView] = useState(true);

    // Handler for deactivating/activating the satellite view
    const handleSatelliteView = () => {
        setIsSatelliteView(!isSatelliteView);
    };

    // Handler per attivare/disattivare la modalità di selezione
    const handleChooseInMap = () => {
        setIsSelectingCoordinates(true);
    };

    // Funzione per aggiornare le coordinate nel form
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
        handleLogout(); // Esegui il logout effettivo
        setShowLogoutModal(false); // Nascondi il modal
    };

    const isHomePage = location.pathname === "/";
    const headerClass = isHomePage ? "position-fixed" : "position-relative";
    const contentPadding = isHomePage ? "60px" : "0";

    return (
        <div style={{ position: "relative", height: "100vh", paddingTop: contentPadding }}>
            {/* Header */}
            <Header
                isLoggedIn={isLoggedIn}
                handleLogout={() => setShowLogoutModal(true)}
                headerClass={headerClass}
                isHomePage={isHomePage}
                isSatelliteView={isSatelliteView}
            />

            {/* Routes */}
            <RefreshContext.Provider value={[needRefresh, setNeedRefresh]}>
                <HomePage
                    isSelectingCoordinates={isSelectingCoordinates}
                    handleCoordinatesSelected={handleCoordinatesSelected}
                    allDocuments={allDocuments}
                    setAllDocuments={setAllDocuments}
                    isSatelliteView={isSatelliteView}
                    handleSatelliteView={handleSatelliteView}
                    isLoggedIn={isLoggedIn}
                />
                <Routes>
                    <Route
                        path="/add"
                        element={
                            <DescriptionForm
                                isLoggedIn={isLoggedIn}
                                coordinates={coordinates}
                                handleChooseInMap={handleChooseInMap}
                                documentOptions={allDocuments}
                                setDocumentOptions={setAllDocuments}
                                className={isSelectingCoordinates ? "d-none" : "d-block"}
                            />
                        }
                    />
                    <Route
                        path="edit/:documentId"
                        element={
                            <EditDocumentForm
                                isLoggedIn={isLoggedIn}
                                coordinates={coordinates}
                                handleChooseInMap={handleChooseInMap}
                                documentOptions={allDocuments}
                                setDocumentOptions={setAllDocuments}
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
                        element={<ListDocuments condition="false" isLoggedIn={isLoggedIn} />}
                    />
                    <Route
                        path="/municipality"
                        element={<ListDocuments condition="true" isLoggedIn={isLoggedIn} />}
                    />
                </Routes>
            </RefreshContext.Provider>

            {/* Buttons for the home page */}
            <Footer
                isHomePage={isHomePage}
                isLoggedIn={isLoggedIn}
                location={location}
                isSatelliteView={isSatelliteView}
                handleSatelliteView={handleSatelliteView}
            />

            {/* Modale di conferma logout */}
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
