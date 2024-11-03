import {
    getDocuments,
    getDocumentById,
    createDocument,
    updateDocument,
} from "../../controllers/documents.controller.mjs";
import documentsDAO from "../../dao/documents.dao.mjs";

jest.mock("../../dao/documents.dao.mjs", () => ({
    getDocuments: jest.fn(),
    getDocumentById: jest.fn(),
    createDocument: jest.fn(),
    updateDocument: jest.fn(),
}));

describe("Documents Controller", () => {
    let req, res;

    beforeEach(() => {
        req = { params: {}, body: {} }; // Mock request object
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("getDocuments", () => {
        it("should respond with a 200 status and a list of documents", async () => {
            const mockDocuments = [
                { id: 1, title: "Document 1" },
                { id: 2, title: "Document 2" },
            ];
            documentsDAO.getDocuments.mockResolvedValue(mockDocuments);

            await getDocuments(req, res);

            expect(documentsDAO.getDocuments).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ documents: mockDocuments });
        });

        it("should respond with a 500 status if an error occurs", async () => {
            const error = new Error("Database error");
            documentsDAO.getDocuments.mockRejectedValue(error);

            await getDocuments(req, res);

            expect(documentsDAO.getDocuments).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: error.message });
        });
    });

    describe("getDocumentById", () => {
        it("should respond with a 200 status and the document data", async () => {
            const mockDocument = { id: 1, title: "Document 1" };
            req.params.id = "1";
            documentsDAO.getDocumentById.mockResolvedValue(mockDocument);

            await getDocumentById(req, res);

            expect(documentsDAO.getDocumentById).toHaveBeenCalledWith("1");
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ document: mockDocument });
        });

        it("should respond with a 404 status if document is not found", async () => {
            req.params.id = "1";
            documentsDAO.getDocumentById.mockRejectedValue(
                new Error("Document not found")
            );

            await getDocumentById(req, res);

            expect(documentsDAO.getDocumentById).toHaveBeenCalledWith("1");
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                message: "Document not found",
                error: "Document not found",
            });
        });
    });

    describe("createDocument", () => {
        it("should respond with a 201 status and the new document data", async () => {
            const mockDocument = { id: 1, title: "New Document" };
            req.body = {
                title: "New Document",
                scaleType: "Type A",
                scaleValue: "1:2.000",
                issuanceDate: "2022-01-01",
                type: "Report",
                language: "English",
                pages: "100",
                description: "Test Description",
                stakeholders: [{ id: 1 }, { id: 2 }],
            };
            documentsDAO.createDocument.mockResolvedValue(mockDocument);

            await createDocument(req, res);

            expect(documentsDAO.createDocument).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ document: mockDocument });
        });

        it("should respond with a 500 status if an error occurs during creation", async () => {
            const error = new Error("Creation error");
            documentsDAO.createDocument.mockRejectedValue(error);

            await createDocument(req, res);

            expect(documentsDAO.createDocument).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: "Failed to create document",
                error: error.message,
            });
        });
    });

    describe("updateDocument", () => {
        it("should respond with a 200 status and the updated document data", async () => {
            const mockDocument = { id: 1, title: "Updated Document" };
            req.params.id = "1";
            req.body = {
                title: "Updated Document",
                scaleType: "Type B",
                scaleValue: "1:5.000",
                issuanceDate: "2022-02-01",
                type: "Article",
                language: "FR",
                pages: "150",
                description: "Updated Description",
                stakeholders: [{ id: 3 }, { id: 4 }],
            };
            documentsDAO.updateDocument.mockResolvedValue(mockDocument);

            await updateDocument(req, res);

            expect(documentsDAO.updateDocument).toHaveBeenCalledWith(
                "1",
                req.body
            );
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ document: mockDocument });
        });

        it("should respond with a 500 status if an error occurs during update", async () => {
            const error = new Error("Update error");
            req.params.id = "1";
            documentsDAO.updateDocument.mockRejectedValue(error);

            await updateDocument(req, res);

            expect(documentsDAO.updateDocument).toHaveBeenCalledWith(
                "1",
                req.body
            );
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: "Failed to update document",
                error: error.message,
            });
        });
    });
});
