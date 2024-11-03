import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = ({ isLoggedIn, handleLogin, handleLogout }) => {
    return (
        <div className="homepage text-center text-white position-relative" style={{ backgroundImage: 'url("../../This_is_Kiruna.jpg")', backgroundSize: 'cover', backgroundPosition: 'center', height: '100vh' }}>
            <div className="overlay position-absolute w-100 h-100" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}></div>
            <header className="d-flex justify-content-between align-items-center p-3 position-absolute w-100" style={{ zIndex: 2 }}>
                <h1 className="m-0">
                    <Link to="/" className="text-light text-decoration-none">Kiruna eXplorer</Link>
                </h1>
                <div>
                    {isLoggedIn ? (
                        <button className="btn btn-outline-light" onClick={handleLogout}>
                            Logout
                        </button>
                    ) : (
                        <button className="btn btn-light" onClick={handleLogin}>
                            Login
                        </button>
                    )}
                </div>
            </header>

            {/* Add Document Button */}
            <div className="position-fixed bottom-0 end-0 mb-5" style={{ zIndex: 2 }}>
                <Link to="/add" className="btn btn-outline-light custom-link">
                    Add Document
                </Link>
            </div>
            {/* Connect Documents Button */}
            <div className="position-fixed bottom-0 end-0 mb-2" style={{ zIndex: 2 }}>
                <Link to="/connect" className="btn btn-outline-light custom-link">
                    Connect Documents
                </Link>
            </div>
        </div>
    );
};

export default HomePage;
