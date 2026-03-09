import jwt from "jsonwebtoken";
import env from "#config/env.js";

export const generateAccessToken = (payload) => {
    return jwt.sign(payload, env.jwt.accessSecret, {
        expiresIn: "15m"
    });
};

export const generateRefreshToken = (payload) => {
    return jwt.sign(payload, env.jwt.refreshSecret, {
        expiresIn: "7d"
    });
};

export const verifyRefreshToken = (token) => {
    return jwt.verify(token, env.jwt.refreshSecret);
};

export const verifyAccessToken = (token) => {
    return jwt.verify(token, env.jwt.accessSecret);
};
