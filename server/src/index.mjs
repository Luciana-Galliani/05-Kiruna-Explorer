import express from "express";
import morgan from "morgan";
import cors from "cors";
import sequelize from "./sequelize.mjs";
import setupRoutes from "./routes.mjs";
import populateDB from "./sequelize/populate.mjs";
import bodyParser from "body-parser";

// init express
const app = new express();
const port = 3001;

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
// Middleware to parse JSON bodies
app.use(bodyParser.json());


// database connection
async function assertDatabaseConnectionOk() {
    console.log(`Checking database connection...`);
    try {
        await sequelize.authenticate();
        console.log("Database connection OK!");
        await sequelize.sync({ force: true });
        await populateDB(sequelize);
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
}

await assertDatabaseConnectionOk();
setupRoutes(app);

// activate the server
app.listen(port, async () => {
    console.log(`Server listening at http://localhost:${port}`);
});
