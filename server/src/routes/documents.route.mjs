import express from "express";
import authMiddleware from "../middlewares/authMiddlewares.mjs";
import { upload } from "../middlewares/multer.mjs";
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
router.post("/", authMiddleware, upload.array("files"), createDocument);
router.put("/:id", authMiddleware, upload.array("files"), updateDocument);

export default router;
