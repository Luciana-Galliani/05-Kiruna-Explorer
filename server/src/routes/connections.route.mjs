import express from "express";
import { getConnections } from "../controllers/connections.controller.mjs";

const router = express.Router();

// Connections routes
router.get("/", getConnections);

export default router;
