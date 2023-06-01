const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const multer = require("multer");
const User = require("../models/User");
const Listing = require("../models/Listing");
const Booking = require("../models/Bookings");
const Request = require("../models/Requests");
const Conversation = require("../models/Conversation")
const createAgenda = require("../jobs/jobs");

const { updateUser } = require("../utils/user_operations");

//initialize Agenda instance
const agenda = createAgenda(process.env.MONGO_URI);

// Middleware for adding user to request, can use if you want to for authentication
const addUser = async (req, res, next) => {
  const userId = req.headers["x-user-id"];

  if (!userId) {
    return res.status(403).send({ message: "No user ID provided." });
  }

  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).send({ message: "User not found." });
  }

  req.user = user;
  next();
};

// Create request for a listing
router.post("/:listingId", async (req, res) => {
  try {
    const { subTenantId } = req.body;
    const { listingId } = req.params;

    // Check if subtenant has a current transaction
    const subtenant = await User.findById(subTenantId);
    if (subtenant.currentSubTenantTransaction) {
      return res.status(403).json({
        message:
          "You currently have a transaction in progress and cannot create a new request.",
      });
    }

    // Check if the listing has a current transaction
    const listing = await Listing.findById(listingId);
    let warning = null;
    if (listing.transactionInProgress) {
      warning =
        "Please note that this listing currently has a transaction in progress.";
    }

    //Create new request object
    const newRequest = new Request({
      tenantId: req.body.tenantId,
      subTenantId: req.body.subTenantId,
      listingId: req.params.listingId,
      price: req.body.price,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      viewingDate: req.body.viewingDate,
    });

    //Save request to DB and return response
    const request = await newRequest.save();

    // Create new conversation object
    const newConversation = new Conversation({
      members: [req.body.tenantId, req.body.subTenantId],
      request: request._id,
    });

    // Save conversation to DB
    const conversation = await newConversation.save();

    // Return response with request, conversation and warning (if applicable)
    res.status(200).json({ request, conversation, warning });
  } catch (err) {
    res.status(500).json(err);
  }
});

