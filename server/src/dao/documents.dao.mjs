import sequelize from "../sequelize.mjs";

class DocumentsDAO {
    async getDocuments() {
        try {
            const documents = await sequelize.models.Document.findAll({
                include: [
                    {
                        association: "stakeholders",
                        through: {
                            attributes: [],
                        },
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
            return documents;
        } catch (error) {
            throw new Error("Failed to fetch documents");
        }
    }

    async getDocumentById(id) {
        try {
            const document = await sequelize.models.Document.findByPk(id, {
                include: [
                    {
                        association: "stakeholders",
                        through: {
                            attributes: [],
                        },
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
            if (!document) {
                throw new Error("Document not found");
            }
            return document;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async createDocument(documentData) {
        try {
            const document = await sequelize.models.Document.create({
                title: documentData.title,
                scaleType: documentData.scaleType,
                scaleValue: documentData.scaleValue,
                issuanceDate: documentData.issuanceDate,
                type: documentData.type,
                language: documentData.language,
                pages: documentData.pages,
                description: documentData.description,
            });
            const stakeholdersIds = documentData.stakeholders.map(
                (stakeholder) => stakeholder.id
            );
            await document.setStakeholders(stakeholdersIds);
            return await this.getDocumentById(document.id);
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async updateDocument(id, documentData) {
        try {
            // Find the document by ID
            const document = await sequelize.models.Document.findByPk(id);
            if (!document) {
                throw new Error("Document not found");
            }

            // Update the document
            await document.update(documentData);
            const stakeholdersIds = documentData.stakeholders.map(
                (stakeholder) => stakeholder.id
            );
            await document.setStakeholders(stakeholdersIds);
            return await this.getDocumentById(document.id);
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

export default new DocumentsDAO();
