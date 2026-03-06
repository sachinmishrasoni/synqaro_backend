import env from "#config/env.js";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: env.email.user,
        pass: env.email.pass
    }
});

export const sendEmail = async (to, subject, text) => {
    await transporter.sendMail({
        from: env.email.user,
        to,
        subject,
        text
    });
};