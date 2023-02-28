const User = require("../models/User");
const router = require("express").Router();

//Get a user with user id
router.get("/id/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...other } = user._doc; //Hide the password in the response
    res.status(200).json(other);
  } catch (err) {
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

module.exports = router;
