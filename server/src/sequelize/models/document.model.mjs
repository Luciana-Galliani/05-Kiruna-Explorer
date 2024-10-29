import { DataTypes } from "sequelize";

// export function to define the Document model
export default (sequelize) => {
    const Document = sequelize.define("Document", {
        title: {
            allowNull: false,
            type: DataTypes.STRING,
            unique: true,
        },
        scaleType: {
            type: DataTypes.ENUM,
            values: ["Text", "Concept", "Blueprints/actions", "Plan"],
            allowNull: false,
        },
        scaleValue: {
            type: DataTypes.STRING,
            validate: {
                // to check if the scaleValue is a valid scale
                is: /^1:\d{1,3}(.\d{3})*$/,
            },
        },
        issuanceDate: {
            allowNull: false,
            type: DataTypes.DATE,
        },
        type: {
            allowNull: false,
            type: DataTypes.ENUM(
                "Design Document",
                "Informative Document",
                "Prescriptive Document",
                "Technical Document",
                "Agreement",
                "Conflict",
                "Consultation",
                "Action"
            ),
        },
        language: {
            type: DataTypes.STRING,
        },
        pages: {
            type: DataTypes.STRING,
        },
        description: {
            allowNull: false,
            type: DataTypes.STRING,
        },
    });
    return Document;
};
