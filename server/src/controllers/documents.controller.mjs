import documentsDAO from "../dao/documents.dao.mjs";
import {
    findOriginalResources,
    createOriginalResources,
    deleteOriginalResources,
} from "../utils/manageResources.mjs";

export const getDocuments = async (req, res) => {
    try {
        const documents = await documentsDAO.getDocuments();

        // Add original resources in parallel
        const documentsWithResources = await Promise.all(
            documents.map(async (document) => {
                const originalResources = await findOriginalResources(document.id);
                return {
                    ...(await document.toJSON()),
                    originalResources,
                };
            })
        );
        res.status(200).json({ documents: documentsWithResources });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getDocumentById = async (req, res) => {
    try {
        const documentId = req.params.id;

        const document = (await documentsDAO.getDocumentById(documentId)).toJSON();
        document.originalResources = await findOriginalResources(documentId);

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

        const newDocument = (await documentsDAO.createDocument(documentData)).toJSON();

        deleteOriginalResources(newDocument.id);
        createOriginalResources(newDocument.id, files);
        newDocument.originalResources = await findOriginalResources(newDocument.id);

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
        const documentData = JSON.parse(req.body.documentData);

        const updatedDocument = (
            await documentsDAO.updateDocument(documentId, documentData)
        ).toJSON();

        deleteOriginalResources(documentId);
        createOriginalResources(documentId, req.files);

        updatedDocument.originalResources = await findOriginalResources(updatedDocument.id);

        res.status(200).json({ document: updatedDocument });
    } catch (error) {
        console.error("Error in updateDocument controller:", error);
        res.status(500).json({
            message: "Failed to update document",
            error: error.message,
        });
    }
};
