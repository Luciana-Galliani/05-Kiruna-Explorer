import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import DescriptionForm from "./Components/Form";
import HomePage from "./Components/HomePage";
import LoginForm from "./Components/LoginForm";
import RegistrationForm from "./Components/RegistrationForm";
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
            <header
                className={`d-flex justify-content-between align-items-center p-3 w-100 ${headerClass}`}
                style={{ position: "fixed", top: 0, zIndex: 2, height: "60px" }}
            >
                <h1 className="m-0">
                    <Link to="/" className={isHomePage ? "text-dark text-decoration-none" : "text-dark text-decoration-none"}>
                        Kiruna eXplorer
                    </Link>
                </h1>
                <div>
                    {isLoggedIn ? (
                        <button className="btn btn-outline-dark" onClick={handleLogout}>
                            Logout
                        </button>
                    ) : (
                        location.pathname !== "/login" && (
                            <Link to="/login" className="btn btn-dark">
                                Login
                            </Link>
                        )
                    )}
                </div>
            </header>

            {/* Routes */}
            <HomePage />
            <Routes>
                <Route path="/add" element={<DescriptionForm isLoggedIn={isLoggedIn} />} />
                <Route path="/login" element={<LoginForm handleLogin={handleLogin} />} />
                <Route path="/registration" element={<RegistrationForm handleLogin={handleLogin} />} />
            </Routes>
            {/* Buttons for the home page */}
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
        </div>
    );
}

export default App;
