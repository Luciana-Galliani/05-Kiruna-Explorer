import sequelize from "../sequelize.mjs";

class ConnectionsDAO {
    getConnections() {
        return sequelize.models.Connection.rawAttributes.relationship.values;
    }
}

export default new ConnectionsDAO();
