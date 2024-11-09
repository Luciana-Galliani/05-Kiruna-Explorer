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
            allowNull: true,
            type: DataTypes.STRING,
            validate: {
                // to check if the scaleValue is a valid scale
                is: /^1:\d{1,3}([.,]\d{3})*$/,
            },
        },
        issuanceDate: {
            allowNull: false,
            type: DataTypes.STRING,
            validate: {
                // to check if the date is in the format YYYY-MM-DD or YYYY-MM or YYYY
                is: /^(\d{4})-(\d{2})-(\d{2})|(\d{4})-(\d{2})|(\d{4})$/,
            },
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
            type: DataTypes.TEXT,
        },
        allMunicipality: {
            allowNull: true,
            type: DataTypes.BOOLEAN,
        },
        latitude: {
            allowNull: true,
            type: DataTypes.DECIMAL(10, 8),
        },
        longitude: {
            allowNull: true,
            type: DataTypes.DECIMAL(11, 8),
        },
    });
    return Document;
};
