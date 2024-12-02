import { DataTypes } from "sequelize";

// export function to define the Area model
export default (sequelize) => {
    const Area = sequelize.define("Area", {
        name: {
            allowNull: false,
            unique: true,
            type: DataTypes.STRING,
        },
        geojson: {
            allowNull: false,
            type: DataTypes.JSON,
        },
        centerLat: {
            allowNull: false,
            type: DataTypes.DECIMAL(10, 8),
        },
        centerLon: {
            allowNull: false,
            type: DataTypes.DECIMAL(11, 8),
        },
    });
    return Area;
};
