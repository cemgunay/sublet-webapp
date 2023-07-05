function forgotPasswordTemplate(firstName, newPassword) {
    // Define the email template
    const template = `
      <html>
      <body>
        <h2>Hello ${firstName},</h2>
        <p>It seems like you have forgot your password. That's okay! Your password has been reset. </p>
        <h4>New Password: </h4>
        <p>${newPassword}</p>
        <p></p>
        <p>Please use this new temporary password to login to your account, upon login you will be prompted to change your password</p>
        <p>Do not share your password with anyone! subLet will never ask for your password</p>
        <p>Best regards,</p>
        <p>The subLet Team</p>
      </body>
    </html>
        `;
  
    return template;
  }
  
  module.exports = forgotPasswordTemplate;