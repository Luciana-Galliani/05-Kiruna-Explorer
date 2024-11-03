import documentsDAO from "../../dao/documents.dao.mjs";
import sequelize from "../../sequelize.mjs";

jest.mock("../../sequelize.mjs", () => ({
    models: {
        Document: {
            findAll: jest.fn(),
            findByPk: jest.fn(),
            create: jest.fn(),
        },
    },
}));

describe("DocumentsDAO", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("getDocuments", () => {
        it("should return a list of documents", async () => {
            const mockDocuments = [{ id: 1 }, { id: 2 }];
            sequelize.models.Document.findAll.mockResolvedValue(mockDocuments);

            const result = await documentsDAO.getDocuments();

            expect(sequelize.models.Document.findAll).toHaveBeenCalledWith({
                include: [
                    {
                        association: "stakeholders",
                        through: { attributes: [] },
                    },
                    {
                        association: "connectedDocuments",
                        through: {
                            as: "connection",
                            attributes: ["relationship"],
                        },
                    },
                ],
            });
            expect(result).toEqual(mockDocuments);
        });

        it("should throw an error if fetching documents fails", async () => {
            sequelize.models.Document.findAll.mockRejectedValue(
                new Error("Fetch error")
            );

            await expect(documentsDAO.getDocuments()).rejects.toThrow(
                "Failed to fetch documents"
            );
        });
    });

    describe("getDocumentById", () => {
        it("should return a document by ID", async () => {
            const mockDocument = { id: 1 };
            sequelize.models.Document.findByPk.mockResolvedValue(mockDocument);

            const result = await documentsDAO.getDocumentById(1);

            expect(sequelize.models.Document.findByPk).toHaveBeenCalledWith(1, {
                include: [
                    {
                        association: "stakeholders",
                        through: { attributes: [] },
                    },
                    {
                        association: "connectedDocuments",
                        through: {
                            as: "connection",
                            attributes: ["relationship"],
                        },
                    },
                ],
            });
            expect(result).toEqual(mockDocument);
        });

        it("should throw an error if document is not found", async () => {
            sequelize.models.Document.findByPk.mockResolvedValue(null);

            await expect(documentsDAO.getDocumentById(1)).rejects.toThrow(
                "Document not found"
            );
        });
    });

    describe("createDocument", () => {
        it("should create a new document and return it", async () => {
            const mockDocumentData = {
                title: "Test Document",
                scaleType: "A",
                scaleValue: 1,
                issuanceDate: "2022-01-01",
                type: "Report",
                language: "EN",
                pages: 10,
                description: "Test description",
                stakeholders: [{ id: 1 }, { id: 2 }],
            };
            const mockDocument = { id: 1, setStakeholders: jest.fn() };
            sequelize.models.Document.create.mockResolvedValue(mockDocument);
            jest.spyOn(documentsDAO, "getDocumentById").mockResolvedValue(
                mockDocument
            );

            const result = await documentsDAO.createDocument(mockDocumentData);

            expect(sequelize.models.Document.create).toHaveBeenCalledWith({
                title: "Test Document",
                scaleType: "A",
                scaleValue: 1,
                issuanceDate: "2022-01-01",
                type: "Report",
                language: "EN",
                pages: 10,
                description: "Test description",
            });
            expect(mockDocument.setStakeholders).toHaveBeenCalledWith([1, 2]);
            expect(documentsDAO.getDocumentById).toHaveBeenCalledWith(1);
            expect(result).toEqual(mockDocument);
        });

        it("should throw an error if creating document fails", async () => {
            sequelize.models.Document.create.mockRejectedValue(
                new Error("Create error")
            );

            await expect(documentsDAO.createDocument({})).rejects.toThrow(
                "Create error"
            );
        });
    });

    describe("updateDocument", () => {
        it("should update a document and return the updated document", async () => {
            const mockDocumentData = {
                title: "Updated Title",
                stakeholders: [{ id: 1 }, { id: 2 }],
            };
            const mockDocument = {
                id: 1,
                update: jest.fn(),
                setStakeholders: jest.fn(),
            };
            sequelize.models.Document.findByPk.mockResolvedValue(mockDocument);
            jest.spyOn(documentsDAO, "getDocumentById").mockResolvedValue(
                mockDocument
            );

            const result = await documentsDAO.updateDocument(
                1,
                mockDocumentData
            );

            expect(sequelize.models.Document.findByPk).toHaveBeenCalledWith(1);
            expect(mockDocument.update).toHaveBeenCalledWith(mockDocumentData);
            expect(mockDocument.setStakeholders).toHaveBeenCalledWith([1, 2]);
            expect(documentsDAO.getDocumentById).toHaveBeenCalledWith(1);
            expect(result).toEqual(mockDocument);
        });

        it("should throw an error if document is not found", async () => {
            sequelize.models.Document.findByPk.mockResolvedValue(null);

            await expect(documentsDAO.updateDocument(1, {})).rejects.toThrow(
                "Document not found"
            );
        });

        it("should throw an error if updating document fails", async () => {
            const mockDocument = { update: jest.fn() };
            sequelize.models.Document.findByPk.mockResolvedValue(mockDocument);
            mockDocument.update.mockRejectedValue(new Error("Update error"));

            await expect(documentsDAO.updateDocument(1, {})).rejects.toThrow(
                "Update error"
            );
        });
    });
});
