import sequelize from "../sequelize.mjs";

class DocumentDAO {
    async getDocuments() {
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
    }
    async createDocument(data) {}

    async getDocumentById(id) {}
}

export default new DocumentDAO();
