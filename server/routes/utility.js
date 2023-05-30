const express = require("express");
const router = express.Router();

const Request = require("../models/Requests");
const Booking = require("../models/Bookings")
const User = require("../models/User")
const Listing = require("../models/Listing")
const Document = require("../models/Documents")

router.post("/deleteAllRequests", async (req, res) => {
  Request.deleteMany({}, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log(
        "Successfully deleted all documents in the Request collection."
      );
    }
  });
});

router.post("/deleteAllBookings", async (req, res) => {
    Booking.deleteMany({}, function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log(
          "Successfully deleted all documents in the Booking collection."
        );
      }
    });
  });

  router.post("/deleteAllListings", async (req, res) => {
    Listing.deleteMany({}, function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log(
          "Successfully deleted all documents in the Listing collection."
        );
      }
    });
  });

module.exports = router;
