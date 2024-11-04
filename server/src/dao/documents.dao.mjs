import sequelize from "../sequelize.mjs";

class DocumentsDAO {
    async _connectDocuments(document, otherDocumentId, relationship, transaction) {
        const otherDocument = await sequelize.models.Document.findByPk(otherDocumentId, { transaction });
        if (!otherDocument) {
            throw new Error("Document not found");
        }

        // Bidirectional connection with transaction
        await document.addConnectedDocument(otherDocument, {
            through: { relationship: relationship },
            transaction,
        });
        await otherDocument.addConnectedDocument(document, {
            through: { relationship: relationship },
            transaction,
        });
    }

    async _updateConnectedDocuments(document, connections, transaction) {
        if (!connections) {
            throw new Error("Connections are required");
        }

        // Retrieve current connected documents
        const currentConnections = await document.getConnectedDocuments({ transaction });

        // Disconnect only the necessary connections in both directions
        for (const currentConnection of currentConnections) {
            if (!connections.some((conn) => conn.documentId === currentConnection.id)) {
                // Remove connection in both directions
                await document.removeConnectedDocument(currentConnection, { transaction });
                await currentConnection.removeConnectedDocument(document, { transaction });
            }
        }

        // Establish new or modified connections
        for (const connection of connections) {
            await this._connectDocuments(document, connection.documentId, connection.relationship, transaction);
        }
    }

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
        const transaction = await sequelize.transaction();

        try {
            const document = await sequelize.models.Document.create(
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

            // Set stakeholders
            const stakeholdersIds = documentData.stakeholders.map((stakeholder) => stakeholder.id);
            await document.setStakeholders(stakeholdersIds, { transaction });

            // Set connected documents
            if(documentData.connections !== undefined) {
                for (const connection of documentData.connections) {
                    await this._connectDocuments(document, connection.documentId, connection.relationship, transaction);
                }
            }

            await transaction.commit();
            return await this.getDocumentById(document.id);
        } catch (error) {
            await transaction.rollback();
            throw new Error(error.message);
        }
    }

    async updateDocument(id, documentData) {
        const transaction = await sequelize.transaction();

        try {
            // Find the document by ID with transaction
            const document = await sequelize.models.Document.findByPk(id, {
                transaction,
            });
            if (!document) {
                throw new Error("Document not found");
            }

            // Update the document with transaction
            await document.update(documentData, { transaction });

            // Update stakeholders with transaction
            const stakeholdersIds = documentData.stakeholders.map((stakeholder) => stakeholder.id);
            await document.setStakeholders(stakeholdersIds, { transaction });

            // Update connected documents
            await this._updateConnectedDocuments(document, documentData.connections, transaction);

            await transaction.commit();
            return await this.getDocumentById(document.id);
        } catch (error) {
            await transaction.rollback();
            throw new Error(error.message);
        }
    }
}

export default new DocumentsDAO();
