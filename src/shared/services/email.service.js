import transporter from "#config/smtp.js";
import env from "#config/env.js";

export const sendEmail = async ({ to, subject, text, html, attachments, cc, bcc }) => {
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
};
