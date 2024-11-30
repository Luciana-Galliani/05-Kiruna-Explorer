import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.jsx";
import { AppProvider } from "./context/AppContext";

const router = createBrowserRouter([{ path: "/*", element: <App /> }]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <AppProvider>
            <RouterProvider router={router} />
        </AppProvider>
    </React.StrictMode>
);
