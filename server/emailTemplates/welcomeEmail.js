function welcomeEmailTemplate(firstName) {
  // Define the email template
  const template = `
    <html>
      <body>
        <h2>Hello ${firstName},</h2>
        <p>Welcome to subLet! We are thrilled to have you on board.</p>
        <p>We hope you find the sublet you are looking for!</p>
        <p>Get started by verifying your email and customizing your tenant/subtenant profile.</p>
        <p>Best regards,</p>
        <p>The subLet Team</p>
      </body>
    </html>
    `;

  return template;
}

module.exports = welcomeEmailTemplate;