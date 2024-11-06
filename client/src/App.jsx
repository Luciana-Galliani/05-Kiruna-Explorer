import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import DescriptionForm from "./Components/Form";
import HomePage from "./Components/HomePage";
import LoginForm from "./Components/LoginForm";
import RegistrationForm from "./Components/RegistrationForm";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import API from "./API/API.mjs";
import "bootstrap-icons/font/bootstrap-icons.css";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const getToken = () => localStorage.getItem("authToken");

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

    const isHomePage = location.pathname === "/";
    const headerClass = isHomePage ? "position-fixed" : "position-relative";
    const contentPadding = isHomePage ? "60px" : "0";

    return (
        <div style={{ position: "relative", height: "100vh", paddingTop: contentPadding }}>
            {/* Header */}

            <Header isLoggedIn={isLoggedIn} handleLogout={handleLogout} headerClass={headerClass} isHomePage={isHomePage} />

            {/* Routes */}
            <HomePage />
            <Routes>
                <Route path="/add" element={<DescriptionForm isLoggedIn={isLoggedIn} />} />
                <Route path="/login" element={<LoginForm handleLogin={handleLogin} />} />
                <Route path="/registration" element={<RegistrationForm handleLogin={handleLogin} />} />
            </Routes>

            {/* Buttons for the home page */}
            <Footer isHomePage={isHomePage} isLoggedIn={isLoggedIn} location={location} />
        </div>
    );
}

export default App;
