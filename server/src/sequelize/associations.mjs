function setupAssociations(sequelize) {
    const { Document, Stakeholder, Connection } = sequelize.models;

    // Define the association between Document and Stakeholder (many-to-many)
    Document.belongsToMany(Stakeholder, {
        through: "document_stakeholder",
        as: "stakeholders",
        foreignKey: "documentId",
    });
    Stakeholder.belongsToMany(Document, {
        through: "document_stakeholder",
        as: "documents",
        foreignKey: "stakeholderId",
    });

    // Define the association between Documents through Connection (self referencing many-to-many)
    Document.belongsToMany(Document, {
        through: Connection,
        as: "connectedDocuments",
        foreignKey: "sourceDocumentId",
        otherKey: "targetDocumentId",
    });
}

export { setupAssociations };
