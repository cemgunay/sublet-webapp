function listingDeletedTemplate(firstName, listingTitle) {
    // Define the email template
    const template = `
      <html>
      <body>
        <h2>Hello ${firstName},</h2>
        <p>Your ${listingTitle} listing has been deleted.</p>
        <p>If you have any questions or concerns regarding the deleted listing, don't hesitate to contact us at: sublet-support@gmail.com</p>
        <p>Best regards,</p>
        <p>The subLet Team</p>
      </body>
    </html>
        `;
  
    return template;
  }
  
  module.exports = listingDeletedTemplate;