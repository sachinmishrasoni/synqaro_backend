import { getHttpMeta, HTTP } from "#constants/http.js";


class AppError extends Error {
    
    constructor(message, statusCode = 500, details, isOperational = true, errorCode ) {

        const httpMeta = getHttpMeta(statusCode);

        super(message || httpMeta.message);
        this.name = "AppError";
        this.statusCode = statusCode;
        this.status = httpMeta.status;
        this.isOperational = isOperational ?? true;
        this.details = details || null;
        this.errorCode = errorCode;

        Error.captureStackTrace(this, this.constructor);
    }
};

export default AppError;
