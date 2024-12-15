import React, { useState } from "react";

const Legend = () => {
    const [expanded, setExpanded] = useState(false);

    const toggleLegend = () => {
        setExpanded((prev) => !prev);
    };

    const relationshipStyles = [
        { type: "Direct Consequence", style: "Solid line" },
        { type: "Collateral Consequence", style: "Dashed line" },
        { type: "Prevision", style: "Dotted line" },
        { type: "Update", style: "Dash-dotted line" },
    ];

    return (
        <div
            className={`legend ${expanded ? "expanded" : "collapsed"}`}
            onMouseEnter={toggleLegend}
            onMouseLeave={toggleLegend}
            style={{
                position: "absolute",
                bottom: "20px",
                right: "20px",
                padding: expanded ? "20px" : "10px",
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                cursor: "pointer",
                transition: "all 0.3s ease-in-out",
                maxWidth: expanded ? "300px" : "120px",
                overflow: "hidden",
            }}
        >
            <h6 style={{ margin: 0, textAlign: "center" }}>Relationships</h6>
            {expanded && (
                <ul style={{ listStyleType: "none", padding: "10px 0", margin: 0 }}>
                    {relationshipStyles.map((rel, index) => (
                        <li
                            key={index}
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: "5px",
                            }}
                        >
                            <span>{rel.type}</span>
                            <span
                                style={{
                                    width: "60px",
                                    height: "2px",
                                    display: "block",
                                    borderBottom:
                                        rel.style === "Dashed line"
                                            ? "2px dashed black"
                                            : rel.style === "Dotted line"
                                                ? "2px dotted black"
                                                : rel.style === "Dash-dotted line"
                                                    ? "2px dashed black" // Dash-dotted può essere simulato così
                                                    : "2px solid black",
                                }}
                            ></span>

                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Legend;