import express from "express";
import path from "path";
import usersRoutes from "./routes/users.route.mjs";
import documentsRoutes from "./routes/documents.route.mjs";
import connectionsRoutes from "./routes/connections.route.mjs";
import stakeholdersRoutes from "./routes/stakeholders.route.mjs";

export default (app) => {
    // Resolve the absolute path to the document_resources folder
    const documentResourcesPath = path.resolve(process.cwd(), "document_resources");
    // Serve the static files from the resolved folder
    console.log("Serving static files from:", documentResourcesPath);
    app.use(express.static(documentResourcesPath));

    app.use("/api/users", express.json(), usersRoutes);
    app.use("/api/documents", documentsRoutes);
    app.use("/api/connections", connectionsRoutes);
    app.use("/api/stakeholders", stakeholdersRoutes);
};
