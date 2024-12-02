import express from "express";
import authMiddleware from "../middlewares/authMiddlewares.mjs";
import { createArea, getAreas } from "../controllers/areas.controller.mjs";

const router = express.Router();

// Areas routes
router.get("/", getAreas);
router.post("/", authMiddleware, createArea);

export default router;
