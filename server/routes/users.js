const User = require("../models/User");
const mongoose = require("mongoose");
const router = require("express").Router();

const { updateUser } = require("../utils/user_operations");

//Get a user with user id
router.get("/id/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const { password, ...other } = user._doc; //Hide the password in the response
    res.status(200).json(other);
  } catch (err) {
    if (err.kind === "ObjectId") {
      // This condition checks if the error is because of an invalid ObjectId
      return res.status(404).json({ message: "Invalid User Id" });
    }
    res.status(500).json(err);
  }
});

//Get a user with email
router.get("/:email", async (req, res) => {
  try {
    // search for the user with the given email
    const user = await User.findOne({ email: req.params.email });
    if (!user) {
      // if the user doesn't exist, return an error response
      return res.status(404).json({ message: "User not found" });
    }
    // if the user exists, return the user data
    return res.json(user);
  } catch (error) {
    // handle any errors that may occur during the search
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Update user route
router.put("/:id", async (req, res) => {
  // update user in body
  try {
    console.log("updating user");
    const updatedUser = await updateUser(req.params.id, req.body);
    console.log(updatedUser);
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
