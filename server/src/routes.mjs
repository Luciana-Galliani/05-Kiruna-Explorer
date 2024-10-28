import usersRoutes from "./routes/users.route.mjs";
import documentsRoutes from "./routes/documents.route.mjs";

export default (app) => {
    app.use("/api/users", usersRoutes);
    app.use("/api/documents", documentsRoutes);
};
