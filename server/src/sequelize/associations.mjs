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

    // Define the association between Documents through Connection (2 one-to-many relationships)
    Document.hasMany(Connection, {
        as: "connections",
        foreignKey: "sourceDocumentId",
    });
    Connection.belongsTo(Document, {
        foreignKey: "sourceDocumentId",
        as: "sourceDocument",
    });
    Document.hasMany(Connection, {
        foreignKey: "targetDocumentId",
    });
    Connection.belongsTo(Document, {
        foreignKey: "targetDocumentId",
        as: "targetDocument",
    });
}

export { setupAssociations };
