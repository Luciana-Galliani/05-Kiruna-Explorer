import React, { createContext, useState } from "react";

// Creazione del contesto
export const AppContext = createContext();

// Provider per il contesto globale
export const AppProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [allDocuments, setAllDocuments] = useState([]);

    return (
        <AppContext.Provider
            value={{
                isLoggedIn,
                setIsLoggedIn,
                allDocuments,
                setAllDocuments,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};
