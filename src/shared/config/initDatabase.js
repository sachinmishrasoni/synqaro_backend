import { Sequelize } from "sequelize";
import env from "./env.js";

const createDatabaseIfNotExists = async () => {
    const tempSequelize = new Sequelize(
        "",
        env.database.user,
        env.database.password,
        {
            //   host: env.database.host,
            port: env.database.port,
            dialect: "mysql",
            logging: false,
        }
    );

    try {
        await tempSequelize.query(
            `CREATE DATABASE IF NOT EXISTS \`${env.database.name}\`;`
        );

        console.log(`\nDatabase "${env.database.name}" verified.`);
    } catch (error) {
        console.error("Database creation failed:", error);
        throw error;
    } finally {
        await tempSequelize.close();
    }
};

export default createDatabaseIfNotExists;
