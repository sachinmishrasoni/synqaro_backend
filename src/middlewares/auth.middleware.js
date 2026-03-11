import { User } from "#models/index.js";
import { verifyAccessToken } from "#services/jwt.service.js";
import AppError from "#utils/AppError.js";

export const authenticate = async (req, res, next) => {
    try {
        const header = req.headers.authorization;
        if (!header || !header.startsWith("Bearer ")) {
            return next(new AppError("Authorization token missing or malformed.", 401));
        }

        const token = header.split(" ")[1];
        if (!token) {
            return next(new AppError("Authorization token is invalid.", 401));
        }

        const decoded = verifyAccessToken(token);

        const user = await User.findByPk(decoded.id, {
            attributes: { exclude: ["password"] }
        });

        if (!user || !user.isActive) {
            return next(new AppError("User not authorized.", 401));
        }

        req.user = user;
        next();

    } catch (error) {
        next(new AppError("Authentication failed.", 401));
    }
};

export const authorize = (...roles) => {
    return (req, res, next) => {

        if (!req.user) {
            return next(new AppError("Unauthorized.", 401));
        }

        if (!roles.includes(req.user.role)) {
            return next(new AppError("You do not have permission to perform this action.", 403));
        }

        next();
    };
};
