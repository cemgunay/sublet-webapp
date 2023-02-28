const express = require("express");
const router = express.Router();
const multer = require("multer");
const User = require("../models/User");
const Listing = require("../models/Listing");
const Request = require("../models/Requests");

// Create request for a listing
router.post("/:id", async (req, res) => {
  try {
    //Create new request object
    const newRequest = new Request({
      tenantId: req.body.tenantId,
      subTenantId: req.body.subTenantId,
      listingId: req.params.id,
      priceOffer: req.body.priceOffer,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      sublettors: req.body.sublettors,
      viewingDateTime: req.body.viewingDateTime,
      paymentMethod: req.body.paymentMethod,
    });

    //Save reuest to DB and return response
    const request = await newRequest.save();
    res.status(200).json(request);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Update a request 
router.put("/:id", async (req, res) => {
    try {
      const request = await request.findById(req.params.id);
      if (request.subtenantId === req.body.userId) {
        //Check if listing belongs to user trying to update it
        await request.updateOne({ $set: req.body });
        res.status(200).json("The request has been updated!");
      } else {
        res.status(403).json("You can only update your own request!");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  });

//Delete a request
router.delete("/:id", async (req, res) => {
    try {
      const request = await Request.findById(req.params.id);
      if (request.subtenantId === req.body.userId) {
        //Check if request was the user trying to delete it
        await request.deleteOne();
        res.status(200).json("The review has been deleted!");
      } else {
        res.status(403).json("You can only delete your own review!");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  });

  module.exports = router;