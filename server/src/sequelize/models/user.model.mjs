import { DataTypes } from "sequelize";

// export function to define the User model
export default (sequelize) => {
    const User = sequelize.define("User", {
        username: {
            allowNull: false,
            type: DataTypes.STRING,
            unique: true,
        },
    });
    return User;
};
