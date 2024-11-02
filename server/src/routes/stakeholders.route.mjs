import express from "express";
import { getStakeholders } from "../controllers/stakeholders.controller.mjs";

const router = express.Router();

// Stakeholders routes
router.get("/", getStakeholders);

export default router;
