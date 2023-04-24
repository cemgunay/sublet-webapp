const express = require("express");
const router = express.Router();
const multer = require("multer");
const User = require("../models/User");
const Listing = require("../models/Listing");
const Request = require("../models/Requests");

// Create request for a listing
router.post("/:listingId", async (req, res) => {
  try {
    //Create new request object
    const newRequest = new Request({
      tenantId: req.body.tenantId,
      subTenantId: req.body.subTenantId,
      listingId: req.params.listingId,
      price: req.body.price,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      viewingDate: req.body.viewingDate
    });

    //Save request to DB and return response
    const request = await newRequest.save();
    res.status(200).json(request);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Get a request by request ID
router.get("/:requestId", async (req, res) => {
  try {
    const request = await Request.findById(req.params.requestId);
    res.status(200).json(request);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Get all requests made by a user (subtenant)
router.get("/myrequests/:subTenantId", async (req, res) => {
  try {
    const requests = await Request.find({
      subTenantId: req.params.subTenantId,
    });
    res.status(200).json(requests);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Get all requests made to a user (tenant)
router.get("/myoffers/:tenantId", async (req, res) => {
  try {
    const requests = await Request.find({
      tenantId: req.params.tenantId,
    });
    res.status(200).json(requests);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Get all requests made for a listing
router.get("/listingrequests/:listingId", async (req, res) => {
    try {
      const requests = await Request.find({
        listingId: req.params.listingId,
      });
      res.status(200).json(requests);
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
