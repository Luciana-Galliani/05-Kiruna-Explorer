import sequelize from "../sequelize.mjs";

class DocumentDAO {
    async getDocuments() {
        return await sequelize.models.document.findAll({
            include: ["stakeholders", "connectedDocuments"],
        });
    }
    async createDocument(data) {}

    async getDocumentById(id) {}
}

export default new DocumentDAO();
