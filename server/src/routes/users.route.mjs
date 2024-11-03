import express from "express";
import { loginUser, registerUser } from "../controllers/users.controller.mjs";

const router = express.Router();

// Users routes
router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;
