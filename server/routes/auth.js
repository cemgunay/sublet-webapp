const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const Token = require("../models/token");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const welcomeEmailTemplate = require("../emailTemplates/welcomeEmail");
const forgotPasswordTemplate = require("../emailTemplates/forgotPassword");

// Generate random password for user requesting to reset password
function generateRandomPassword() {
  const length = 8;
  const uppercaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercaseLetters = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()-=_+[]{}|;:,.<>/?';

  let password = '';

  // Generate at least one uppercase letter
  password += uppercaseLetters.charAt(Math.floor(Math.random() * uppercaseLetters.length));

  // Generate at least one number
  password += numbers.charAt(Math.floor(Math.random() * numbers.length));

  // Generate at least one symbol
  password += symbols.charAt(Math.floor(Math.random() * symbols.length));

  // Generate remaining characters
  for (let i = password.length; i < length; i++) {
    const characters = lowercaseLetters + uppercaseLetters + numbers + symbols;
    password += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return password;
}

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

// Reset a user password, email them new password
router.post("/forgot-password", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json("User not found!");
    }

    if (!user.passwordChangeRequired) {
      // Set the passwordChangeRequired property to true
      user.passwordChangeRequired = true;
    }

    // Generate a new password
    const newPassword = generateRandomPassword();

    // Update the user's password in the database
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    // Send email to user with new password
    const forgotPasswordEmail = forgotPasswordTemplate(user.firstName, newPassword);
    await sendEmail(user.email, "Your password has been reset", forgotPasswordEmail);

    return res.status(200).json("Password reset successfully!");
  } catch (err) {
    // Handle any errors that occur during the process
    console.error(err);
    return res.status(500).json("An error occurred.");
  }
});

// Change password
router.post("/change-password", async (req, res) => {
  try {
    const { userId, currentPassword, newPassword } = req.body;

    // Find the user by their userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json("User not found!");
    }

    // Check if the current password provided matches the user's stored password
    const validPassword = await bcrypt.compare(currentPassword, user.password);

    if (!validPassword) {
      return res.status(400).json("Invalid current password!");
    }

    // Update the user's password with the new password, change passwordChangeRequired property to false
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.passwordChangeRequired = false; 
    await user.save();

    return res.status(200).json("Password changed successfully!");
  } catch (err) {
    console.error(err);
    return res.status(500).json("An error occurred.");
  }
});

module.exports = router;
