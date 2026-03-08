import env from "../shared/config/env.js";


const errorHandler = (err, _req, res, _next) => {
    const isProd = env.nodeEnv === "production";

    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";
    let errors = [];

    console.error(err);

    //  Handle Sequelize Unique Constraint (duplicate)
    if (err.name === "SequelizeUniqueConstraintError") {
        statusCode = 400;
        message = "Duplicate field value";

        errors = err.errors?.map((e) => ({
            field: e.path,
            message: `${e.path} already exists`,
        })) || [];
    }

    // Handle Sequelize Validation Error
    if (err.name === "SequelizeValidationError") {
        statusCode = 400;

        errors = err.errors?.map((e) => ({
            field: e.path,
            message: e.message,
        })) || [];
    }

    const response = {
        success: false,
        message,
    };

    if (errors.length > 0) {
        response.errors = errors;
    }

    if (!isProd) {
        response.stack = err.stack;
    }

    res.status(statusCode).json(response);
};

export default errorHandler;
