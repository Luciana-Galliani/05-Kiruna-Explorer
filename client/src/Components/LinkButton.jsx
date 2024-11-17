import React from "react";
import { Link } from "react-router-dom";

const LinkButton = ({ msg, link }) => {
    
    const icon = link === "/add" ? "bi bi-plus" : "bi bi-list";

    return (
        <Link to={link}
            className="btn d-flex align-items-center justify-content-center"
            style={{
                width: "3rem",
                height: "3rem",
                backgroundColor: "#212529",
                borderRadius: "50%",
                color: "white",
                transition: "font-size 0.3s, width 0.3s, border-radius 0.3s",
                position: "relative",
            }}
            title={ msg }
            onMouseEnter={(e) => {
                e.currentTarget.style.width = "8rem";
                e.currentTarget.style.borderRadius = "0.5rem";
                e.currentTarget.querySelector(".add-text").style.transition =
                    "opacity 0.3s 0.1s";
                e.currentTarget.querySelector(".add-text").style.opacity = "1";
                e.currentTarget.querySelector(".add-icon").style.opacity = "0";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.width = "3rem";
                e.currentTarget.style.borderRadius = "50%";
                e.currentTarget.querySelector(".add-text").style.transition = "none";
                e.currentTarget.querySelector(".add-text").style.opacity = "0";
                e.currentTarget.querySelector(".add-icon").style.opacity = "1";
            }}
        >
            <span className="add-icon" style={{ fontSize: "2rem" }}>
                <i className={icon}></i>
            </span>
            <span
                style={{
                    position: "absolute",
                    opacity: "0",
                    fontSize: "1rem",
                }}
                className="add-text"
            >
                { msg }
            </span>
        </Link>
);
}

export default LinkButton;