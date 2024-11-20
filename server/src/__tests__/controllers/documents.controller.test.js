import {
    getDocuments,
    getDocumentById,
    createDocument,
    updateDocument,
} from "../../controllers/documents.controller.mjs";
import documentsDAO from "../../dao/documents.dao.mjs";
import {
    findOriginalResources,
    createOriginalResources,
    deleteOriginalResources,
} from "../../utils/manageResources.mjs";

jest.mock("../../dao/documents.dao.mjs", () => ({
    getDocuments: jest.fn(),
    getDocumentById: jest.fn(),
    createDocument: jest.fn(),
    updateDocument: jest.fn(),
}));

jest.mock("../../utils/manageResources.mjs", () => ({
    findOriginalResources: jest.fn(),
    createOriginalResources: jest.fn(),
    deleteOriginalResources: jest.fn(),
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
        it("should respond with a 200 status and a list of documents with original resources", async () => {
            const mockDocuments = [
                {
                    id: 1,
                    title: "Document 1",
                    toJSON: jest.fn().mockResolvedValue({ id: 1, title: "Document 1" }),
                },
                {
                    id: 2,
                    title: "Document 2",
                    toJSON: jest.fn().mockResolvedValue({ id: 2, title: "Document 2" }),
                },
            ];

            const mockOriginalResources = {
                1: ["file1.txt", "file2.txt"],
                2: ["file3.txt"],
            };

            documentsDAO.getDocuments.mockResolvedValue(mockDocuments);
            findOriginalResources.mockImplementation((id) =>
                Promise.resolve(mockOriginalResources[id])
            );

            await getDocuments(req, res);

            expect(documentsDAO.getDocuments).toHaveBeenCalledTimes(1);
            expect(findOriginalResources).toHaveBeenCalledTimes(mockDocuments.length);
            expect(findOriginalResources).toHaveBeenCalledWith(1);
            expect(findOriginalResources).toHaveBeenCalledWith(2);

            const expectedResponse = {
                documents: [
                    { id: 1, title: "Document 1", originalResources: mockOriginalResources[1] },
                    { id: 2, title: "Document 2", originalResources: mockOriginalResources[2] },
                ],
            };

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expectedResponse);
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
        it("should respond with a 200 status and the document data with original resources", async () => {
            const mockDocument = {
                id: 1,
                title: "Document 1",
                toJSON: jest.fn().mockReturnValue({ id: 1, title: "Document 1" }),
            };
            const mockOriginalResources = ["file1.txt", "file2.txt"];
            req.params.id = "1";

            documentsDAO.getDocumentById.mockResolvedValue(mockDocument);
            findOriginalResources.mockResolvedValue(mockOriginalResources);

            await getDocumentById(req, res);

            expect(documentsDAO.getDocumentById).toHaveBeenCalledWith("1");
            expect(findOriginalResources).toHaveBeenCalledWith("1");

            const expectedResponse = {
                document: {
                    id: 1,
                    title: "Document 1",
                    originalResources: mockOriginalResources,
                },
            };

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expectedResponse);
        });

        it("should respond with a 404 status if document is not found", async () => {
            req.params.id = "1";
            documentsDAO.getDocumentById.mockRejectedValue(new Error("Document not found"));

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
        it("should respond with a 201 status and the new document data, including original resources", async () => {
            const mockDocumentData = {
                id: 1,
                title: "New Document",
            };

            const mockDocument = {
                toJSON: jest.fn().mockReturnValue(mockDocumentData),
            };

            const mockOriginalResources = [
                { id: 1, name: "file1.pdf" },
                { id: 2, name: "file2.pdf" },
            ];

            req.body = {
                documentData: JSON.stringify({
                    title: "New Document",
                    scaleType: "Type A",
                    scaleValue: "1:2.000",
                    issuanceDate: "2022-01-01",
                    type: "Report",
                    language: "English",
                    pages: "100",
                    description: "Test Description",
                    allMunicipality: true,
                    latitude: null,
                    longitude: null,
                    stakeholders: [{ id: 1 }, { id: 2 }],
                    connections: [
                        { documentId: 2, relationship: "Update" },
                        { documentId: 3, relationship: "Prevision" },
                    ],
                }),
            };
            req.files = [{ name: "file1.pdf" }, { name: "file2.pdf" }];

            documentsDAO.createDocument.mockResolvedValue(mockDocument);
            findOriginalResources.mockResolvedValue(mockOriginalResources);
            createOriginalResources.mockImplementation(() => {});
            deleteOriginalResources.mockImplementation(() => {});

            await createDocument(req, res);

            expect(documentsDAO.createDocument).toHaveBeenCalledWith(
                JSON.parse(req.body.documentData)
            );
            expect(deleteOriginalResources).toHaveBeenCalledWith(mockDocumentData.id);
            expect(createOriginalResources).toHaveBeenCalledWith(mockDocumentData.id, req.files);
            expect(findOriginalResources).toHaveBeenCalledWith(mockDocumentData.id);

            const expectedResponse = {
                document: {
                    ...mockDocumentData,
                    originalResources: mockOriginalResources,
                },
            };
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(expectedResponse);
        });

        it("should respond with a 500 status if an error occurs during creation", async () => {
            const error = new Error("Creation error");
            req.body = {
                documentData: JSON.stringify({
                    title: "Invalid Document",
                    type: "Invalid",
                }),
            };
            req.files = [{ name: "invalid_file.pdf" }];

            documentsDAO.createDocument.mockRejectedValue(error);

            await createDocument(req, res);

            expect(documentsDAO.createDocument).toHaveBeenCalledWith(
                JSON.parse(req.body.documentData)
            );

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: "Failed to create document",
                error: error.message,
            });

            expect(deleteOriginalResources).not.toHaveBeenCalled();
            expect(createOriginalResources).not.toHaveBeenCalled();
            expect(findOriginalResources).not.toHaveBeenCalled();
        });
    });

    describe("updateDocument", () => {
        it("should respond with a 200 status and the updated document data, including original resources", async () => {
            const mockDocumentData = {
                id: 1,
                title: "New Document",
            };

            const mockDocument = {
                toJSON: jest.fn().mockReturnValue(mockDocumentData),
            };
            const mockOriginalResources = [
                { id: 1, name: "file1.pdf" },
                { id: 2, name: "file2.pdf" },
            ];

            req.params.id = "1";
            req.body = {
                documentData: JSON.stringify({
                    title: "Updated Document",
                    scaleType: "Type B",
                    scaleValue: "1:5.000",
                    issuanceDate: "2022-02-01",
                    type: "Article",
                    language: "FR",
                    pages: "150",
                    description: "Updated Description",
                    stakeholders: [{ id: 3 }, { id: 4 }],
                    connections: [
                        { documentId: 2, relationship: "Update" },
                        { documentId: 3, relationship: "Prevision" },
                    ],
                }),
            };
            req.files = [{ name: "file1.pdf" }, { name: "file2.pdf" }];

            documentsDAO.updateDocument.mockResolvedValue(mockDocument);
            findOriginalResources.mockResolvedValue(mockOriginalResources);
            deleteOriginalResources.mockImplementation(() => {});
            createOriginalResources.mockImplementation(() => {});

            await updateDocument(req, res);

            expect(documentsDAO.updateDocument).toHaveBeenCalledWith(
                req.params.id,
                JSON.parse(req.body.documentData)
            );

            expect(deleteOriginalResources).toHaveBeenCalledWith(req.params.id);
            expect(createOriginalResources).toHaveBeenCalledWith(req.params.id, req.files);
            expect(findOriginalResources).toHaveBeenCalledWith(mockDocumentData.id);

            const expectedResponse = {
                document: {
                    ...mockDocumentData,
                    originalResources: mockOriginalResources,
                },
            };
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expectedResponse);
        });

        it("should respond with a 500 status if an error occurs during update", async () => {
            const error = new Error("Update error");

            req.params.id = "1";
            req.body = {
                documentData: JSON.stringify({
                    title: "Invalid Document",
                    type: "Invalid",
                }),
            };
            req.files = [{ name: "invalid_file.pdf" }];

            documentsDAO.updateDocument.mockRejectedValue(error);

            await updateDocument(req, res);

            expect(documentsDAO.updateDocument).toHaveBeenCalledWith(
                req.params.id,
                JSON.parse(req.body.documentData)
            );

            expect(deleteOriginalResources).not.toHaveBeenCalled();
            expect(createOriginalResources).not.toHaveBeenCalled();
            expect(findOriginalResources).not.toHaveBeenCalled();

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: "Failed to update document",
                error: error.message,
            });
        });
    });
});
