import { Sequelize } from "sequelize";
import { setupAssociations } from "./sequelize/associations.mjs";

import dotenv from "dotenv";
dotenv.config();

const sequelize = new Sequelize(
    process.env.MYSQL_DATABASE,
    process.env.MYSQL_USER,
    process.env.MYSQL_PASSWORD,
    {
        host: process.env.MYSQL_HOST,
        dialect: "mysql",
        logging: false,
        define: {
            timestamps: false,
        },
    }
);

// List of models to be defined
const modelDefiners = [
    import("./sequelize/models/user.model.mjs"),
    import("./sequelize/models/document.model.mjs"),
    import("./sequelize/models/stakeholder.model.mjs"),
    import("./sequelize/models/connection.model.mjs"),
];

// Define all models
Promise.all(modelDefiners).then((models) => {
    for (const modelDefiner of models) {
        // Call the function with the sequelize instance
        modelDefiner.default(sequelize);
    }

    // Setup model associations
    setupAssociations(sequelize);
});

export default sequelize;
