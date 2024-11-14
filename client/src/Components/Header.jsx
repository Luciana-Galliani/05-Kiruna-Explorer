import React from "react";
import { Link } from "react-router-dom";

const Header = ({ isLoggedIn, handleLogout, headerClass, isHomePage }) => {
    return (
        <header
            className={`d-flex justify-content-between align-items-center p-3 w-100 ${headerClass}`}
            style={{ position: "fixed", top: 0, zIndex: 2, height: "60px" }}
        >
            <h1 className="m-0">
                <Link to="/" className={"text-dark text-decoration-none"} style={{ fontFamily: "fantasy" }}>
                    Kiruna eXploreerer
                </Link>
            </h1>
            <div>
                {isLoggedIn ? (
                    <button className="btn btn-dark" onClick={handleLogout}>
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
    );
};

export default Header;
