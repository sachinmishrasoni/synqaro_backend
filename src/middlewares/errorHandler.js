import env from "#config/env.js";
import AppError from "#utils/AppError.js";
import { HTTP } from "#constants/http.js";


const errorHandler = (err, _req, res, _next) => {
    const isProd = env.nodeEnv === "production" || env.nodeEnv === "prod";

    let error = err;

    // Sequelize Unique Constraint Error
    if (err.name === "SequelizeUniqueConstraintError") {
        const errors = err.errors?.map((e) => ({
            field: e.path,
            message: `${e.path} already exists`,
        })) || [];

        error = new AppError(
            "Duplicate field value",
            HTTP[400].statusCode || 400,
            { fields: errors },
            true,
            "DUPLICATE_FIELD"
        );
    }

    // Sequelize Validation Error
    if (err.name === "SequelizeValidationError") {
        const errors = err.errors?.map((e) => ({
            field: e.path,
            message: e.message,
        })) || [];

        error = new AppError(
            "Validation failed",
            400,
            { fields: errors },
            true,
            "VALIDATION_ERROR"
        );
    }

    const isApiError = error instanceof AppError;
    const statusCode = isApiError ? error.statusCode || 500 : 500;
    const message = isApiError ? error.message || "Something went wrong." : "Internal Server Error";
    // const errorCode = isApiError ? err.errorCode : null;
    // const isOperational = isApiError ? err.isOperational : false;
    // const details = isApiError ? err.details : null;

    // console.error("Error:", error);

    const response = {
        success: false,
        error: {
            type: isApiError && error.isOperational ? "OPERATIONAL_ERROR" : "INTERNAL_SERVER_ERROR",
            message,
            ...(isApiError && error.errorCode ? { code: error.errorCode } : {}),
            ...(isApiError && error.details ? { details: error.details } : {}),
            ...(!isProd && error.stack ? { stack: error.stack } : {}),
        }
    };

    res.status(statusCode || 500).json(response);

}

export default errorHandler;