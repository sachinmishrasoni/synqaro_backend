import transporter from "#config/smtp.js";
import env from "#config/env.js";

const SMTP_ERROR_MESSAGES = {
    ECONNECTION: {
        user: "Unable to connect to the email service. Please try again later.",
        developer:
            "SMTP connection failed. Check SMTP configuration and network connectivity.",
    },

    ETIMEDOUT: {
        user: "The email service took too long to respond. Please try again later.",
        developer:
            "SMTP connection timed out. Check SMTP host/port or hosting-provider SMTP restrictions.",
    },

    ECONNREFUSED: {
        user: "The email service is currently unavailable. Please try again later.",
        developer:
            "SMTP connection was refused. Check SMTP host, port, firewall, or provider configuration.",
    },

    EAUTH: {
        user: "Unable to authenticate with the email service. Please contact support.",
        developer:
            "SMTP authentication failed. Check email username and password/App Password.",
    },

    EENVELOPE: {
        user: "The email address information is invalid.",
        developer:
            "Invalid SMTP envelope. Check from/to/cc/bcc email addresses.",
    },
};

export class EmailServiceError extends Error {
    constructor({ userMessage, developerMessage, code }) {
        super(userMessage);

        this.name = "EmailServiceError";
        this.code = code;
        this.userMessage = userMessage;
        this.developerMessage = developerMessage;
    }
}

const getSmtpError = (error) => {
    return (
        SMTP_ERROR_MESSAGES[error.code] || {
            user: "Unable to send the email. Please try again later.",
            developer: `Unexpected Nodemailer error: ${error.message}`,
        }
    );
};


export const sendEmail = async ({ to, subject, text, html, attachments, cc, bcc }) => {
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
        const smtpError = getSmtpError(error);

        console.error("Nodemailer Error:", {
            code: error.code,
            message: error.message,
            command: error.command,
            responseCode: error.responseCode,
            response: error.response,
        });

        throw new EmailServiceError({
            code: error.code,
            userMessage: smtpError.user,
            developerMessage: smtpError.developer,
        });
    }
};
