function requestNotificationTemplate(tenantName, subtenantName, listingTitle, priceOffer, offerStartDate, offerEndDate) {
    // Define the email template
    const template = `
      <html>
      <body>
        <h2>Hello ${tenantName},</h2>
        <p>${subtenantName} has made an offer on your ${listingTitle} listing! </p>
        <h3> Offer Details: </h3>
        <li> <strong>Price Offer: </strong> $${priceOffer} </li>
        <li> <strong>Move In Date: </strong> ${offerStartDate} </li>
        <li> <strong>Move Out Date: </strong> ${offerEndDate} </li>
        <p>Check subLet to take a closer look at the offer details and take a look at the potential subtenant's profile!</p>
        <p>Best regards,</p>
        <p>The subLet Team</p>
      </body>
    </html>
        `;
  
    return template;
  }
  
  module.exports = requestNotificationTemplate;