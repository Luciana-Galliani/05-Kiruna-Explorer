import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import DescriptionForm from "./Components/Form";
import HomePage from "./Components/HomePage";
import LoginForm from "./Components/LoginForm";
import RegistrationForm from "./Components/RegistrationForm";
import API from "./API/API.mjs";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

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

  // Definisci dinamicamente le classi e gli stili dell'header
  const isHomePage = location.pathname === '/';
  const headerClass = isHomePage ? "position-fixed" : "position-relative";
  const contentPadding = isHomePage ? "60px" : "0"; // Regola l'altezza in base all'header

  return (
    <div style={{ position: 'relative', height: '100vh', paddingTop: contentPadding }}>

      {/* Header */}
      <header className={`d-flex justify-content-between align-items-center p-3 w-100 ${headerClass}`} style={{ position: 'fixed', top: 0, zIndex: 2, height: '60px' }}>
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
          ) : (location.pathname !== '/login' && (
            <Link to="/login" className="btn btn-dark">
              Login
            </Link>
          )
          )}
        </div>
      </header>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/add" element={<DescriptionForm getToken={getToken} />} />
        <Route path="/login" element={<LoginForm handleLogin={handleLogin} />} />
        <Route path="/registration" element={<RegistrationForm handleLogin={handleLogin}/>} />
      </Routes>

      {/* Buttons for the home page */}
      {isHomePage && isLoggedIn && (
        <>
          <div className="position-fixed bottom-0 end-0 mb-5" style={{ zIndex: 2 }}>
            <Link to="/add" className="btn btn-dark custom-link">
              Add Document
            </Link>
          </div>
          <div className="position-fixed bottom-0 end-0 mb-2" style={{ zIndex: 2 }}>
            <Link to="/connect" className="btn btn-dark custom-link">
              Connect Documents
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
