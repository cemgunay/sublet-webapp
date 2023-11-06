const express = require("express");
const router = express.Router();
const multer = require("multer");
const Listing = require("../models/Listing");
const Request = require("../models/Requests");
const Booking = require("../models/Bookings");

// Create a new function to handle booking creation
async function createBooking(listingId, requestId) {
  const request = await Request.findById(requestId);

  // Create new booking object
  const newBooking = new Booking({
    tenantId: request.tenantId,
    subTenantId: request.subTenantId,
    listingId: listingId,
    acceptedRequestId: requestId,
    acceptedPrice: request.price,
    startDate: request.startDate,
    endDate: request.endDate,
    viewingDate: request.viewingDate,
    depositAmount: (request.price * 2) * 1.04,
    tenantDocuments: request.tenantDocuments,
    subtenantDocuments: request.subtenantDocuments,
  });

  // Save booking to DB and return it
  return await newBooking.save();
}

// Create booking for a listing
router.post("/:listingId/:requestId", async (req, res) => {
  try {
    console.log(req.params);
    const booking = await createBooking(req.params.listingId, req.params.requestId);
    res.status(200).json(booking);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get all bookings for a listing
router.get("/:listingId", async (req, res) => {
  const { listingId } = req.params;
  try {
    const bookings = await Booking.find({ listingId });
    res.send(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

module.exports = {
  createBooking,
  router
};
