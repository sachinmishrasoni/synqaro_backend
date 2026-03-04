import { Sequelize } from "sequelize";
import env from "./env.js";
import createDatabaseIfNotExists from "./initDatabase.js";
import { logError, logSuccess } from "../utils/logger.js";

// Create a new Sequelize instance
const sequelize = new Sequelize(env.database.name, env.database.user, env.database.password, {
    host: env.database.host,
    dialect: "mysql",
    logging: false
});

// Connect to the database
export const connectDB = async () => {
    try {
        // Step 1: Create DB if not exists
        await createDatabaseIfNotExists();

        // Step 2: Connect to DB
        await sequelize.authenticate();
        logSuccess("Database connected successfully.");

        if (env.nodeEnv === "development") {
            // await sequelize.sync();
            await sequelize.sync({ alter: true });
            // await sequelize.sync({ force: true });

            // console.log("Tables synced successfully.");
            logSuccess("Tables synced successfully.");
        }

    } catch (error) {
        // console.error("Database connection failed:", error);
        logError("Database connection failed:", error);
        throw error;
    }
};

export default sequelize;
