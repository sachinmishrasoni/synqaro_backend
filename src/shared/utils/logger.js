import chalk from "chalk";

export const logSuccess = (msg) => {
    console.log(chalk.green(msg));
};

export const logError = (msg) => {
    console.log(chalk.red(msg));
};

export const logInfo = (msg) => {
    console.log(chalk.blue(msg));
};

export const logger = {
    success: (msg) =>
        console.log(`${chalk.green("[SUCCESS]")} ${msg}`),

    error: (msg) =>
        console.log(`${chalk.red("[ERROR]")} ${msg}`),

    info: (msg) =>
        console.log(`${chalk.blue("[INFO]")} ${msg}`),
};