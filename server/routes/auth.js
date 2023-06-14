const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const Token = require("../models/token");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const welcomeEmailTemplate = require("../emailTemplates/welcomeEmail");

//Register User
router.post("/register", async (req, res) => {
  try {
    //Generate hashed password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //Create new user object
    const newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashedPassword,
      phoneNumber: req.body.phoneNumber,
      dateOfBirth: req.body.dateOfBirth,
      location: req.body.location,
    });

    //Save user to DB and return response
    const user = await newUser.save();

    // Send welcome email to the user
    const welcomeEmail = welcomeEmailTemplate(newUser.firstName);  
    await sendEmail(newUser.email, "Welcome to subLet!", welcomeEmail);

    /*const token = await new Token({
      userId: user._id,
      token: crypto.randomBytes(32).toString("hex"),
    }).save();
    const url = `http://localhost:8080/server/auth/${user.id}/verify/${token.token}`;
    await sendEmail(newUser.email, "Verify Email", url);
    console.log(newUser.email);
    console.log(url);

    res
      .status(201)
      .send({ message: "An Email sent to your account please verify" });*/

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Verify User when Link is Clicked
router.get("/:id/verify/:token", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) return res.status(400).send({ message: "Invalid link" });

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });

    if (!token) return res.status(400).send({ message: "Invalid link" });

    await User.findByIdAndUpdate(user._id, { emailVerified: true });

    await token.remove();

    res.status(200).send({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

//Login User that has email verified
router.post("/login2", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    !user && res.status(200).send("User not found!");

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    !validPassword && res.status(400).json("Wrong password");

    if (!user.emailVerified) {
      let token = await Token.findOne({ userId: user._id });
      if (!token) {
        token = await new Token({
          userId: user._id,
          token: crypto.randomBytes(32).toString("hex"),
        }).save();
        const url = `${process.env.BASE_URL}users/${user.id}/verify/${token.token}`;
        await sendEmail(user.email, "Verify Email", url);
      }

      return res
        .status(400)
        .send({ message: "An Email sent to your account please verify" });
    }

    const token = user.generateAuthToken();
    res.status(200).send({ data: token, message: "logged in successfully" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

//Login User Normally
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    !user && res.status(200).send("User not found!");

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    !validPassword && res.status(400).json("Wrong password");

    res.status(200).json(user);
  } catch (err) {
    //res.status(500).json(err);
  }
});

module.exports = router;
