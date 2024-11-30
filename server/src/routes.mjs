import express from "express";
import path from "path";
import usersRoutes from "./routes/users.route.mjs";
import documentsRoutes from "./routes/documents.route.mjs";
import connectionsRoutes from "./routes/connections.route.mjs";
import stakeholdersRoutes from "./routes/stakeholders.route.mjs";
import kirunaRoutes from "./routes/kiruna.route.mjs";

export default (app) => {
    // Serve static files from document_resources
    const documentResourcesPath = path.resolve(process.cwd(), "document_resources");
    app.use(express.static(documentResourcesPath));

    app.use("/api/users", express.json(), usersRoutes);
    app.use("/api/documents", documentsRoutes);
    app.use("/api/connections", connectionsRoutes);
    app.use("/api/stakeholders", stakeholdersRoutes);
    app.use("/api/kiruna", kirunaRoutes);
};
