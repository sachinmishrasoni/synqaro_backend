import transporter from "#config/smtp.js";
import env from "#config/env.js";
import AppError from "#utils/AppError.js";
import { HTTP } from "#constants/http.js";

// const SMTP_ERROR_MESSAGES = {
//     EAUTH: {
//         message: "Unable to authenticate with the email service. Please contact support.",
//         errorCode: "EMAIL_AUTHENTICATION_ERROR",
//     },
//     ECONNECTION: {
//         message: "Unable to connect to the email service. Please try again later.",
//         errorCode: "EMAIL_CONNECTION_ERROR",
//     },

//     ETIMEDOUT: {
//         message: "The email service took too long to respond. Please try again later.",
//         errorCode: "EMAIL_SERVICE_TIMEOUT",
//     },

//     ECONNREFUSED: {
//         message: "The email service is currently unavailable. Please try again later.",
//         errorCode: "EMAIL_SERVICE_UNAVAILABLE",
//     },

//     EAUTH: {
//         message: "Unable to authenticate with the email service. Please contact support.",
//         errorCode: "EMAIL_AUTHENTICATION_ERROR",
//     },

//     EENVELOPE: {
//         message: "The email address information is invalid.",
//         errorCode: "EMAIL_INVALID_ADDRESS",
//     },

//     ESOCKET: {
//         message: "Unable to send the email. Please try again later.",
//         errorCode: "EMAIL_CONNECTION_ERROR",
//     },
// };

// const getSmtpError = (error) => {
//     return (
//         SMTP_ERROR_MESSAGES[error.code] || {
//             message: "Unable to send the email. Please try again later.",
//             errorCode: "EMAIL_SERVICE_ERROR",
//         }
//     );
// };

export const sendEmail = async ({
    to,
    subject,
    text,
    html,
    attachments,
    cc,
    bcc,
}) => {
    try {
        await transporter.sendMail({
            from: `"Synqaro Support" <${env.email.user}>`,
            to,
            subject,
            text,
            html,
            ...(attachments && { attachments }),
            ...(cc && { cc }),
            ...(bcc && { bcc }),
        });

        return {
            success: true,
        };
    } catch (error) {
        // const smtpError = getSmtpError(error);

        // Developer information
        console.error("Nodemailer Error:", {
            code: error.code,
            message: error.message,
            command: error.command,
            responseCode: error.responseCode,
            response: error.response,
            stack: error.stack,
        }, "SMTP Error:", error);

        // Common application error
        throw new AppError(
            error.message,
            HTTP[503] ? 503 : 500,
            null,
            true,
            error.code
        );
    }
};
