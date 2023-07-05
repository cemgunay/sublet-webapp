const express = require("express");
const router = express.Router();
const multer = require("multer");
const mongoose = require("mongoose");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const User = require("../models/User");

// Middleware for adding user to request, used in authenticating
const isAuthenticated = async (req, res, next) => {
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

//new conv
router.post("/", async (req, res) => {
  const newConversation = new Conversation({
    members: [req.body.senderId, req.body.receiverId],
    request: req.body.requestId,
  });

  try {
    const savedConversation = await newConversation.save();
    res.status(200).json(savedConversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get conv from id
router.get("/:id", async (req, res) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid conversation ID" });
  }

  try {
    const conversation = await Conversation.findById(id);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get ALL conv of a user
router.get("/user/:userId", async (req, res) => {
  try {
    const conversation = await Conversation.find({
      members: { $in: [req.params.userId] },
    });
    console.log(req.params.userId);
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get archived conversations of a user
router.get("/user/archived/:userId/:userRole", async (req, res) => {
  try {
    const { userId, userRole } = req.params;

    // Validate userRole
    if (userRole !== "tenant" && userRole !== "subtenant") {
      return res.status(400).json({ error: "Invalid user role" });
    }

    // Find conversations based on user role
    const conversations = await Conversation.find({
      members: { $in: [userId] },
      ...(userRole === "tenant"
        ? { deletedByTenant: false }
        : { deletedBySubtenant: false }),
    })
      .populate("request")
      .exec();

    // Filter conversations where request status is confirmed or rejected
    // and the request's subtenantId/tenantId match the userId
    const filteredConversations = conversations.filter((conversation) => {
      return (
        conversation.request != null &&
        (conversation.request.status === "confirmed" ||
          conversation.request.status === "rejected") &&
        (userRole === "tenant"
          ? conversation.request.tenantId === userId
          : conversation.request.subtenantId === userId)
      );
    });

    res.status(200).json(filteredConversations);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// get active conversations of a user
router.get("/user/active/:userId/:userRole", async (req, res) => {
  try {
    const { userId, userRole } = req.params;

    // Validate userRole
    if (userRole !== "tenant" && userRole !== "subtenant") {
      return res.status(400).json({ error: "Invalid user role" });
    }

    // Find conversations based on user role
    const conversations = await Conversation.find({
      members: { $in: [userId] },
      ...(userRole === "tenant"
        ? { deletedByTenant: false }
        : { deletedBySubtenant: false }),
    })
      .populate("request")
      .exec();

    // Filter out conversations where request status is confirmed or rejected
    // and the request's subtenantId/tenantId match the userId
    const filteredConversations = conversations.filter((conversation) => {
      return (
        conversation.request != null &&
        conversation.request.status !== "confirmed" &&
        conversation.request.status !== "rejected" &&
        (userRole === "tenant"
          ? conversation.request.tenantId === userId
          : conversation.request.subTenantId === userId)
      );
    });

    res.status(200).json(filteredConversations);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//get last message
router.get("/lastMessage/:id", async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id);

    // check if the conversation exists
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    // get the last message of the conversation
    const lastMessage = await Message.findOne({
      conversationId: conversation._id,
    }).sort("-createdAt");

    // if there's no message yet in the conversation
    if (!lastMessage) {
      return res
        .status(200)
        .json({ message: "No message in this conversation yet" });
    }

    res.status(200).json(lastMessage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// get conv includes two userId
router.get("/find/:firstUserId/:secondUserId", async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      members: { $all: [req.params.firstUserId, req.params.secondUserId] },
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get conversation by request id
router.get("/request/:requestId", async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      request: req.params.requestId,
    });
    console.log(req.params.requestId);
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Soft delete a conversation
router.patch("/soft-delete/:id", isAuthenticated, async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    const role = req.body.role; // should be either 'tenant' or 'subtenant'

    if (!conversation.members.includes(req.user._id)) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const update =
      role === "tenant"
        ? { deletedByTenant: true }
        : { deletedBySubtenant: true };
    await conversation.updateOne(update);

    console.log(conversation);

    res.status(200).json("Conversation deleted successfully");
  } catch (err) {
    res.status(500).json(err);
  }
});

// delete a conversation
router.delete("/delete/:id", async (req, res) => {
  try {
    await Conversation.findByIdAndRemove(req.params.id);
    res.status(200).json("Conversation deleted successfully");
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
