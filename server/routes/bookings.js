const express = require("express");
const router = express.Router();
const multer = require("multer");
const User = require("../models/User");
const Listing = require("../models/Listing");
const Request = require("../models/Requests");
const Booking = require("../models/Bookings");

// Create booking for a listing
router.post("/:listingId/:requestId", async (req, res) => {
  try {
    const request = await Request.findById(req.params.requestId);

    //Create new booking object
    const newBooking = new Booking({
      tenantId: request.tenantId,
      subTenantId: request.subTenantId,
      listingId: req.params.listingId,
      acceptedRequestId: req.params.requestId,
      acceptedPriceOffer: request.priceOffer,
      startDate: request.startDate,
      endDate: request.endDate,
      sublettors: request.sublettors,
      viewingDateTime: request.viewingDateTime,
      paymentMethod: request.paymentMethod,
      depositAmount: request.priceOffer * 2,
    });

    //Save booking to DB and return response
    const booking = await newBooking.save();
    res.status(200).json(booking);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
