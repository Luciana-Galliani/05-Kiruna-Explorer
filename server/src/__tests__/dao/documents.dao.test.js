import documentsDAO from "../../dao/documents.dao.mjs";
import sequelize from "../../sequelize.mjs";
import { Op } from "sequelize";

jest.mock("../../sequelize.mjs", () => ({
    models: {
        Document: {
            findAll: jest.fn(),
            findByPk: jest.fn(),
            create: jest.fn(),
        },
        Connection: {
            create: jest.fn(),
            destroy: jest.fn(),
        },
    },
    transaction: jest.fn(),
}));

describe("DocumentsDAO", () => {
    let document;
    let transaction;

    beforeEach(() => {
        transaction = {};
        document = {};
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("_connectDocuments", () => {
        it("should create a bidirectional connection between documents", async () => {
            document = { id: 1 };
            const otherDocumentId = 2;
            const relationship = "Update";
            const otherDocument = { id: 2 };

            sequelize.models.Document.findByPk.mockResolvedValue(otherDocument);

            await documentsDAO._connectDocuments(
                document,
                otherDocumentId,
                relationship,
                transaction
            );

            expect(sequelize.models.Connection.create).toHaveBeenCalledWith(
                {
                    sourceDocumentId: document.id,
                    targetDocumentId: otherDocument.id,
                    relationship: relationship,
                },
                { transaction }
            );
            expect(sequelize.models.Connection.create).toHaveBeenCalledWith(
                {
                    sourceDocumentId: otherDocument.id,
                    targetDocumentId: document.id,
                    relationship: relationship,
                },
                { transaction }
            );
        });

        it("should throw an error if otherDocument is not found", async () => {
            const otherDocumentId = 2;
            const relationship = "Direct Consequence";

            sequelize.models.Document.findByPk.mockResolvedValue(null);

            await expect(
                documentsDAO._connectDocuments(document, otherDocumentId, relationship, transaction)
            ).rejects.toThrow("Document not found");

            expect(sequelize.models.Connection.create).not.toHaveBeenCalled();
        });

        it("should handle Sequelize errors gracefully", async () => {
            const otherDocumentId = 2;
            const relationship = "Direct Consequence";

            sequelize.models.Document.findByPk.mockRejectedValue(new Error("Sequelize error"));

            await expect(
                documentsDAO._connectDocuments(document, otherDocumentId, relationship, transaction)
            ).rejects.toThrow("Sequelize error");

            expect(sequelize.models.Connection.create).not.toHaveBeenCalled();
        });
    });

    describe("_updateConnectedDocuments", () => {
        beforeEach(() => {
            documentsDAO._connectDocuments = jest.fn();
        });

        it("should throw an error if connections are not provided", async () => {
            await expect(
                documentsDAO._updateConnectedDocuments(document, null, transaction)
            ).rejects.toThrow("Connections are required");

            // Ensure no calls are made to Connection.destroy or removeConnectedDocument
            expect(sequelize.models.Connection.create).not.toHaveBeenCalled();
            expect(documentsDAO._connectDocuments).not.toHaveBeenCalled();
        });

        it("should establish new connections for each item in the connections array", async () => {
            document = { id: 1 };
            const connections = [
                { documentId: 1, relationship: "Direct Consequence" },
                { documentId: 2, relationship: "Collateral Consequence" },
            ];

            await documentsDAO._updateConnectedDocuments(document, connections, transaction);

            expect(sequelize.models.Connection.destroy).toHaveBeenCalledWith({
                where: {
                    [Op.or]: [{ sourceDocumentId: document.id }, { targetDocumentId: document.id }],
                },
                transaction,
            });

            expect(documentsDAO._connectDocuments).toHaveBeenCalledWith(
                document,
                1,
                "Direct Consequence",
                transaction
            );
            expect(documentsDAO._connectDocuments).toHaveBeenCalledWith(
                document,
                2,
                "Collateral Consequence",
                transaction
            );
            expect(documentsDAO._connectDocuments).toHaveBeenCalledTimes(2);
        });

        it("should handle Sequelize errors gracefully", async () => {
            document = { id: 1 };
            const connections = [];

            sequelize.models.Connection.destroy.mockRejectedValue(new Error("Sequelize error"));

            await expect(
                documentsDAO._updateConnectedDocuments(document, connections, transaction)
            ).rejects.toThrow("Sequelize error");

            expect(documentsDAO._connectDocuments).not.toHaveBeenCalled();
        });
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
                    "area",
                    {
                        association: "connections",
                        attributes: ["id", "relationship"],
                        include: {
                            association: "targetDocument",
                        },
                    },
                ],
            });
            expect(result).toEqual(mockDocuments);
        });

        it("should throw an error if fetching documents fails", async () => {
            sequelize.models.Document.findAll.mockRejectedValue(new Error("Fetch error"));

            await expect(documentsDAO.getDocuments()).rejects.toThrow("Failed to fetch documents");
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
                    "area",
                    {
                        association: "connections",
                        attributes: ["id", "relationship"],
                        include: {
                            association: "targetDocument",
                        },
                    },
                ],
            });
            expect(result).toEqual(mockDocument);
        });

        it("should throw an error if document is not found", async () => {
            sequelize.models.Document.findByPk.mockResolvedValue(null);

            await expect(documentsDAO.getDocumentById(1)).rejects.toThrow("Document not found");
        });
    });

    describe("createDocument", () => {
        let transaction;
        let document;

        beforeEach(() => {
            transaction = {
                commit: jest.fn(),
                rollback: jest.fn(),
            };
            sequelize.transaction.mockResolvedValue(transaction);

            document = {
                id: 1,
                setStakeholders: jest.fn(),
                setArea: jest.fn(),
            };

            // Mock methods called in createDocument
            sequelize.models.Document.create.mockResolvedValue(document);
            documentsDAO._connectDocuments = jest.fn();
            documentsDAO.getDocumentById = jest.fn();
        });

        it("should create a document, set stakeholders, set area and connect documents, then commit the transaction", async () => {
            const documentData = {
                title: "Document Title",
                scaleType: "Plan",
                scaleValue: "1:1,000",
                issuanceDate: "2024-01-01",
                type: "report",
                language: "english",
                pages: "1-32",
                description: "A sample document",
                allMunicipality: false,
                latitude: null,
                longitude: null,
                areaId: 1,
                stakeholders: [{ id: 1 }, { id: 2 }],
                connections: [
                    { documentId: 2, relationship: "Prevision" },
                    { documentId: 3, relationship: "Update" },
                ],
            };

            documentsDAO.getDocumentById.mockResolvedValue(document);

            const result = await documentsDAO.createDocument(documentData);

            // Check that a transaction was started
            expect(sequelize.transaction).toHaveBeenCalled();

            // Verify that Document.create was called with correct data and transaction
            expect(sequelize.models.Document.create).toHaveBeenCalledWith(
                {
                    title: documentData.title,
                    scaleType: documentData.scaleType,
                    scaleValue: documentData.scaleValue,
                    issuanceDate: documentData.issuanceDate,
                    type: documentData.type,
                    language: documentData.language,
                    pages: documentData.pages,
                    description: documentData.description,
                    allMunicipality: documentData.allMunicipality,
                    latitude: documentData.latitude,
                    longitude: documentData.longitude,
                },
                { transaction }
            );

            // Verify setStakeholders was called with the correct IDs
            expect(document.setStakeholders).toHaveBeenCalledWith([1, 2], { transaction });

            // Verify setArea was called with the correct ID
            expect(document.setArea).toHaveBeenCalledWith(1, { transaction });

            // Verify _connectDocuments was called for each connection
            expect(documentsDAO._connectDocuments).toHaveBeenCalledWith(
                document,
                2,
                "Prevision",
                transaction
            );
            expect(documentsDAO._connectDocuments).toHaveBeenCalledWith(
                document,
                3,
                "Update",
                transaction
            );
            expect(documentsDAO._connectDocuments).toHaveBeenCalledTimes(2);

            // Check that transaction was committed
            expect(transaction.commit).toHaveBeenCalled();

            // Check that getDocumentById was called with the created document’s ID
            expect(documentsDAO.getDocumentById).toHaveBeenCalledWith(document.id);

            // Verify the final result is the fetched document
            expect(result).toEqual(document);
        });

        it("should rollback the transaction if an error occurs", async () => {
            const documentData = {
                title: "Document Title",
                scaleType: "type1",
                scaleValue: 5,
                issuanceDate: "2024-01-01",
                type: "report",
                language: "en",
                pages: 10,
                description: "A sample document",
                allMunicipality: false,
                latitude: 69,
                longitude: 20,
                stakeholders: [{ id: 1 }, { id: 2 }],
                connections: [{ documentId: 2, relationship: "related" }],
            };

            // Simulate an error in Document.create
            sequelize.models.Document.create.mockRejectedValue(new Error("Creation failed"));

            await expect(documentsDAO.createDocument(documentData)).rejects.toThrow(
                "Creation failed"
            );

            // Ensure transaction was rolled back
            expect(transaction.rollback).toHaveBeenCalled();

            // Ensure other methods were not called after the error
            expect(document.setStakeholders).not.toHaveBeenCalled();
            expect(documentsDAO._connectDocuments).not.toHaveBeenCalled();
            expect(documentsDAO.getDocumentById).not.toHaveBeenCalled();
        });
    });

    describe("updateDocument", () => {
        beforeEach(() => {
            transaction = {
                commit: jest.fn(),
                rollback: jest.fn(),
            };
            sequelize.transaction.mockResolvedValue(transaction);

            document = {
                id: 1,
                update: jest.fn(),
                setStakeholders: jest.fn(),
                setArea: jest.fn(),
            };

            // Mock methods called in updateDocument
            sequelize.models.Document.findByPk.mockResolvedValue(document);
            documentsDAO._updateConnectedDocuments = jest.fn();
            documentsDAO.getDocumentById = jest.fn();
        });

        afterEach(() => {
            jest.clearAllMocks();
        });

        it("should update the document, stakeholders, area and connections, then commit the transaction", async () => {
            const documentData = {
                title: "Updated Title",
                stakeholders: [{ id: 1 }, { id: 2 }],
                areaId: 1,
                connections: [
                    { documentId: 2, relationship: "Prevision" },
                    { documentId: 3, relationship: "Update" },
                ],
            };

            documentsDAO.getDocumentById.mockResolvedValue(document);

            const result = await documentsDAO.updateDocument(1, documentData);

            expect(sequelize.transaction).toHaveBeenCalled();

            expect(sequelize.models.Document.findByPk).toHaveBeenCalledWith(1, { transaction });

            expect(document.update).toHaveBeenCalledWith(documentData, { transaction });

            expect(document.setStakeholders).toHaveBeenCalledWith([1, 2], { transaction });

            expect(document.setArea).toHaveBeenCalledWith(1, { transaction });

            expect(documentsDAO._updateConnectedDocuments).toHaveBeenCalledWith(
                document,
                documentData.connections,
                transaction
            );

            expect(transaction.commit).toHaveBeenCalled();

            expect(documentsDAO.getDocumentById).toHaveBeenCalledWith(document.id);

            expect(result).toEqual(document);
        });
        it("should remove previous area if areaId is null", async () => {
            const documentData = {
                title: "Updated Title",
                stakeholders: [{ id: 1 }, { id: 2 }],
                connections: [
                    { documentId: 2, relationship: "Prevision" },
                    { documentId: 3, relationship: "Update" },
                ],
            };

            documentsDAO.getDocumentById.mockResolvedValue(document);

            const result = await documentsDAO.updateDocument(1, documentData);

            expect(sequelize.transaction).toHaveBeenCalled();

            expect(sequelize.models.Document.findByPk).toHaveBeenCalledWith(1, { transaction });

            expect(document.update).toHaveBeenCalledWith(documentData, { transaction });

            expect(document.setStakeholders).toHaveBeenCalledWith([1, 2], { transaction });

            expect(document.setArea).toHaveBeenCalledWith(null, { transaction });

            expect(documentsDAO._updateConnectedDocuments).toHaveBeenCalledWith(
                document,
                documentData.connections,
                transaction
            );

            expect(transaction.commit).toHaveBeenCalled();

            expect(documentsDAO.getDocumentById).toHaveBeenCalledWith(document.id);

            expect(result).toEqual(document);
        });

        it("should throw an error if the document is not found", async () => {
            sequelize.models.Document.findByPk.mockResolvedValue(null);

            await expect(documentsDAO.updateDocument(1, {})).rejects.toThrow("Document not found");

            // Ensure transaction was rolled back
            expect(transaction.rollback).toHaveBeenCalled();

            // Ensure other methods were not called
            expect(document.update).not.toHaveBeenCalled();
            expect(document.setStakeholders).not.toHaveBeenCalled();
            expect(documentsDAO._updateConnectedDocuments).not.toHaveBeenCalled();
            expect(documentsDAO.getDocumentById).not.toHaveBeenCalled();
        });

        it("should rollback the transaction if an error occurs during update", async () => {
            const documentData = {
                title: "Updated Title",
                stakeholders: [{ id: 1 }],
                connections: [{ documentId: 2, relationship: "Prevision" }],
            };

            // Simulate an error in document.update
            document.update.mockRejectedValue(new Error("Update failed"));

            await expect(documentsDAO.updateDocument(1, documentData)).rejects.toThrow(
                "Update failed"
            );

            // Ensure transaction was rolled back
            expect(transaction.rollback).toHaveBeenCalled();

            // Ensure other methods were not called after the error
            expect(document.setStakeholders).not.toHaveBeenCalled();
            expect(documentsDAO._updateConnectedDocuments).not.toHaveBeenCalled();
            expect(documentsDAO.getDocumentById).not.toHaveBeenCalled();
        });
    });
});
