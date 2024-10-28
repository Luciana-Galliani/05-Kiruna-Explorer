import { DataTypes } from "sequelize";

// export function to define the Stakeholder model
export default (sequelize) => {
    sequelize.define("connection", {
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
};
