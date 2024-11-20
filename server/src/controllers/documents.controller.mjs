import path from "path";
import fs from "fs";
import documentsDAO from "../dao/documents.dao.mjs";

export const getDocuments = async (req, res) => {
    try {
        const documents = await documentsDAO.getDocuments();
        res.status(200).json({ documents: documents });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getDocumentById = async (req, res) => {
    try {
        const documentId = req.params.id;

        const document = await documentsDAO.getDocumentById(documentId);

        res.status(200).json({ document: document });
    } catch (error) {
        console.error("Error in getDocument controller:", error);
        res.status(404).json({
            message: "Document not found",
            error: error.message,
        });
    }
};

export const createDocument = async (req, res) => {
    try {
        const documentData = JSON.parse(req.body.documentData);
        const files = req.files;

        const newDocument = await documentsDAO.createDocument(documentData);

        // Create directory for document resources
        const documentDir = path.join(
            process.cwd(),
            `document_resources/${newDocument.id}/original_resources`
        );
        if (!fs.existsSync(documentDir)) {
            fs.mkdirSync(documentDir, { recursive: true });
        }

        // Move uploaded files to document directory
        files.forEach((file) => {
            const targetPath = path.join(documentDir, file.originalname);
            fs.copyFileSync(file.path, targetPath);
            fs.unlinkSync(file.path);
        });

        res.status(201).json({ document: newDocument });
    } catch (error) {
        console.error("Error in createDocument controller:", error);
        res.status(500).json({
            message: "Failed to create document",
            error: error.message,
        });
    }
};

export const updateDocument = async (req, res) => {
    try {
        const documentId = req.params.id;
        const documentData = {
            title: req.body.title,
            scaleType: req.body.scaleType,
            scaleValue: req.body.scaleValue,
            issuanceDate: req.body.issuanceDate,
            type: req.body.type,
            language: req.body.language,
            pages: req.body.pages,
            description: req.body.description,
            allMunicipality: req.body.allMunicipality,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            stakeholders: req.body.stakeholders,
            connections: req.body.connections,
        };

        const updatedDocument = await documentsDAO.updateDocument(documentId, documentData);

        res.status(200).json({ document: updatedDocument });
    } catch (error) {
        console.error("Error in updateDocument controller:", error);
        res.status(500).json({
            message: "Failed to update document",
            error: error.message,
        });
    }
};
