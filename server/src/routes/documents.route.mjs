import express from "express";
import {
    getDocuments,
    getDocumentById,
    createDocument,
    updateDocument,
} from "../controllers/documents.controller.mjs";

const router = express.Router();

// Documents routes
router.get("/", getDocuments);
router.get("/:id", getDocumentById);
router.post("/", createDocument);
router.put("/:id", updateDocument);

export default router;
