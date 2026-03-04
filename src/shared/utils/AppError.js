// import { HTTP_STATUS } from "../constants/httpStatus";

class AppError extends Error {

    constructor(message, statusCode = 500) {
        super(message || "Internal Server Error");
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
};

export default AppError;
