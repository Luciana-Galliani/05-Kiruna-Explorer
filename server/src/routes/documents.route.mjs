import express from "express";
import authMiddleware from "../middlewares/authMiddlewares.mjs";
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
// Authenticated routes
router.post("/", authMiddleware, createDocument);
router.put("/:id", authMiddleware, updateDocument);

export default router;
