import "module-alias/register";
import app from "./app.js";
import { connectDB } from "./shared/config/database.js";
import env from "./shared/config/env.js";
import { logInfo } from "./shared/utils/logger.js";


async function startServer() {
    try {
        await connectDB();

        app.listen(env.port, () => {
            // console.log(`Server running on http://localhost:${env.port} \n`);
            logInfo(`Server running on http://localhost:${env.port} \n`);
        });

    } catch (error) {
        console.error("Application startup failed:", error.message);
        process.exit(1);
    }
}

startServer();
