import { DataTypes } from "sequelize";

// export function to define the User model
export default (sequelize) => {
    sequelize.define("user", {
        username: {
            allowNull: false,
            type: DataTypes.STRING,
            unique: true,
        },
    });
};
