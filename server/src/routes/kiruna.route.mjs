import express from "express";
import { getBoundaries } from "../controllers/kiruna.controller.mjs";

const router = express.Router();

// Kiruna routes
router.get("/boundaries", getBoundaries);

export default router;
