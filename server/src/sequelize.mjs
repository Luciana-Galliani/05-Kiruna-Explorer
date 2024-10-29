import { Sequelize } from "sequelize";
import { setupAssociations } from "./sequelize/associations.mjs";

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "./db.sqlite",
    define: {
        timestamps: false,
    },
    logging: false,
});

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
