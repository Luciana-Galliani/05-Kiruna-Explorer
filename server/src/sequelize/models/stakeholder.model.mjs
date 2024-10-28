import { DataTypes } from "sequelize";

// export function to define the Stakeholder model
export default (sequelize) => {
    sequelize.define("stakeholder", {
        name: {
            allowNull: false,
            type: DataTypes.ENUM(
                "LKAB",
                "Municipality",
                "Norrbotten County",
                "Architecture firms",
                "Citizens",
                "Others"
            ),
        },
        color: {
            allowNull: false,
            type: DataTypes.STRING,
            // to check if the color is a valid hex color
            validate: {
                is: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
            },
        },
    });
};
