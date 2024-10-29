import { DataTypes } from "sequelize";

// export function to define the Stakeholder model
export default (sequelize) => {
    const Connection = sequelize.define("Connection", {
        relationship: {
            allowNull: false,
            type: DataTypes.ENUM(
                "Direct Consequence",
                "Collateral Consequence",
                "Prevision",
                "Update"
            ),
        },
    });
    return Connection;
};