//Get a request by request ID
router.get("/:requestId", async (req, res) => {
  try {
    const request = await Request.findById(req.params.requestId)
      .populate("tenantDocuments")
      .populate("subtenantDocuments");
    res.status(200).json(request);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get all requests by listing ID
router.get("/listing/:listingId", async (req, res) => {
  try {
    const requests = await Request.find({ listingId: req.params.listingId })
      .populate("tenantDocuments")
      .populate("subtenantDocuments");
    res.status(200).json(requests);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get all requests by listing ID made by user
router.get("/listing/:listingId/:subTenantId", async (req, res) => {
  try {
    const requests = await Request.find({
      listingId: req.params.listingId,
      subTenantId: req.params.subTenantId,
    })
      .sort({ updatedAt: -1 })
      .populate("tenantDocuments")
      .populate("subtenantDocuments"); // Sort by updatedAt in descending order
    res.status(200).json(requests);
  } catch (err) {
    res.status(500).json(err);
  }
});

/*
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
*/

// Get all requests made by a user with filters
router.get("/myrequests/:subTenantId", async (req, res) => {
  const query = { subTenantId: req.params.subTenantId };

  const filters = req.query.filters ? JSON.parse(req.query.filters) : {};

  if (filters.active) {
    query.status = {
      $in: [
        "pendingSubTenant",
        "pendingTenant",
        "pendingTenantUpload",
        "pendingSubTenantUpload",
        "pendingFinalAccept",
      ],
    };
  }
  if (filters.past) {
    query.status = "rejected";
  }
  if (filters.accepted) {
    query.status = {
      $in: ["accepted", "confirmed"],
    };
  }
  if (filters.showSubTenant) {
    query.showSubTenant = true;
  }

  try {
    const requests = await Request.find(query)
      .populate("tenantDocuments")
      .populate("subtenantDocuments");
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//Get all requests made TO a user (tenant)
router.get("/myoffers/:tenantId", async (req, res) => {
  try {
    const requests = await Request.find({
      tenantId: req.params.tenantId,
    })
      .populate("tenantDocuments")
      .populate("subtenantDocuments");
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
    })
      .populate("tenantDocuments")
      .populate("subtenantDocuments");
    res.status(200).json(requests);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Update a request
router.put("/update/:id", async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (
      request.subTenantId === req.body.subtenantId ||
      request.tenantId === req.body.tenantId
    ) {
      //Check if request belongs to user trying to update it
      await request.updateOne({ $set: req.body });
      res.status(200).json("The request has been updated!");
    } else {
      res
        .status(403)
        .json("You can only update a request that pertains to you!");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//accept a request as tenant
router.put("/acceptAsTenant/:requestId", addUser, async (req, res) => {
  try {
    const requestId = req.params.requestId;
    const request = await Request.findById(requestId);

    if (!request) {
      return res.status(404).send({ message: "Request not found" });
    }

    // Fetch the tenant, subtenant, and listing using their IDs
    let tenant = await User.findById(request.tenantId);
    console.log("tenant");
    console.log(tenant);
    let subtenant = await User.findById(request.subTenantId);
    console.log("subtenant");
    console.log(subtenant);
    const listing = await Listing.findById(request.listingId);

    //Ensure that the request is indeed in pendingTenant
    if (request.status !== "pendingTenant") {
      return res.status(400).send({
        message: "Not ready to accept please try again later",
      });
    }

    // Check if tenant and subtenant are not in other transactions
    if (tenant.currentTenantTransaction) {
      return res.status(400).send({
        message: "You are currently involved in a different transaction",
      });
    }
    if (subtenant.currentSubTenantTransaction) {
      return res.status(400).send({
        message: "Subtenant is currently involved in a different transaction",
      });
    }

    // Ensure tenant has uploaded all required documents
    const tenantHasAllDocs = request.tenantDocuments.length === 2;
    if (!tenantHasAllDocs) {
      return res.status(400).send({
        message: "Tenant must upload all documents before accepting",
      });
    }

    // Update users and listing
    tenant = await updateUser(request.tenantId, {
      currentTenantTransaction: requestId,
    });
    subtenant = await updateUser(request.subTenantId, {
      currentSubTenantTransaction: requestId,
    });
    listing.transactionInProgress = true;

    // Save updates
    await listing.save();

    // Update request status
    if (request.subtenantDocuments.length === 2) {
      request.status = "pendingFinalAccept";
    } else {
      request.status = "pendingSubTenantUpload";
    }
    request.previousStatus = "pendingTenant";

    // Update request acceptance timestamp for timer
    request.acceptanceTimestamp = Date.now();
    await request.save();

    // Schedule a job to run after 12 hours
    await agenda.schedule("in 12 hours", "revert request status", {
      requestId,
    });

    return res.send(request);
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: "Internal server error" });
  }
});

//accept a request as subtenant
router.put("/acceptAsSubTenant/:requestId", addUser, async (req, res) => {
  try {
    const requestId = req.params.requestId;
    const request = await Request.findById(requestId)
      .populate("subtenantDocuments")
      .populate("tenantDocuments");

    if (!request) {
      return res.status(404).send({ message: "Request not found" });
    }

    // Fetch the tenant, subtenant, and listing using their IDs
    let tenant = await User.findById(request.tenantId);
    let subtenant = await User.findById(request.subTenantId);
    const listing = await Listing.findById(request.listingId);

    //Ensure that the request is indeed in pendingSubTenant
    if (request.status !== "pendingSubTenant") {
      return res.status(400).send({
        message: "Not ready to accept please try again later",
      });
    }

    // Check if tenant and subtenant are not in other transactions
    if (subtenant.currentSubTenantTransaction) {
      return res.status(400).send({
        message: "You are currently involved in a different transaction",
      });
    }
    if (tenant.currentTenantTransaction) {
      return res.status(400).send({
        message: "Tenant is currently involved in a different transaction",
      });
    }

    // Ensure subtenant has uploaded required government ID
    const subtenantHasGovId = request.subtenantDocuments.find(
      (doc) => doc.type === "Government ID"
    );
    if (!subtenantHasGovId) {
      return res.status(400).send({
        message: "Subtenant must upload Government ID before accepting",
      });
    }

    // Update users and listing
    tenant = await updateUser(request.tenantId, {
      currentTenantTransaction: requestId,
    });
    subtenant = await updateUser(request.subTenantId, {
      currentSubTenantTransaction: requestId,
    });
    listing.transactionInProgress = true;

    // Save updates
    await listing.save();

    // Update request status
    if (request.tenantDocuments.length === 2) {
      request.status = "pendingFinalAccept";
    } else {
      request.status = "pendingTenantUpload";
    }
    request.previousStatus = "pendingSubTenant";

    // Update request acceptance timestamp for timer
    request.acceptanceTimestamp = Date.now();
    await request.save();

    // Schedule a job to run after 12 hours
    await agenda.schedule("in 12 hours", "revert request status", {
      requestId,
    });

    return res.send(request);
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: "Internal server error" });
  }
});

//Reject all other offers on listing
async function rejectOthers(listingId, requestId) {
  try {
    const result = await Request.updateMany(
      {
        listingId: listingId,
        _id: { $ne: requestId },
        status: { $in: ["pendingTenant", "pendingSubTenant"] },
      },
      { $set: { status: "rejected", status_reason: "Listing booked" } }
    );
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

//Delete all requests that are in pending status for subtenant
async function deletePendingRequests(subtenantId) {
  try {
    const result = await Request.deleteMany({
      subTenantId: mongoose.Types.ObjectId(subtenantId),
      status: { $in: ["pendingTenant", "pendingSubTenant"] },
    });
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
//final accept offer
router.post("/confirm/:requestId", addUser, async (req, res) => {
  console.log("Confirm request route hit, starting operations...");

  try {
    const requestId = req.params.requestId;
    const request = await Request.findById(requestId);

    const { role } = req.body;

    if (!request) {
      return res.status(404).send({ message: "Request not found" });
    }

    // Fetch the tenant, subtenant, and listing using their IDs
    let tenant = await User.findById(request.tenantId);
    let subtenant = await User.findById(request.subTenantId);
    const listing = await Listing.findById(request.listingId);

    // Check if the authenticated user is the other party of the request
    if (
      String(req.user._id) !== String(tenant._id) &&
      String(req.user._id) !== String(subtenant._id)
    ) {
      return res.status(403).send({
        message: "You do not have permission to confirm this request",
      });
    }

    if (request.tenantFinalAccept || request.subtenantFinalAccept) {
      // Create new booking record
      const booking = new Booking({
        tenantId: request.tenantId,
        subTenantId: request.subTenantId,
        listingId: request.listingId,
        acceptedRequestId: req.params.requestId,
        acceptedPrice: request.price,
        startDate: request.startDate,
        endDate: request.endDate,
        viewingDate: request.viewingDate,
        depositAmount: request.price * 2 * 1.04,
        tenantDocuments: request.tenantDocuments,
        subtenantDocuments: request.subtenantDocuments,
      });
      await booking.save();

      const rejectedOthers = await rejectOthers(request.listingId, requestId);
      console.log("Other requests rejected or no matching requests found.");

      const deletedPending = await deletePendingRequests(request.subTenantId);
      console.log("Other requests deleted or no matching requests found.");

      // Update request status
      request.status = "confirmed";
      request.previousStatus = request.status;
      await request.save();

      // Clear the currentTenantTransaction and currentSubTenantTransaction
      tenant = await updateUser(request.tenantId, {
        currentTenantTransaction: null,
      });
      subtenant = await updateUser(request.subTenantId, {
        currentSubTenantTransaction: null,
      });

      // Update the listing's transactionInProgress
      listing.transactionInProgress = false;
      await listing.save();

      console.log(tenant);
      console.log(subtenant);

      return res
        .status(200)
        .json({ message: "Request confirmed, other requests updated." });
    } else {
      if (role === "tenant") {
        request.tenantFinalAccept = true;
        await request.save();
      } else {
        request.subtenantFinalAccept = true;
        await request.save();
      }

      const updatedRequest = await Request.findById(req.params.requestId)
        .populate("tenantDocuments")
        .populate("subtenantDocuments");

      return res.status(200).json(updatedRequest);
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: "Internal server error" });
  }
});

//Delete a request
router.delete("/delete/:id", async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (request.subTenantId === req.body.userId) {
      //Check if request was the user trying to delete it
      if (request.status !== "pendingTenant") {
        await request.deleteOne();
        res.status(200).json("The request has been deleted!");
      } else {
        res.status(403).json("Request isn't ready to be deleted");
      }
    } else {
      res.status(403).json("You can only delete your own request");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
