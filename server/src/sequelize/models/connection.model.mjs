import { DataTypes } from "sequelize";

// export function to define the Connection model
export default (sequelize) => {
    const Connection = sequelize.define("Connection", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        relationship: {
            allowNull: false,
            type: DataTypes.ENUM("Direct Consequence", "Collateral Consequence", "Prevision", "Update"),
        },
    });
    return Connection;
};
