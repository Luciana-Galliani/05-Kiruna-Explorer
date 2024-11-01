import express from "express";
import { getUsers, createUser } from "../controllers/users.controller.mjs";

const router = express.Router();

// Users routes
router.get("/", getUsers);

router.post("/", createUser);

export default router;
