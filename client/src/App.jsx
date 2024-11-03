import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import DescriptionForm from "./Components/Form";
import HomePage from "./Components/HomePage";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => setIsLoggedIn(false);

  return (
    <div style={{ position: 'relative', height: '100vh' }}>
      {/* Routes */}
      <Routes>
        <Route
          path="/"
          element={<HomePage
            isLoggedIn={isLoggedIn}
            handleLogin={handleLogin}
            handleLogout={handleLogout}
          />}
        />
        <Route path="/add" element={<DescriptionForm />} />
      </Routes>
    </div>
  );
}

export default App;
