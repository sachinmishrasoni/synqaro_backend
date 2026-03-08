export const welcomeEmailTemplate = ({ name }) => {
    return `
    <h2>Hello ${name}</h2>
    <p>Your account has been successfully created.</p>
    <p>You can now login to your account.</p>
    <p>Thank you for using our service.</p>

    <p>Best regards,<br>
    The Team</p>
  `;
};