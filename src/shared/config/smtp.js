import env from "#config/env.js";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: env.email.user,
        pass: env.email.pass
    }
});

export default transporter;
