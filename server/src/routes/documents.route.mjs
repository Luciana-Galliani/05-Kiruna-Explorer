import express from "express";
import {
    getDocuments,
    createDocument,
} from "../controllers/documents.controller.mjs";

const router = express.Router();

// Documents routes
router.get("/", getDocuments);

router.post("/", createDocument);

export default router;
