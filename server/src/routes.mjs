import express from "express";
import usersRoutes from "./routes/users.route.mjs";
import documentsRoutes from "./routes/documents.route.mjs";
import connectionsRoutes from "./routes/connections.route.mjs";
import stakeholdersRoutes from "./routes/stakeholders.route.mjs";

export default (app) => {
    app.use("/api/users", express.json(), usersRoutes);
    app.use("/api/documents", documentsRoutes);
    app.use("/api/connections", connectionsRoutes);
    app.use("/api/stakeholders", stakeholdersRoutes);
};
