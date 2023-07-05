function listingPublishedTemplate(firstName, listingTitle, listingId) {
  // Define the email template
  const template = `
    <html>
    <body>
      <h2>Hello ${firstName},</h2>
      <p>Your ${listingTitle} is now live!</p>
      <strong>Check it out here: localhost:3000/listing/${listingId}</strong>
      <p>We hope you find the perfect subtenant!</p>
      <p>You are now able to recieve requests for you listing, be sure to check your inbox!</p>
      <p>Best regards,</p>
      <p>The subLet Team</p>
    </body>
  </html>
      `;

  return template;
}

module.exports = listingPublishedTemplate;
