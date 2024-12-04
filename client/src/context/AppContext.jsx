import React, { createContext, useState } from "react";
import PropTypes from "prop-types";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [allDocuments, setAllDocuments] = useState([]);
    const [isSelectingCoordinates, setIsSelectingCoordinates] = useState(false);
    const [isSelectingArea, setIsSelectingArea] = useState(false);
    const [areaGeoJSON, setAreaGeoJSON] = useState(null);


    return (
        <AppContext.Provider
            value={{
                isLoggedIn,
                setIsLoggedIn,
                allDocuments,
                setAllDocuments,
                isSelectingCoordinates,
                setIsSelectingCoordinates,
                isSelectingArea,
                setIsSelectingArea,
                areaGeoJSON,
                setAreaGeoJSON

            }}
        >
            {children}
        </AppContext.Provider>
    );
};

AppProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
