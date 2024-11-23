import React, { createContext, useState } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [allDocuments, setAllDocuments] = useState([]);
    const [isSelectingCoordinates, setIsSelectingCoordinates] = useState(false);

    return (
        <AppContext.Provider
            value={{
                isLoggedIn,
                setIsLoggedIn,
                allDocuments,
                setAllDocuments,
                isSelectingCoordinates,
                setIsSelectingCoordinates
            }}
        >
            {children}
        </AppContext.Provider>
    );
};
