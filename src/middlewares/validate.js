import { HTTP } from "#constants/http.js";
import AppError from "#utils/AppError.js";
import { ZodError } from "zod";

export const validate = (schema) => {
    return (req, res, next) => {
        try {
            req.validated = {};
            
            if (schema.body) {
                req.validated.body = schema.body.parse(req.body);
            }

            if (schema.params) {
                req.validated.params = schema.params.parse(req.params);
            }

            if (schema.query) {
                req.validated.query = schema.query.parse(req.query);
            }

            next();

        } catch (error) {

            if (error instanceof ZodError) {
                const errors = error.issues.map((issue) => ({
                    field: issue.path.join("."),
                    message: issue.message,
                }));

                return next(
                    new AppError(
                        "Validation failed",
                        HTTP.BAD_REQUEST,
                        { fields: errors },
                        true,
                        "VALIDATION_ERROR"
                    )
                );
            }

            next(error);
        }
    };
};
