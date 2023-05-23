const express = require("express");
const router = express.Router();
const Document = require("../models/Documents");
const Booking = require("../models/Bookings");

// Create document for booking
router.post("/:bookingId", async (req, res) => {
  try {
    console.log(req.params);

    const booking = await Booking.findById(req.params.requestId);

    //Create new booking object
    const newDocument = new Document({
      tenantId: booking.tenantId,
      subTenantId: booking.subTenantId,
      listingId: booking.listingId,
      requestId: booking.requestId,
      bookingId: req.params.requestId,
    });

    //Save booking to DB and return response
    const document = await newDocument.save();
    res.status(200).json(document);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Update a document
router.put("/update/:id", async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    await document.updateOne({ $set: req.body });
    res.status(200).json("The document has been updated!");
  } catch (err) {
    res.status(500).json(err);
  }
});
