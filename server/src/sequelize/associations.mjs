function setupAssociations(sequelize) {
    const { document, stakeholder, connection } = sequelize.models;

    // Define the association between Document and Stakeholder (many-to-many)
    document.belongsToMany(stakeholder, { through: "document_stakeholder" });
    stakeholder.belongsToMany(document, { through: "document_stakeholder" });

    // Define the association between Documents through Connection (many-to-many)
    document.belongsToMany(document, {
        through: connection,
        as: "connectedDocuments",
        foreignKey: "sourceDocumentId",
        otherKey: "targetDocumentId",
    });
}

export { setupAssociations };
