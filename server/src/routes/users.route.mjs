import express from "express";
import { getUser, createUser } from "../controllers/users.controller.mjs";

const router = express.Router();

// Users routes
router.get("/", getUser);

router.post("/", createUser);

export default router;
