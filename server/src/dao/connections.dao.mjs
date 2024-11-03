import sequelize from "../sequelize.mjs";

class ConnectionsDAO {
    getConnections() {
        return sequelize.models.Connection.getAttributes().relationship.values;
    }
}

export default new ConnectionsDAO();
