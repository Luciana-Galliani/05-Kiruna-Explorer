import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import DescriptionForm from "./Components/Form";
import HomePage from "./Components/HomePage";
import LoginForm from "./Components/LoginForm";
import RegistrationForm from "./Components/RegistrationForm";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import API from "./API/API.mjs";
import "bootstrap-icons/font/bootstrap-icons.css";
import ConfirmationModal from "./Components/ConfirmationModal";
import CityMap from "./Components/Map";
function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [confirmationMessage, setConfirmationMessage] = useState("Are you sure to logout?");
    const location = useLocation();
    const navigate = useNavigate();

    const [coordinates, setCoordinates] = useState(null);
    const [isSelectingCoordinates, setIsSelectingCoordinates] = useState(false);

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
            console.error("Login failed:", error);
            alert("Login failed. Please check your credentials.");
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
            <Header isLoggedIn={isLoggedIn} handleLogout={() => setShowLogoutModal(true)} headerClass={headerClass} isHomePage={isHomePage} />

            {/* Routes */}
            <HomePage isSelectingCoordinates={isSelectingCoordinates} handleCoordinatesSelected={handleCoordinatesSelected} />
            <Routes>
                <Route path="/add" element={!isSelectingCoordinates && <DescriptionForm isLoggedIn={isLoggedIn} coordinates={coordinates} handleChooseInMap={handleChooseInMap} />} />
                <Route path="/login" element={<LoginForm handleLogin={handleLogin} />} />
                <Route path="/registration" element={<RegistrationForm handleLogin={handleLogin} />} />
            </Routes>

            {/* Buttons for the home page */}
            <Footer isHomePage={isHomePage} isLoggedIn={isLoggedIn} location={location} />

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
